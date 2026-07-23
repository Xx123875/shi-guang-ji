export default function RecycleBinPage() {
  const photos = [
    { name: "海边合照_001.jpg", deletedAt: "2026.07.18", remaining: 23, urgent: false },
    { name: "聊天截图_02.png", deletedAt: "2026.07.15", remaining: 20, urgent: false },
    { name: "自拍.jpg", deletedAt: "2026.07.10", remaining: 15, urgent: false },
    { name: "旧照片.jpg", deletedAt: "2026.06.28", remaining: 3, urgent: true },
  ];

  const messages = [
    { name: "一条留言", author: "小明", deletedAt: "2026.07.12", remaining: 17, urgent: false },
    { name: "旧日记片段", author: "小美", deletedAt: "2026.07.01", remaining: 6, urgent: false },
  ];

  const getBadgeStyle = (remaining: number) => {
    if (remaining < 10) return "bg-red-100 text-red-600";
    if (remaining < 20) return "bg-yellow-50 text-yellow-700";
    return "bg-gray-100 text-gray-500";
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 警告提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
        <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-700">回收站中的内容将在 <strong>30天后</strong> 自动永久删除，本地和云端均不保留数据</p>
        <button className="ml-auto text-sm text-red-500 hover:text-red-600 font-medium whitespace-nowrap">
          清空回收站
        </button>
      </div>

      {/* 分类标签 */}
      <div className="flex gap-2">
        {["全部", "照片", "留言"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              i === 0 ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 照片列表 */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">照片</h3>
        <div className="space-y-3">
          {photos.map((photo) => (
            <div key={photo.name} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{photo.name}</p>
                <p className="text-xs text-gray-400 mt-1">删除于 {photo.deletedAt}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getBadgeStyle(photo.remaining)}`}>
                剩余{photo.remaining}天
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  恢复
                </button>
                <button className="px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                  永久删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 留言列表 */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">留言</h3>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.name} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl shrink-0">
                💬
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{msg.name}</p>
                <p className="text-xs text-gray-400 mt-1">by {msg.author} · 删除于 {msg.deletedAt}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getBadgeStyle(msg.remaining)}`}>
                剩余{msg.remaining}天
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  恢复
                </button>
                <button className="px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                  永久删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
