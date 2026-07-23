"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "首页",
  "/anniversary": "纪念日",
  "/calendar": "日历",
  "/gallery": "情侣图库",
  "/recycle-bin": "回收站",
  "/chat": "聊天",
  "/diary": "日记与心情",
  "/settings": "设置",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "拾光记";

  return (
    <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* 左侧：页面标题 */}
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      {/* 右侧：操作区 */}
      <div className="flex items-center gap-4">
        {/* 通知铃铛 */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {/* 未读小红点 */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        {/* 用户头像 */}
        <div className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white text-xs font-bold">
            美
          </div>
          <span className="text-sm text-gray-600">小美</span>
        </div>
      </div>
    </header>
  );
}
