"use client";

import { useState } from "react";

const moods = [
  { emoji: "😊", label: "开心" },
  { emoji: "🥰", label: "感动" },
  { emoji: "💭", label: "想念" },
  { emoji: "😌", label: "平静" },
  { emoji: "😢", label: "难过" },
];

const diaryEntries = [
  { title: "我们的海边之旅", authors: "小美和小明", date: "2026.07.20", photos: 3 },
  { title: "普通的周末", authors: "小明", date: "2026.07.18", photos: 0 },
  { title: "小美的惊喜", authors: "小美", date: "2026.07.15", photos: 5 },
  { title: "一起做饭记", authors: "小明", date: "2026.07.10", photos: 2 },
  { title: "雨天的小确幸", authors: "小美", date: "2026.07.05", photos: 1 },
];

export default function DiaryPage() {
  const [selectedMood, setSelectedMood] = useState(1);
  const [selectedDiary, setSelectedDiary] = useState(0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 今日心情 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500 text-sm mb-3">今天是 2026年7月23日 · 星期四</p>
        <h3 className="font-semibold text-gray-800 mb-4">记录今日心情</h3>
        <div className="flex justify-around">
          {moods.map((mood, i) => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(i)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all hover:scale-105 ${
                selectedMood === i
                  ? "bg-primary-50 ring-2 ring-primary"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="text-xs text-gray-500">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 日记内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 左侧：日记列表 */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">共享日记</h3>
            <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
              写日记
            </button>
          </div>

          {diaryEntries.map((entry, i) => (
            <div
              key={i}
              onClick={() => setSelectedDiary(i)}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                selectedDiary === i
                  ? "border-primary bg-primary-50/30"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <h4 className="text-sm font-semibold text-gray-800">{entry.title}</h4>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-gray-400">{entry.authors}</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">{entry.date}</span>
                {entry.photos > 0 && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                    {entry.photos}张照片
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：日记详情 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">{diaryEntries[selectedDiary].title}</h2>
            <p className="text-sm text-gray-400 mb-6">
              {diaryEntries[selectedDiary].authors} · 写于 2026年7月20日
            </p>

            {/* 日记内容 */}
            <div className="bg-gray-50/50 rounded-xl p-5 space-y-4 border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                今天我们去了海边！阳光特别好，海浪拍打着沙滩，我们在那里散步了很久。
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                小明给我拍了很多照片，每一张都特别好看。我们还一起堆了一个沙堡，虽然不太好看但很有趣。
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                傍晚的时候，我们坐在海边看了日落，橘红色的天空真的好美。那一刻觉得，只要有你在身边，每天都是最好的日子。
              </p>
            </div>

            {/* 照片区域 */}
            {diaryEntries[selectedDiary].photos > 0 && (
              <div className="mt-5">
                <div className="flex gap-3">
                  {["from-sky-200 to-blue-300", "from-amber-200 to-orange-300", "from-pink-200 to-rose-300"].slice(
                    0,
                    diaryEntries[selectedDiary].photos
                  ).map((gradient, i) => (
                    <div
                      key={i}
                      className={`w-1/3 aspect-video rounded-lg bg-gradient-to-br ${gradient}`}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* 底部互动 */}
            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">
              <button className="text-primary text-sm hover:underline">💕 2人喜欢</button>
              <button className="text-gray-400 text-sm hover:text-gray-600">💬 评论</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
