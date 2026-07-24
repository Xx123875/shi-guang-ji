'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const { user, profile, partner } = useAuth();
  const [stats, setStats] = useState({ days: 0, photos: 0, diaries: 0, messages: 0 });
  const [upcomingAnniversaries, setUpcomingAnniversaries] = useState<{ id: string; title: string; date: string; daysLeft: number }[]>([]);
  const [recentDiaries, setRecentDiaries] = useState<{ id: string; title: string; created_at: string }[]>([]);
  const [mood, setMood] = useState<string | null>(null);

  // 获取统计数据
  useEffect(() => {
    if (!user || !supabase) return;

    // 计算在一起天数
    const days = profile?.relationship_start_date
      ? Math.ceil((Date.now() - new Date(profile.relationship_start_date).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // 获取照片数量
    supabase.from('photos').select('id', { count: 'exact', head: true }).eq('user_id', user.id).then(({ count }) => {
      setStats(prev => ({ ...prev, days, photos: count || 0 }));
    });

    // 获取日记数量
    supabase.from('diaries').select('id', { count: 'exact', head: true }).eq('user_id', user.id).then(({ count }) => {
      setStats(prev => ({ ...prev, diaries: count || 0 }));
    });

    // 获取消息数量
    supabase.from('messages').select('id', { count: 'exact', head: true }).or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).then(({ count }) => {
      setStats(prev => ({ ...prev, messages: count || 0 }));
    });

    // 获取即将到来的纪念日
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    supabase.from('anniversaries').select('id, title, date').eq('user_id', user.id).lte('date', thirtyDaysLater.toISOString().split('T')[0]).gte('date', now.toISOString().split('T')[0]).order('date', { ascending: true }).limit(5).then(({ data }) => {
      if (data) {
        setUpcomingAnniversaries(data.map(a => ({
          ...a,
          daysLeft: Math.ceil((new Date(a.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        })));
      }
    });

    // 获取最近日记
    supabase.from('diaries').select('id, title, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5).then(({ data }) => {
      if (data) setRecentDiaries(data);
    });

    // 获取今日心情
    supabase.from('mood_records').select('mood').eq('user_id', user.id).gte('created_at', now.toISOString().split('T')[0]).maybeSingle().then(({ data }) => {
      if (data) setMood(data.mood);
    });
  }, [user, profile?.relationship_start_date]);

  const handleMoodClick = async (moodValue: string) => {
    if (!user || !supabase) return;
    setMood(moodValue);

    await supabase.from('mood_records').upsert({
      user_id: user.id,
      mood: moodValue,
      created_at: new Date().toISOString().split('T')[0],
    }, { onConflict: 'user_id,DATE(created_at)' });
  };

  const moodOptions = [
    { emoji: '😊', label: '开心', value: 'happy' },
    { emoji: '🥰', label: '感动', value: 'touched' },
    { emoji: '💭', label: '想念', value: 'missing' },
    { emoji: '😌', label: '平静', value: 'calm' },
    { emoji: '😢', label: '难过', value: 'sad' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了';
    if (hour < 12) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-primary-50 to-white rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {getGreeting()}，{profile?.nickname || '你'} <span className="inline-block animate-heartbeat">❤️</span>
          </h2>
          {partner && profile?.relationship_start_date ? (
            <p className="text-gray-500 mt-1">
              你和{partner.nickname}在一起的第 <span className="font-bold text-primary">{stats.days}</span> 天
            </p>
          ) : partner ? (
            <p className="text-gray-500 mt-1">已与{partner.nickname}绑定</p>
          ) : (
            <p className="text-gray-500 mt-1">还没有绑定伴侣哦，去设置页面绑定吧</p>
          )}
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
          { label: '在一起天数', value: stats.days.toString(), icon: '❤️' },
          { label: '照片数量', value: stats.photos.toString(), icon: '📷' },
          { label: '日记篇数', value: stats.diaries.toString(), icon: '📖' },
          { label: '留言条数', value: stats.messages.toString(), icon: '💬' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
            <p className="text-2xl font-bold text-primary">{item.value}</p>
          </div>
        ))}
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* 最近动态 */}
        <div className="md:col-span-3 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">最近动态</h3>
          {recentDiaries.length > 0 ? (
            <div className="space-y-4">
              {recentDiaries.map((diary) => (
                <div key={diary.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <span className="text-lg mt-0.5">✏️</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">你写了一篇日记「{diary.title || '无标题'}」</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(diary.created_at).toLocaleDateString('zh-CN')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">还没有任何动态</p>
              <Link href="/home/diary" className="text-primary text-sm hover:underline mt-2 inline-block">
                写第一篇日记
              </Link>
            </div>
          )}
        </div>

        {/* 右侧栏 */}
        <div className="md:col-span-2 space-y-4">
          {/* 即将到来 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">即将到来</h3>
            {upcomingAnniversaries.length > 0 ? (
              <div className="space-y-3">
                {upcomingAnniversaries.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">❤️</span>
                      <span className="text-sm text-gray-700">{item.title}</span>
                    </div>
                    <span className="text-xs font-medium text-primary bg-white px-2 py-1 rounded-full">
                      {item.daysLeft === 0 ? '就是今天' : `${item.daysLeft}天后`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">暂无即将到来的纪念日</p>
            )}
          </div>

          {/* 今日心情 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">今日心情</h3>
            <div className="flex justify-around">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMoodClick(option.value)}
                  className={`text-2xl p-2 rounded-lg transition-all hover:scale-110 ${
                    mood === option.value ? 'bg-primary-50 ring-2 ring-primary' : ''
                  }`}
                >
                  {option.emoji}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              {mood ? moodOptions.find(m => m.value === mood)?.label : '记录今天的心情'}
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
