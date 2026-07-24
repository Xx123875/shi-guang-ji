'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-romantic-gradient-2">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* 浮动装饰元素 */}
        <div className="absolute top-[15%] left-[10%] text-4xl opacity-20 animate-float">💕</div>
        <div className="absolute top-[25%] right-[15%] text-3xl opacity-15 animate-float-delay">🌸</div>
        <div className="absolute bottom-[30%] left-[20%] text-3xl opacity-15 animate-float-delay-2">✨</div>
        <div className="absolute bottom-[20%] right-[10%] text-4xl opacity-20 animate-float">💗</div>
        <div className="absolute top-[40%] left-[5%] text-2xl opacity-10 animate-float-delay">💌</div>
        <div className="absolute top-[10%] right-[5%] text-2xl opacity-10 animate-float-delay-2">🦋</div>

        <div className="text-center z-10 animate-fade-in-up">
          {/* Logo */}
          <div className="inline-flex items-center justify-center mb-6">
            <svg className="w-16 h-16 text-primary animate-heartbeat" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 tracking-tight">
            拾光记
          </h1>
          <p className="text-xl text-gray-500 mb-12 max-w-md mx-auto">
            记录你们的每一段时光
          </p>

          {/* CTA */}
          <Link href="/login">
            <button className="bg-primary text-white px-10 py-3.5 rounded-full text-lg font-medium hover:bg-primary-hover transition-all hover:shadow-lg hover:shadow-primary/20 hover:scale-105">
              开始记录
            </button>
          </Link>

          <p className="text-sm text-gray-400 mt-6">
            已有账号？{' '}
            <Link href="/login" className="text-primary hover:underline">
              去登录
            </Link>
          </p>
        </div>

        {/* 向下箭头 */}
        <div className="absolute bottom-8 animate-bounce">
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* 功能展示区 */}
      <section className="py-20 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
          用心记录，珍藏爱意
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-lg mx-auto">
          拾光记为每一对恋人提供专属的私密空间，记录你们在一起的每一个美好瞬间
        </p>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '💕',
              title: '纪念日',
              desc: '记录每一个重要的日子，自动倒计时，不错过任何一个特别时刻',
              gradient: 'from-pink-100 to-rose-100',
            },
            {
              icon: '📷',
              title: '照片图库',
              desc: '上传你们的合照，按相册分类管理，随时回味美好时光',
              gradient: 'from-blue-50 to-cyan-50',
            },
            {
              icon: '📖',
              title: '情侣日记',
              desc: '共同记录生活点滴，分享彼此的心情，留下你们的爱情故事',
              gradient: 'from-purple-50 to-violet-50',
            },
            {
              icon: '💬',
              title: '聊天留言',
              desc: '专属的留言空间，分享想说的话，让爱意在文字间流淌',
              gradient: 'from-amber-50 to-yellow-50',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 特色亮点 */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: '隐私安全',
                desc: '一对一情侣绑定，只有你们两个能看到彼此的内容',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: '邀请码绑定',
                desc: '注册后获得专属邀请码，发给另一半即可绑定',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: '移动优先',
                desc: '专为手机端设计，随时随地记录你们的甜蜜时刻',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 底部 */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          开始记录你们的故事
        </h2>
        <p className="text-gray-500 mb-8">
          免费注册，只需一个邮箱即可开始
        </p>
        <Link href="/login">
          <button className="bg-primary text-white px-10 py-3.5 rounded-full text-lg font-medium hover:bg-primary-hover transition-all hover:shadow-lg hover:shadow-primary/20">
            立即开始
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-200/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-sm font-medium text-gray-600">拾光记</span>
        </div>
        <p className="text-xs text-gray-400">
          记录我们的每一段时光
        </p>
      </footer>
    </div>
  );
}
