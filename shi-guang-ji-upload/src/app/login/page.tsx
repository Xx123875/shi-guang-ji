'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { signUp, signIn, user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  // 如果已登录且有 profile，跳转首页
  if (!authLoading && user && profile?.nickname) {
    router.replace('/home');
    return null;
  }

  // 如果已登录但没设昵称，跳转设置页
  if (!authLoading && user && !profile?.nickname) {
    router.replace('/setup-profile');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (isRegister) {
      // 注册
      if (password.length < 6) {
        setError('密码至少 6 位');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email.trim(), password);
      setLoading(false);
      if (error) {
        setError(error);
      } else {
        setSuccessMsg('注册成功！');
        setIsRegister(false);
        setPassword('');
        setConfirmPassword('');
      }
    } else {
      // 登录
      const { error } = await signIn(email.trim(), password);
      setLoading(false);
      if (error) {
        setError(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-romantic-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <svg className="w-10 h-10 text-primary animate-heartbeat" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-3xl font-bold text-gray-800">拾光记</span>
          </div>
          <p className="text-gray-500 text-sm">记录我们的每一段时光</p>
        </div>

        {/* 登录/注册卡片 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              {isRegister ? '创建账户' : '登录'}
            </h2>
            <p className="text-sm text-gray-500 text-center">
              {isRegister ? '设置邮箱和密码来注册新账户' : '输入你的邮箱和密码登录'}
            </p>

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码 {isRegister && <span className="text-gray-400 font-normal">(至少 6 位)</span>}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? '设置密码' : '输入密码'}
                required
                minLength={6}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {/* 确认密码（仅注册时显示） */}
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isRegister ? '注册中...' : '登录中...') : (isRegister ? '注册' : '登录')}
            </button>

            {/* 切换登录/注册 */}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccessMsg('');
                setConfirmPassword('');
              }}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              {isRegister ? '已有账户？去登录' : '没有账户？去注册'}
            </button>
          </form>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-6 space-x-3">
          <span className="text-2xl opacity-40">💕</span>
          <span className="text-xl opacity-30">🌸</span>
          <span className="text-2xl opacity-40">💗</span>
          <span className="text-xl opacity-30">✨</span>
          <span className="text-2xl opacity-40">💕</span>
        </div>
      </div>
    </div>
  );
}
