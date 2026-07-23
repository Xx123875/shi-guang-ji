export default function HomePage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-primary-50 to-white rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            早上好，小美 <span className="inline-block animate-heartbeat">❤️</span>
          </h2>
          <p className="text-gray-500 mt-1">今天是你和小明在一起的第 365 天</p>
        </div>
        <div className="hidden md:flex gap-2">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-xl">💕</div>
          <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center text-sm">✨</div>
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-lg">🌸</div>
        </div>
      </div>

      {/* 快捷统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "在一起天数", value: "365", icon: "❤️", color: "text-primary" },
          { label: "照片数量", value: "128", icon: "📷", color: "text-primary" },
          { label: "日记篇数", value: "52", icon: "📖", color: "text-primary" },
          { label: "留言条数", value: "89", icon: "💬", color: "text-primary" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* 最近动态 */}
        <div className="md:col-span-3 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">最近动态</h3>
          <div className="space-y-4">
            {[
              { text: "小明上传了3张照片到「旅行日记」", time: "2小时前", icon: "📷" },
              { text: "你写了一篇日记", time: "昨天", icon: "✏️" },
              { text: "纪念日「恋爱1000天」还有15天", time: "2天前", icon: "💕" },
              { text: "小明发了一条留言", time: "3天前", icon: "💌" },
              { text: "你们在一起满300天了！", time: "1周前", icon: "🎉" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <span className="text-lg mt-0.5">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧栏 */}
        <div className="md:col-span-2 space-y-4">
          {/* 即将到来 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">即将到来</h3>
            <div className="space-y-3">
              {[
                { name: "恋爱纪念日", countdown: "15天" },
                { name: "小美生日", countdown: "32天" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">❤️</span>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-xs font-medium text-primary bg-white px-2 py-1 rounded-full">
                    {item.countdown}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 今日心情 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">今日心情</h3>
            <div className="flex justify-around">
              {["😊", "🥰", "💭", "😌", "😢"].map((emoji, i) => (
                <button
                  key={i}
                  className={`text-2xl p-2 rounded-lg transition-all hover:scale-110 ${
                    i === 1 ? "bg-primary-50 ring-2 ring-primary" : ""
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              {["开心", "感动", "想念", "平静", "难过"][1]}
            </p>
          </div>
        </div>
      </div>

      {/* 底部 */}
      <p className="text-center text-xs text-gray-400 pt-4">
        拾光记 — 记录我们的每一段时光
      </p>
    </div>
  );
}
