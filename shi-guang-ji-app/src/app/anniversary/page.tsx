export default function AnniversaryPage() {
  const anniversaries = [
    { name: "表白日", date: "2025.03.14", days: 365, type: "past", icon: "💕" },
    { name: "恋爱1000天", date: "2027.12.08", days: 847, type: "upcoming", icon: "🎉" },
    { name: "小美生日", date: "1998.06.15", days: 328, type: "upcoming", icon: "🎂" },
    { name: "第一次旅行", date: "2025.10.01", days: 296, type: "past", icon: "✈️" },
    { name: "领证日", date: "2026.07.28", days: 5, type: "upcoming", icon: "💍" },
    { name: "小明生日", date: "1997.11.20", days: 214, type: "upcoming", icon: "🎁" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 主倒计时卡片 */}
      <div className="bg-gradient-to-br from-primary-100 via-primary-50 to-white rounded-2xl p-8 text-center relative overflow-hidden">
        {/* 装饰元素 */}
        <div className="absolute top-4 left-8 text-2xl opacity-30">💕</div>
        <div className="absolute top-8 right-12 text-xl opacity-20">🌸</div>
        <div className="absolute bottom-4 left-16 text-lg opacity-25">✨</div>
        <div className="absolute bottom-8 right-8 text-2xl opacity-20">💗</div>

        <p className="text-gray-500 text-sm mb-2">2025年3月14日 · 我们在一起了</p>
        <h2 className="text-5xl font-bold text-primary mb-2">365</h2>
        <p className="text-gray-600">在一起的第 <span className="font-bold text-primary">365</span> 天</p>
        <div className="animate-heartbeat text-4xl mt-4">❤️</div>
      </div>

      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-lg">所有纪念日</h3>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
          + 添加纪念日
        </button>
      </div>

      {/* 纪念日网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {anniversaries.map((item) => (
          <div
            key={item.name}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                <p className="text-xs text-gray-400">{item.date}</p>
              </div>
            </div>
            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                item.type === "upcoming"
                  ? "bg-primary-50 text-primary"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {item.type === "upcoming" ? `还有${item.days}天` : `已过${item.days}天`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
