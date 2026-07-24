'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { signUp, verifyOtp, user, profile, loading: authLoading } = useAuth();
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');

    const { error } = await signUp(email.trim());
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      setSuccessMsg('验证码已发送到你的邮箱');
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || otp.length !== 6) return;

    setLoading(true);
    setError('');

    const { error } = await verifyOtp(email.trim(), otp);
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      // 验证成功，跳转到设置页或首页（由上面的条件判断处理）
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

        {/* 登录卡片 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <h2 className="text-xl font-semibold text-gray-800 text-center">
                登录 / 注册
              </h2>
              <p className="text-sm text-gray-500 text-center">
                输入你的邮箱，我们将发送验证码
              </p>

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

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '发送中...' : '发送验证码'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <h2 className="text-xl font-semibold text-gray-800 text-center">
                输入验证码
              </h2>
              <p className="text-sm text-gray-500 text-center">
                验证码已发送至 <span className="text-primary font-medium">{email}</span>
              </p>

              {successMsg && (
                <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">
                  {successMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">6位验证码</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-center text-2xl tracking-[0.5em] font-mono"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '验证中...' : '验证登录'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setError('');
                  setSuccessMsg('');
                  setOtp('');
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                返回修改邮箱
              </button>
            </form>
          )}
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
