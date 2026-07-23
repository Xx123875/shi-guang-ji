"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-pink-50 flex items-center justify-center p-4">
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
          {/* Tab 切换 */}
          <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 text-sm rounded-md font-medium transition-all ${
                !isRegister ? "bg-white text-primary shadow-sm" : "text-gray-500"
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 text-sm rounded-md font-medium transition-all ${
                isRegister ? "bg-white text-primary shadow-sm" : "text-gray-500"
              }`}
            >
              注册
            </button>
          </div>

          {/* 表单 */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
                <input
                  type="text"
                  placeholder="输入你的昵称"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                placeholder="输入邮箱地址"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                type="password"
                placeholder="输入密码"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
                <input
                  type="password"
                  placeholder="再次输入密码"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            )}

            {!isRegister && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  记住我
                </label>
                <a href="#" className="text-sm text-primary hover:underline">忘记密码？</a>
              </div>
            )}

            <Link href="/">
              <button
                type="submit"
                className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                {isRegister ? "注册账号" : "登录"}
              </button>
            </Link>
          </form>

          {/* 底部提示 */}
          {!isRegister && (
            <p className="text-center text-sm text-gray-400 mt-4">
              还没有账号？{" "}
              <button onClick={() => setIsRegister(true)} className="text-primary hover:underline">
                立即注册
              </button>
            </p>
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
