'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, profile, partner, signOut, refreshProfile } = useAuth();
  const [nickname, setNickname] = useState(profile?.nickname || '');
  const [gender, setGender] = useState(profile?.gender || 'other');
  const [birthday, setBirthday] = useState(profile?.birthday || '');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supabase) return;

    setLoading(true);
    setMessage(null);

    const { error } = await supabase
      .from('profiles')
      .update({ nickname: nickname.trim(), gender, birthday: birthday || null })
      .eq('id', user.id);

    if (error) {
      setMessage({ type: 'error', text: '保存失败' });
    } else {
      setMessage({ type: 'success', text: '个人资料已更新' });
      refreshProfile();
    }
    setLoading(false);
  };

  const handleBindPartner = async () => {
    if (!user || !supabase || !inviteCodeInput.trim()) return;

    setMessage(null);

    const { data: targetProfile, error: queryError } = await supabase
      .from('profiles')
      .select('*')
      .eq('invite_code', inviteCodeInput.trim().toUpperCase())
      .single();

    if (queryError || !targetProfile) {
      setMessage({ type: 'error', text: '邀请码无效' });
      return;
    }

    if (targetProfile.id === user.id) {
      setMessage({ type: 'error', text: '不能和自己绑定' });
      return;
    }

    if (targetProfile.partner_id) {
      setMessage({ type: 'error', text: '该用户已绑定其他人' });
      return;
    }

    // 双向绑定
    const { error } = await supabase
      .from('profiles')
      .update({ partner_id: targetProfile.id })
      .eq('id', user.id);

    if (error) {
      setMessage({ type: 'error', text: '绑定失败' });
      return;
    }

    await supabase
      .from('profiles')
      .update({ partner_id: user.id })
      .eq('id', targetProfile.id);

    setMessage({ type: 'success', text: `已成功与 ${targetProfile.nickname || targetProfile.email} 绑定` });
    setInviteCodeInput('');
    refreshProfile();
  };

  const handleUnbind = async () => {
    if (!user || !partner || !supabase) return;

    if (!confirm('确定要解除伴侣绑定吗？')) return;

    // 双向解绑
    await supabase.from('profiles').update({ partner_id: null }).eq('id', user.id);
    await supabase.from('profiles').update({ partner_id: null }).eq('id', partner.id);

    setMessage({ type: 'success', text: '已解除伴侣绑定' });
    refreshProfile();
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 提示消息 */}
      {message && (
        <div className={`text-sm p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {message.text}
        </div>
      )}

      {/* 个人资料 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h3 className="font-semibold text-gray-800 text-lg">个人资料</h3>

        {/* 头像 */}
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="头像" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white text-2xl font-bold">
              {profile?.nickname ? profile.nickname.charAt(0) : '?'}
            </div>
          )}
        </div>

        {/* 表单 */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">生日</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="other">保密</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存修改'}
          </button>
        </form>
      </div>

      {/* 情侣绑定 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800 text-lg">情侣绑定</h3>

        {partner ? (
          <div>
            <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white font-bold">
                  {profile?.nickname ? profile.nickname.charAt(0) : '?'}
                </div>
                <svg className="w-6 h-6 text-primary animate-heartbeat" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-white font-bold">
                  {partner.nickname ? partner.nickname.charAt(0) : '?'}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {profile?.nickname || '我'} <span className="text-primary">&</span> {partner.nickname || '伴侣'}
                </p>
                <p className="text-xs text-gray-400 mt-1">已绑定</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">已绑定</span>
            </div>
            <button
              onClick={handleUnbind}
              className="text-sm text-red-500 hover:text-red-600 hover:underline"
            >
              解除伴侣绑定
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-3">输入伴侣的邀请码进行绑定</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                placeholder="输入邀请码"
                maxLength={8}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary uppercase tracking-wider font-mono"
              />
              <button
                onClick={handleBindPartner}
                disabled={!inviteCodeInput.trim()}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                绑定
              </button>
            </div>
          </div>
        )}

        {/* 我的邀请码 */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            我的邀请码：
            <code className="bg-white px-2 py-0.5 rounded text-blue-600 font-mono text-lg ml-1">
              {profile?.invite_code || '...'}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(profile?.invite_code || '')}
              className="ml-2 text-blue-500 text-xs hover:underline"
            >
              复制
            </button>
          </p>
        </div>
      </div>

      {/* 账号操作 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800 text-lg">账号</h3>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
        >
          退出登录
        </button>
      </div>
    </div>
  );
}
