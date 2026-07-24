# 拾光记 - Supabase 数据库 Schema

本文档包含拾光记应用所需的全部 SQL。请按顺序在 Supabase SQL Editor 中执行。

---

## 1. 创建表

### profiles 表（用户资料）

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  invite_code TEXT UNIQUE NOT NULL,
  invited_by UUID REFERENCES profiles(id),
  partner_id UUID REFERENCES profiles(id),
  birthday DATE,
  relationship_start_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### anniversaries 表（纪念日）

```sql
CREATE TABLE anniversaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT DEFAULT 'custom' CHECK (type IN ('relationship', 'birthday', 'custom')),
  is_recurring BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### photos 表（照片）

```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  album_name TEXT DEFAULT '默认相册',
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### diaries 表（日记）

```sql
CREATE TABLE diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT,
  is_shared BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### messages 表（聊天/留言）

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### mood_records 表（心情记录）

```sql
CREATE TABLE mood_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, DATE(created_at))
);
```

---

## 2. 触发器 - 自动生成邀请码

```sql
-- 邀请码生成函数
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
END;
$$ LANGUAGE PLPGSQL;

-- 新用户注册时自动生成邀请码
CREATE OR REPLACE FUNCTION set_default_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL THEN
    NEW.invite_code := generate_invite_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER trg_set_invite_code
  BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_default_invite_code();

-- 自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER trg_update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 3. 触发器 - 新用户注册自动创建 profile

```sql
-- 新用户注册时自动创建 profile 记录
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, invite_code)
  VALUES (NEW.id, NEW.email, NULL);
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 4. 启用 RLS（Row Level Security）

```sql
-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE anniversaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_records ENABLE ROW LEVEL SECURITY;
```

---

## 5. RLS 策略 - profiles

```sql
-- 用户可以查看自己的 profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 用户可以更新自己的 profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 用户可以查看伴侣的 profile（简化版，避免无限递归）
CREATE POLICY "Users can view partner profile"
  ON profiles FOR SELECT
  USING (partner_id = auth.uid());

-- 用户可以更新伴侣绑定信息
CREATE POLICY "Users can update partner binding"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 通过邀请码查询 profile（需要登录）
CREATE POLICY "Users can view profiles by invite code"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);
```

---

## 6. RLS 策略 - anniversaries

```sql
-- 用户可以查看自己和伴侣的纪念日
CREATE POLICY "Users can view own anniversaries"
  ON anniversaries FOR SELECT
  USING (
    user_id = auth.uid()
    OR user_id IN (
      SELECT partner_id FROM profiles WHERE id = auth.uid()
    )
  );

-- 用户可以创建自己的纪念日
CREATE POLICY "Users can insert own anniversaries"
  ON anniversaries FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 用户可以更新自己的纪念日
CREATE POLICY "Users can update own anniversaries"
  ON anniversaries FOR UPDATE
  USING (user_id = auth.uid());

-- 用户可以删除自己的纪念日
CREATE POLICY "Users can delete own anniversaries"
  ON anniversaries FOR DELETE
  USING (user_id = auth.uid());
```

---

## 7. RLS 策略 - photos

```sql
-- 用户可以查看自己和伴侣的照片
CREATE POLICY "Users can view own photos"
  ON photos FOR SELECT
  USING (
    user_id = auth.uid()
    OR user_id IN (
      SELECT partner_id FROM profiles WHERE id = auth.uid()
    )
  );

-- 用户可以上传自己的照片
CREATE POLICY "Users can insert own photos"
  ON photos FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 用户可以更新自己的照片
CREATE POLICY "Users can update own photos"
  ON photos FOR UPDATE
  USING (user_id = auth.uid());

-- 用户可以删除自己的照片
CREATE POLICY "Users can delete own photos"
  ON photos FOR DELETE
  USING (user_id = auth.uid());
```

---

## 8. RLS 策略 - diaries

```sql
-- 用户可以查看自己的日记，以及伴侣选择分享的日记
CREATE POLICY "Users can view own and shared diaries"
  ON diaries FOR SELECT
  USING (
    user_id = auth.uid()
    OR (
      is_shared = true
      AND user_id IN (
        SELECT partner_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- 用户可以写自己的日记
CREATE POLICY "Users can insert own diaries"
  ON diaries FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 用户可以更新自己的日记
CREATE POLICY "Users can update own diaries"
  ON diaries FOR UPDATE
  USING (user_id = auth.uid());

-- 用户可以删除自己的日记
CREATE POLICY "Users can delete own diaries"
  ON diaries FOR DELETE
  USING (user_id = auth.uid());
```

---

## 9. RLS 策略 - messages

```sql
-- 用户可以查看自己和伴侣之间的消息
CREATE POLICY "Users can view messages with partner"
  ON messages FOR SELECT
  USING (
    sender_id = auth.uid()
    OR receiver_id = auth.uid()
  );

-- 用户可以发送消息给伴侣
CREATE POLICY "Users can send messages to partner"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- 用户可以删除自己发送的消息
CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (sender_id = auth.uid());
```

---

## 10. RLS 策略 - mood_records

```sql
-- 用户可以查看自己和伴侣的心情记录
CREATE POLICY "Users can view own and partner moods"
  ON mood_records FOR SELECT
  USING (
    user_id = auth.uid()
    OR user_id IN (
      SELECT partner_id FROM profiles WHERE id = auth.uid()
    )
  );

-- 用户可以记录自己的心情
CREATE POLICY "Users can insert own mood records"
  ON mood_records FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

---

## 11. Storage Bucket - 照片存储

```sql
-- 插入 Storage Bucket 用于存储用户上传的照片
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;
```

### Storage RLS 策略 - avatars

```sql
-- 允许所有人查看头像
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- 允许用户上传自己的头像
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 允许用户更新自己的头像
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Storage RLS 策略 - photos

```sql
-- 允许用户和伴侣查看照片
CREATE POLICY "Photo images are accessible to users and partners"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'photos'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND partner_id::text = (storage.foldername(name))[1]
      )
    )
  );

-- 允许用户上传自己的照片
CREATE POLICY "Users can upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 允许用户删除自己的照片
CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 12. 完整执行脚本（合并版）

以下是可一次性在 Supabase SQL Editor 中执行的完整 SQL：

```sql
-- =============================================
-- 拾光记 数据库初始化脚本
-- 在 Supabase Dashboard > SQL Editor 中执行
-- =============================================

-- 1. 创建表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  invite_code TEXT UNIQUE NOT NULL,
  invited_by UUID REFERENCES profiles(id),
  partner_id UUID REFERENCES profiles(id),
  birthday DATE,
  relationship_start_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS anniversaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT DEFAULT 'custom' CHECK (type IN ('relationship', 'birthday', 'custom')),
  is_recurring BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  album_name TEXT DEFAULT '默认相册',
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT,
  is_shared BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mood_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, DATE(created_at))
);

-- 2. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_profiles_invite_code ON profiles(invite_code);
CREATE INDEX IF NOT EXISTS idx_profiles_partner_id ON profiles(partner_id);
CREATE INDEX IF NOT EXISTS idx_anniversaries_user_id ON anniversaries(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_user_id ON photos(user_id);
CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON diaries(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_mood_records_user_id ON mood_records(user_id);

-- 3. 触发器 - 自动生成邀请码
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION set_default_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL THEN
    NEW.invite_code := generate_invite_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS trg_set_invite_code ON profiles;
CREATE TRIGGER trg_set_invite_code
  BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_default_invite_code();

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS trg_update_profiles_updated_at ON profiles;
CREATE TRIGGER trg_update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. 触发器 - 新用户自动创建 profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, invite_code)
  VALUES (NEW.id, NEW.email, NULL);
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE anniversaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_records ENABLE ROW LEVEL SECURITY;

-- 6. RLS 策略 - profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 允许用户更新伴侣的 partner_id（简化版，避免无限递归）
DROP POLICY IF EXISTS "Users can update partner binding" ON profiles;
CREATE POLICY "Users can update partner binding"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view partner profile" ON profiles;
CREATE POLICY "Users can view partner profile"
  ON profiles FOR SELECT
  USING (partner_id = auth.uid());

DROP POLICY IF EXISTS "Users can view profiles by invite code" ON profiles;
CREATE POLICY "Users can view profiles by invite code"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 7. RLS 策略 - anniversaries
DROP POLICY IF EXISTS "Users can view own anniversaries" ON anniversaries;
CREATE POLICY "Users can view own anniversaries"
  ON anniversaries FOR SELECT
  USING (
    user_id = auth.uid()
    OR user_id IN (SELECT partner_id FROM profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own anniversaries" ON anniversaries;
CREATE POLICY "Users can insert own anniversaries"
  ON anniversaries FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own anniversaries" ON anniversaries;
CREATE POLICY "Users can update own anniversaries"
  ON anniversaries FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own anniversaries" ON anniversaries;
CREATE POLICY "Users can delete own anniversaries"
  ON anniversaries FOR DELETE
  USING (user_id = auth.uid());

-- 8. RLS 策略 - photos
DROP POLICY IF EXISTS "Users can view own photos" ON photos;
CREATE POLICY "Users can view own photos"
  ON photos FOR SELECT
  USING (
    user_id = auth.uid()
    OR user_id IN (SELECT partner_id FROM profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own photos" ON photos;
CREATE POLICY "Users can insert own photos"
  ON photos FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own photos" ON photos;
CREATE POLICY "Users can update own photos"
  ON photos FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own photos" ON photos;
CREATE POLICY "Users can delete own photos"
  ON photos FOR DELETE
  USING (user_id = auth.uid());

-- 9. RLS 策略 - diaries
DROP POLICY IF EXISTS "Users can view own and shared diaries" ON diaries;
CREATE POLICY "Users can view own and shared diaries"
  ON diaries FOR SELECT
  USING (
    user_id = auth.uid()
    OR (
      is_shared = true
      AND user_id IN (SELECT partner_id FROM profiles WHERE id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own diaries" ON diaries;
CREATE POLICY "Users can insert own diaries"
  ON diaries FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own diaries" ON diaries;
CREATE POLICY "Users can update own diaries"
  ON diaries FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own diaries" ON diaries;
CREATE POLICY "Users can delete own diaries"
  ON diaries FOR DELETE
  USING (user_id = auth.uid());

-- 10. RLS 策略 - messages
DROP POLICY IF EXISTS "Users can view messages with partner" ON messages;
CREATE POLICY "Users can view messages with partner"
  ON messages FOR SELECT
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

DROP POLICY IF EXISTS "Users can send messages to partner" ON messages;
CREATE POLICY "Users can send messages to partner"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own messages" ON messages;
CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (sender_id = auth.uid());

-- 11. RLS 策略 - mood_records
DROP POLICY IF EXISTS "Users can view own and partner moods" ON mood_records;
CREATE POLICY "Users can view own and partner moods"
  ON mood_records FOR SELECT
  USING (
    user_id = auth.uid()
    OR user_id IN (SELECT partner_id FROM profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own mood records" ON mood_records;
CREATE POLICY "Users can insert own mood records"
  ON mood_records FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 12. Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS - avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage RLS - photos
DROP POLICY IF EXISTS "Photo images are accessible to users and partners" ON storage.objects;
CREATE POLICY "Photo images are accessible to users and partners"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'photos'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND partner_id::text = (storage.foldername(name))[1]
      )
    )
  );

DROP POLICY IF EXISTS "Users can upload own photos" ON storage.objects;
CREATE POLICY "Users can upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;
CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 使用说明

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建新项目（或使用已有项目）
3. 进入 **SQL Editor**
4. 复制上方「完整执行脚本」部分，粘贴并执行
5. 进入 **Authentication > Providers**，确保 **Email** 的 **Confirm email** 设置为关闭（因为我们使用 OTP 验证码登录）
6. 在项目根目录创建 `.env.local` 文件，填入项目的 URL 和 Anon Key

**注意**：关闭「Confirm email」后，Supabase 会直接发送 6 位 OTP 验证码到邮箱，适合我们「邮箱 + 验证码」的登录方式。
