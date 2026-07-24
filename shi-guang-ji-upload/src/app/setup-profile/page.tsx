'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export default function SetupProfilePage() {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  const [inviteCode, setInviteCode] = useState('');
  const [relationshipDate, setRelationshipDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bindResult, setBindResult] = useState<{ success: boolean; message: string } | null>(null);
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const router = useRouter();

  // 如果未登录，跳转登录页
  useEffect(() => {
    if (!authLoading && (!user || !supabase)) {
      router.replace('/login');
    }
    // 如果已有昵称，跳转首页
    if (!authLoading && profile?.nickname) {
      router.replace('/home');
    }
  }, [user, profile, authLoading, router]);

  const handleBindPartner = async () => {
    if (!inviteCode.trim() || !user || !supabase) return;

    setError('');
    setBindResult(null);

    // 通过邀请码查找目标用户
    const { data: targetProfile, error: queryError } = await supabase
      .from('profiles')
      .select('*')
      .eq('invite_code', inviteCode.trim().toUpperCase())
      .single();

    if (queryError || !targetProfile) {
      setBindResult({ success: false, message: '邀请码无效，请检查后重试' });
      return;
    }

    if (targetProfile.id === user.id) {
      setBindResult({ success: false, message: '不能和自己绑定' });
      return;
    }

    if (targetProfile.partner_id) {
      setBindResult({ success: false, message: '该用户已与其他人绑定' });
      return;
    }

    // 双向绑定
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        partner_id: targetProfile.id,
        relationship_start_date: relationshipDate || null,
      })
      .eq('id', user.id);

    if (updateError) {
      setBindResult({ success: false, message: '绑定失败，请稍后重试' });
      return;
    }

    const { error: updatePartnerError } = await supabase
      .from('profiles')
      .update({
        partner_id: user.id,
        relationship_start_date: relationshipDate || null,
      })
      .eq('id', targetProfile.id);

    if (updatePartnerError) {
      // 回滚
      await supabase.from('profiles').update({ partner_id: null }).eq('id', user.id);
      setBindResult({ success: false, message: '绑定失败，请稍后重试' });
      return;
    }

    setBindResult({ success: true, message: `已成功与 ${targetProfile.nickname || targetProfile.email} 绑定` });
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError('请输入昵称');
      return;
    }

    if (!supabase) {
      setError('服务未配置，请联系管理员');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await supabase
      .from('profiles')
      .update({
        nickname: nickname.trim(),
        gender,
        birthday: null,
      })
      .eq('id', user?.id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // 如果有邀请码，先绑定
    if (inviteCode.trim()) {
      await handleBindPartner();
    }

    setLoading(false);
    await refreshProfile();
    router.replace('/home');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-pink-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
          <p className="text-sm text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-romantic-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-3xl font-bold text-gray-800">拾光记</span>
          </div>
          <p className="text-gray-500 text-sm">设置你的个人资料</p>
        </div>

        {/* 设置卡片 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleComplete} className="space-y-5">
            {/* 头像占位 */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white text-2xl font-bold">
                {nickname ? nickname.charAt(0) : '?'}
              </div>
            </div>

            {/* 昵称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                昵称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="给你取一个好听的名字"
                required
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {/* 性别 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
              <div className="flex gap-3">
                {[
                  { value: 'male', label: '男' },
                  { value: 'female', label: '女' },
                  { value: 'other', label: '保密' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGender(option.value as 'male' | 'female' | 'other')}
                    className={`flex-1 py-2 text-sm rounded-lg transition-all ${
                      gender === option.value
                        ? 'bg-primary-50 text-primary border-2 border-primary'
                        : 'bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 分割线 */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 mb-3">以下为可选项</p>

              {/* 邀请码 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  伴侣邀请码
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="输入另一半的邀请码"
                  maxLength={8}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary uppercase tracking-wider font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">
                  如果你的伴侣已注册，可在此输入邀请码进行绑定
                </p>
              </div>

              {/* 恋爱开始日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  恋爱开始日期
                </label>
                <input
                  type="date"
                  value={relationshipDate}
                  onChange={(e) => setRelationshipDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>

            {/* 绑定结果提示 */}
            {bindResult && (
              <div className={`text-sm p-3 rounded-lg ${
                bindResult.success
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
              }`}>
                {bindResult.message}
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* 完成按钮 */}
            <button
              type="submit"
              disabled={loading || !nickname.trim()}
              className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '保存中...' : '完成设置'}
            </button>

            <button
              type="button"
              onClick={() => router.replace('/home')}
              className="w-full text-sm text-gray-400 hover:text-gray-600"
            >
              稍后再设置
            </button>
          </form>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-6 space-x-3">
          <span className="text-2xl opacity-40">💕</span>
          <span className="text-xl opacity-30">🌸</span>
          <span className="text-2xl opacity-40">💗</span>
        </div>
      </div>
    </div>
  );
}
