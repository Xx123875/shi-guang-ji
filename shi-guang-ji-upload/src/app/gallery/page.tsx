export default function GalleryPage() {
  const categories = ["全部", "旅行", "日常", "节日", "美食", "自拍"];
  const gradients = [
    "from-pink-200 to-rose-300",
    "from-blue-200 to-cyan-300",
    "from-amber-200 to-yellow-300",
    "from-green-200 to-emerald-300",
    "from-purple-200 to-violet-300",
    "from-rose-200 to-pink-300",
    "from-sky-200 to-blue-300",
    "from-orange-200 to-amber-300",
    "from-teal-200 to-cyan-300",
    "from-fuchsia-200 to-pink-300",
    "from-lime-200 to-green-300",
    "from-indigo-200 to-blue-300",
  ];

  const albums = [
    { name: "旅行日记", count: 24, gradient: "from-blue-200 to-cyan-300" },
    { name: "日常甜 moments", count: 56, gradient: "from-pink-200 to-rose-300" },
    { name: "节日纪念", count: 18, gradient: "from-amber-200 to-yellow-300" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">情侣图库</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索照片..."
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
            上传照片
          </button>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              i === 0
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 照片网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gradients.map((gradient, i) => (
          <div
            key={i}
            className={`aspect-square rounded-xl bg-gradient-to-br ${gradient} relative group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow`}
          >
            {/* 爱心图标 */}
            <button className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
            {/* 阅后即焚标记 */}
            {i === 2 && (
              <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                🔥 阅后即焚
              </span>
            )}
            {/* 底部信息 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2">
              <p className="text-white text-xs">照片 {i + 1}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 相册区域 */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4">我们的相册</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 创建新相册 */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary-50/50 transition-colors min-h-[120px]">
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm text-gray-400">创建新相册</span>
          </div>
          {/* 已有相册 */}
          {albums.map((album) => (
            <div
              key={album.name}
              className={`rounded-xl bg-gradient-to-br ${album.gradient} p-5 cursor-pointer hover:shadow-md transition-shadow min-h-[120px] flex flex-col justify-end`}
            >
              <h4 className="font-semibold text-gray-800">{album.name}</h4>
              <p className="text-sm text-gray-600">{album.count}张照片</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
