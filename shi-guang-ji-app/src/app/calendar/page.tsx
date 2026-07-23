export default function CalendarPage() {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const today = 23;
  // 模拟7月的日期数据（上月29-30，本月1-31，下月1-5）
  const daysInMonth = 31;
  const startDay = 2; // 7月1日是周二（索引2）

  const markedDates: Record<number, { label: string; color: string }> = {
    14: { label: "表白日", color: "bg-primary" },
    20: { label: "海边之旅", color: "bg-gold" },
    25: { label: "小明生日", color: "bg-primary" },
    28: { label: "领证日", color: "bg-primary" },
  };

  const events = [
    { date: "7月14日", name: "表白日", emoji: "💕" },
    { date: "7月20日", name: "海边之旅", emoji: "📖" },
    { date: "7月25日", name: "小明生日", emoji: "🎂" },
    { date: "7月28日", name: "领证日", emoji: "💍" },
  ];

  // 构建日历格子
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null); // 上月空位
  for (let i = 1; i <= daysInMonth; i++) cells.push(i); // 本月
  while (cells.length % 7 !== 0) cells.push(null); // 补齐

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 月份导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800">2026年7月</h2>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">今天</button>
          <button className="px-3 py-1.5 text-sm rounded-lg bg-primary text-white hover:bg-primary-hover">添加事件</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 日历网格 */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-5">
          <div className="grid grid-cols-7 gap-1">
            {/* 星期头 */}
            {weekdays.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">
                {d}
              </div>
            ))}
            {/* 日期格子 */}
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={i} className="aspect-square" />;
              }
              const isToday = day === today;
              const marked = markedDates[day];
              return (
                <div
                  key={i}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors ${
                    isToday
                      ? "bg-primary text-white font-bold"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span className="text-sm">{day}</span>
                  {marked && !isToday && (
                    <span className={`w-1.5 h-1.5 rounded-full ${marked.color} mt-0.5`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧事件列表 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">本月事件</h3>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg">{event.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">{event.name}</p>
                  <p className="text-xs text-gray-400">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
