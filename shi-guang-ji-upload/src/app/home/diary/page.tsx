'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface Diary {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  mood: string | null;
  is_shared: boolean;
  created_at: string;
}

const moodOptions = [
  { emoji: '😊', label: '开心', value: 'happy' },
  { emoji: '🥰', label: '感动', value: 'touched' },
  { emoji: '💭', label: '想念', value: 'missing' },
  { emoji: '😌', label: '平静', value: 'calm' },
  { emoji: '😢', label: '难过', value: 'sad' },
];

export default function DiaryPage() {
  const { user, partner } = useAuth();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [showWrite, setShowWrite] = useState(false);
  const [writeTitle, setWriteTitle] = useState('');
  const [writeContent, setWriteContent] = useState('');
  const [writeMood, setWriteMood] = useState<string>('');
  const [writeShared, setWriteShared] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchDiaries = async () => {
    if (!user || !supabase) return;
    const { data } = await supabase
      .from('diaries')
      .select('*')
      .or(`user_id.eq.${user.id}${partner ? `,and(is_shared.eq.true,user_id.eq.${partner.id})` : ''}`)
      .order('created_at', { ascending: false });

    if (data) setDiaries(data);
  };

  useEffect(() => {
    fetchDiaries();
  }, [user, partner?.id]);

  const handleWrite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supabase || !writeContent.trim()) return;

    setLoading(true);
    await supabase.from('diaries').insert({
      user_id: user.id,
      title: writeTitle.trim() || null,
      content: writeContent.trim(),
      mood: writeMood || null,
      is_shared: writeShared,
    });
    setLoading(false);
    setShowWrite(false);
    setWriteTitle('');
    setWriteContent('');
    setWriteMood('');
    setWriteShared(true);
    fetchDiaries();
  };

  const handleDelete = async (id: string) => {
    if (!user || !supabase) return;
    await supabase.from('diaries').delete().eq('id', id);
    setSelectedDiary(null);
    fetchDiaries();
  };

  const getMoodEmoji = (mood: string | null) => {
    return moodOptions.find(m => m.value === mood)?.emoji || '';
  };

  const isMyDiary = (diary: Diary) => diary.user_id === user?.id;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">情侣日记</h2>
        <button
          onClick={() => setShowWrite(!showWrite)}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          {showWrite ? '取消' : '写日记'}
        </button>
      </div>

      {/* 写日记表单 */}
      {showWrite && (
        <form onSubmit={handleWrite} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题（可选）</label>
            <input
              type="text"
              value={writeTitle}
              onChange={(e) => setWriteTitle(e.target.value)}
              placeholder="给日记取个标题"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容 <span className="text-red-400">*</span></label>
            <textarea
              value={writeContent}
              onChange={(e) => setWriteContent(e.target.value)}
              placeholder="今天发生了什么..."
              required
              rows={6}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">心情</label>
              <div className="flex gap-1">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setWriteMood(writeMood === option.value ? '' : option.value)}
                    className={`text-xl p-1.5 rounded-lg transition-all hover:scale-105 ${
                      writeMood === option.value ? 'bg-primary-50 ring-2 ring-primary' : ''
                    }`}
                  >
                    {option.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                id="shared"
                checked={writeShared}
                onChange={(e) => setWriteShared(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="shared" className="text-sm text-gray-600">分享给伴侣</label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !writeContent.trim()}
            className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '保存中...' : '保存日记'}
          </button>
        </form>
      )}

      {/* 日记内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 左侧：日记列表 */}
        <div className="lg:col-span-2 space-y-3">
          {diaries.map((diary) => (
            <div
              key={diary.id}
              onClick={() => setSelectedDiary(diary)}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                selectedDiary?.id === diary.id
                  ? 'border-primary bg-primary-50/30'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="text-sm font-semibold text-gray-800">
                {diary.title || '无标题'}
                {getMoodEmoji(diary.mood) && <span className="ml-2">{getMoodEmoji(diary.mood)}</span>}
              </h4>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-gray-400">
                  {isMyDiary(diary) ? '我' : partner?.nickname || '伴侣'} · {new Date(diary.created_at).toLocaleDateString('zh-CN')}
                </span>
                {!diary.is_shared && isMyDiary(diary) && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">私密</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：日记详情 */}
        <div className="lg:col-span-3">
          {selectedDiary ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedDiary.title || '无标题'}
                    {getMoodEmoji(selectedDiary.mood) && <span className="ml-2">{getMoodEmoji(selectedDiary.mood)}</span>}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {isMyDiary(selectedDiary) ? '我' : partner?.nickname || '伴侣'} · 写于 {new Date(selectedDiary.created_at).toLocaleDateString('zh-CN')}
                  </p>
                </div>
                {isMyDiary(selectedDiary) && (
                  <button
                    onClick={() => handleDelete(selectedDiary.id)}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    删除
                  </button>
                )}
              </div>
              <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedDiary.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="text-4xl mb-4">📖</div>
              <p className="text-gray-400 text-sm">选择一篇日记查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
