"use client";

import { useState } from "react";

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "board">("chat");

  const messages = [
    { id: 1, sender: "other", text: "早上好呀，今天天气真好~", time: "09:30" },
    { id: 2, sender: "me", text: "是呀！我们去公园散步吧", time: "09:32" },
    { id: 3, sender: "other", text: "好呀好呀！我等你", time: "09:33" },
    { id: 4, sender: "me", text: "我出门了，大概10分钟到", time: "09:45" },
    { id: 5, sender: "other", text: "我准备好了，带了水和小零食", time: "09:50" },
    { id: 6, sender: "me", text: "想偷偷告诉你，我给你准备了一个惊喜", time: "10:01", burn: true },
  ];

  const boardMessages = [
    { id: 1, text: "亲爱的，今天很开心，谢谢你的陪伴", author: "小明", time: "3天前", color: "from-primary-100 to-primary-50" },
    { id: 2, text: "宝贝生日快乐！永远爱你", author: "小美", time: "1周前", color: "from-gold-100 to-gold-50" },
    { id: 3, text: "第一次约会的地方，我们再回去看看吧", author: "小明", time: "2周前", color: "from-pink-100 to-pink-50" },
    { id: 4, text: "有你在的每一天都很幸福", author: "小美", time: "3周前", color: "from-rose-100 to-rose-50" },
    { id: 5, text: "晚上做了你最爱吃的红烧排骨", author: "小明", time: "1个月前", color: "from-amber-100 to-amber-50" },
    { id: 6, text: "好想和你去一趟大理", author: "小美", time: "1个月前", color: "from-sky-100 to-sky-50" },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* 模式切换标签 */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 text-sm rounded-md transition-all ${
            activeTab === "chat"
              ? "bg-white text-primary shadow-sm font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          即时聊天
        </button>
        <button
          onClick={() => setActiveTab("board")}
          className={`px-4 py-2 text-sm rounded-md transition-all ${
            activeTab === "board"
              ? "bg-white text-primary shadow-sm font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          留言板
        </button>
      </div>

      {activeTab === "chat" ? (
        /* ====== 即时聊天模式 ====== */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
          <div className="flex h-full">
            {/* 左侧联系人列表 */}
            <div className="w-[280px] border-r border-gray-200 flex flex-col shrink-0">
              <div className="p-3">
                <input type="text" placeholder="搜索..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {/* 在线状态 */}
              <div className="px-4 py-3 flex items-center gap-3 bg-gray-50">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-white text-sm font-bold">明</div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">小明</p>
                  <p className="text-xs text-green-500">在线</p>
                </div>
              </div>
              {/* 对话列表 */}
              <div className="flex-1 overflow-y-auto">
                {[
                  { text: "好的，今晚一起吃饭", time: "5分钟前" },
                  { text: "我想你了", time: "2小时前" },
                  { text: "今天过得怎么样？", time: "昨天" },
                ].map((conv, i) => (
                  <div key={i} className={`px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${i === 0 ? "bg-primary-50/50" : ""}`}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-white text-xs font-bold shrink-0">明</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">小明</p>
                      <p className="text-xs text-gray-400 truncate">{conv.text}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{conv.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧聊天区 */}
            <div className="flex-1 flex flex-col">
              {/* 聊天头部 */}
              <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-white text-xs font-bold">明</div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">小明</p>
                    <p className="text-xs text-green-500">在线</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </button>
                  <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
              </div>

              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.sender === "me"
                          ? "bg-primary-100 text-gray-800 rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      } ${msg.burn ? "border border-orange-200 bg-orange-50" : ""}`}
                    >
                      {msg.burn && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[10px] text-orange-500">🔥 阅后即焚</span>
                        </div>
                      )}
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-primary-400" : "text-gray-400"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 输入框 */}
              <div className="px-5 py-3 border-t border-gray-200 flex items-center gap-3">
                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </button>
                <input
                  type="text"
                  placeholder="输入消息..."
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <button className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors">
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ====== 留言板模式 ====== */
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
              写留言
            </button>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {boardMessages.map((msg) => (
              <div
                key={msg.id}
                className={`break-inside-avoid bg-gradient-to-br ${msg.color} rounded-xl p-5 relative`}
              >
                {/* 图钉装饰 */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300 shadow-sm"></div>
                <p className="text-sm text-gray-700 leading-relaxed mt-2">{msg.text}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/50">
                  <span className="text-xs text-gray-500">{msg.author} · {msg.time}</span>
                  <button className="text-primary text-xs hover:underline">❤️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
