"use client";

import { useState } from "react";

const settingTabs = [
  "个人资料",
  "情侣绑定",
  "主题设置",
  "通知提醒",
  "隐私安全",
  "存储管理",
];

const themes = [
  { name: "粉色浪漫", active: true, gradient: "from-pink-300 to-rose-400" },
  { name: "深夜星空", active: false, gradient: "from-indigo-800 to-purple-900" },
  { name: "清新绿意", active: false, gradient: "from-green-300 to-emerald-400" },
  { name: "暖阳橘光", active: false, gradient: "from-orange-300 to-amber-400" },
  { name: "薰衣草梦", active: false, gradient: "from-purple-300 to-violet-400" },
  { name: "海洋之心", active: false, gradient: "from-sky-300 to-blue-400" },
  { name: "樱花物语", active: false, gradient: "from-pink-200 to-rose-200" },
  { name: "落日余晖", active: false, gradient: "from-red-400 to-amber-500" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTheme, setActiveTheme] = useState(0);

  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧设置导航 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-2">
            {settingTabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === i
                    ? "bg-primary-50 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 右侧设置内容 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 个人资料 */}
          {activeTab === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h3 className="font-semibold text-gray-800 text-lg">个人资料</h3>

              {/* 头像 */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white text-2xl font-bold">
                  美
                </div>
                <button className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                  更换头像
                </button>
              </div>

              {/* 表单 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
                  <input type="text" defaultValue="小美" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">生日</label>
                  <input type="date" defaultValue="1998-06-15" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
                  <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                    <option>女</option>
                    <option>男</option>
                    <option>保密</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input type="email" defaultValue="xiaomei@example.com" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">个性签名</label>
                  <textarea defaultValue="记录我们的每一天" rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
                </div>
              </div>

              <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
                保存修改
              </button>
            </div>
          )}

          {/* 主题设置 */}
          {activeTab === 2 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h3 className="font-semibold text-gray-800 text-lg">选择主题</h3>

              {/* 预设主题 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {themes.map((theme, i) => (
                  <button
                    key={theme.name}
                    onClick={() => setActiveTheme(i)}
                    className={`rounded-xl overflow-hidden transition-all ${
                      activeTheme === i ? "ring-2 ring-primary scale-105" : "hover:scale-102"
                    }`}
                  >
                    <div className={`h-16 bg-gradient-to-r ${theme.gradient}`}></div>
                    <div className="px-2 py-1.5 bg-gray-50 flex items-center justify-between">
                      <span className="text-xs text-gray-700">{theme.name}</span>
                      {activeTheme === i && (
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* 自定义主题 */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-semibold text-gray-800 mb-4">自定义主题</h4>
                <div className="flex flex-wrap gap-6 items-start">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">主色调</label>
                    <div className="w-12 h-12 rounded-full bg-primary cursor-pointer ring-2 ring-offset-2 ring-primary"></div>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm text-gray-600 mb-2">背景图片</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary-50/30 transition-colors">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-gray-400">上传背景图片</p>
                    </div>
                  </div>
                </div>
                <button className="mt-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
                  应用自定义主题
                </button>
              </div>
            </div>
          )}

          {/* 情侣绑定 */}
          {activeTab === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 text-lg mb-4">情侣绑定</h3>
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white font-bold">美</div>
                  <svg className="w-6 h-6 text-primary animate-heartbeat" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-white font-bold">明</div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">小美 <span className="text-primary">&</span> 小明</p>
                  <p className="text-xs text-gray-400 mt-1">绑定于 2025年3月14日</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">已绑定</span>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  你的邀请码：<code className="bg-white px-2 py-0.5 rounded text-blue-600 font-mono">SGJ-XM-2025</code>
                  <button className="ml-2 text-blue-500 text-xs hover:underline">复制</button>
                </p>
              </div>
            </div>
          )}

          {/* 其他设置 Tab 占位 */}
          {activeTab === 3 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 text-lg mb-4">通知提醒</h3>
              <div className="space-y-4">
                {[
                  { label: "纪念日提醒", desc: "在纪念日当天和提前1天发送通知", on: true },
                  { label: "生日提醒", desc: "提前3天发送生日通知", on: true },
                  { label: "节日祝福", desc: "情人节、七夕等节日自动祝福", on: true },
                  { label: "日记提醒", desc: "每天晚上8点提醒写日记", on: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${item.on ? "bg-primary" : "bg-gray-300"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${item.on ? "translate-x-5.5 mt-1 ml-0.5" : "translate-x-1 mt-1"}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 4 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 text-lg mb-4">隐私安全</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-700">阅后即焚</p>
                    <p className="text-xs text-gray-400 mt-0.5">对方查看后消息自动删除</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">已开启</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-700">账号安全</p>
                    <p className="text-xs text-gray-400 mt-0.5">修改密码、绑定手机号</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">管理</button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">注销账号</p>
                    <p className="text-xs text-gray-400 mt-0.5">永久删除账号和所有数据</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-500 hover:bg-red-100">注销</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 5 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 text-lg mb-4">存储管理</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">已使用空间</span>
                    <span className="text-sm text-gray-800 font-medium">2.3 GB / 10 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "23%" }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-lg font-bold text-gray-800">128</p>
                    <p className="text-xs text-gray-400">照片</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-lg font-bold text-gray-800">52</p>
                    <p className="text-xs text-gray-400">日记</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
