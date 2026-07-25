-- ============================================
-- 拾光记 - 修复情侣双向绑定问题
-- 请在 Supabase Dashboard → SQL Editor 中执行
-- ============================================
--
-- 问题原因：
--   RLS 策略限制用户只能更新自己的记录（auth.uid() = id），
--   所以前端代码中更新对方 partner_id 的操作会静默失败，
--   导致只有单向绑定。
--
-- 解决方案：
--   创建 SECURITY DEFINER 的 RPC 函数，在数据库层面原子性完成双向绑定。
--   SECURITY DEFINER 会以函数创建者（即超级用户）的身份执行，
--   绕过 RLS 限制。
-- ============================================

-- 1. 创建双向绑定函数
CREATE OR REPLACE FUNCTION public.bind_partner(
  p_user_id UUID,
  p_target_invite_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_target_id UUID;
  v_target_partner_id UUID;
  v_user_partner_id UUID;
  v_target_nickname TEXT;
  v_self_bind BOOLEAN := FALSE;
  v_target_already_bound BOOLEAN := FALSE;
  v_user_already_bound BOOLEAN := FALSE;
BEGIN
  -- 查找目标用户
  SELECT id, partner_id, nickname INTO v_target_id, v_target_partner_id, v_target_nickname
  FROM public.profiles
  WHERE invite_code = UPPER(TRIM(p_target_invite_code))
  LIMIT 1;

  -- 邀请码无效
  IF v_target_id IS NULL THEN
    RETURN JSONB_BUILD_OBJECT('success', FALSE, 'error', '邀请码无效');
  END IF;

  -- 不能和自己绑定
  IF v_target_id = p_user_id THEN
    RETURN JSONB_BUILD_OBJECT('success', FALSE, 'error', '不能和自己绑定');
  END IF;

  -- 检查当前用户是否已绑定
  SELECT partner_id INTO v_user_partner_id FROM public.profiles WHERE id = p_user_id;
  IF v_user_partner_id IS NOT NULL THEN
    RETURN JSONB_BUILD_OBJECT('success', FALSE, 'error', '你已经绑定了伴侣，请先解绑');
  END IF;

  -- 检查目标用户是否已绑定
  IF v_target_partner_id IS NOT NULL THEN
    RETURN JSONB_BUILD_OBJECT('success', FALSE, 'error', '该用户已绑定其他人');
  END IF;

  -- 原子性双向绑定（在同一事务中）
  UPDATE public.profiles SET partner_id = v_target_id WHERE id = p_user_id;
  UPDATE public.profiles SET partner_id = p_user_id WHERE id = v_target_id;

  RETURN JSONB_BUILD_OBJECT(
    'success', TRUE,
    'message', '绑定成功',
    'partner_nickname', COALESCE(v_target_nickname, '')
  );
END;
$$;

-- 2. 创建双向解绑函数
CREATE OR REPLACE FUNCTION public.unbind_partner(
  p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_partner_id UUID;
BEGIN
  SELECT partner_id INTO v_partner_id FROM public.profiles WHERE id = p_user_id;

  IF v_partner_id IS NULL THEN
    RETURN JSONB_BUILD_OBJECT('success', FALSE, 'error', '你还没有绑定伴侣');
  END IF;

  -- 原子性双向解绑
  UPDATE public.profiles SET partner_id = NULL WHERE id = p_user_id;
  UPDATE public.profiles SET partner_id = NULL WHERE id = v_partner_id;

  RETURN JSONB_BUILD_OBJECT('success', TRUE, 'message', '已解除伴侣绑定');
END;
$$;

-- 3. 修复现有的单向绑定数据
-- 将小狗不愿唱歌的 partner_id 补上
UPDATE public.profiles
SET partner_id = 'f9a2311f-56cb-48d0-90b7-4e12885f2b03'
WHERE id = '4c81ddce-4420-4363-b77d-635bce2c7cd5'
  AND partner_id IS NULL;
