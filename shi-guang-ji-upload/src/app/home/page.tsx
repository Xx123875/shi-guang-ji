'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface Activity {
  id: string;
  type: 'diary' | 'photo' | 'message';
  title: string;
  created_at: string;
}

interface Anniversary {
  id: string;
  title: string;
  date: string;
  type: 'relationship' | 'birthday' | 'custom';
  is_recurring: boolean;
}

export default function HomePage() {
  const { user, profile, partner } = useAuth();
  const [stats, setStats] = useState({ days: 0, photos: 0, diaries: 0, messages: 0 });
  const [allAnniversaries, setAllAnniversaries] = useState<Anniversary[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mood, setMood] = useState<string | null>(null);

  // 获取北京时间当天零点的 ISO 字符串（用于心情记录的日期判断）
  const getBeijingToday = () => {
    const now = new Date();
    // 北京时间 = UTC + 8
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const beijingMs = utcMs + 8 * 3600000;
    const beijingDate = new Date(beijingMs);
    return `${beijingDate.getFullYear()}-${String(beijingDate.getMonth() + 1).padStart(2, '0')}-${String(beijingDate.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!user || !supabase) return;

    // 1. 获取纪念日，从最早日期计算在一起天数
    supabase.from('anniversaries').select('id, title, date, type, is_recurring').eq('user_id', user.id).order('date', { ascending: true }).then(({ data }) => {
      if (data && data.length > 0) {
        setAllAnniversaries(data);
        // 用最早的日期计算在一起天数
        const earliestDate = data.reduce((min, a) => a.date < min ? a.date : min, data[0].date);
        const days = Math.ceil((Date.now() - new Date(earliestDate + 'T00:00:00+08:00').getTime()) / (1000 * 60 * 60 * 24));
        setStats(prev => ({ ...prev, days: Math.max(0, days) }));
      }
    });

    // 2. 获取照片数量
    supabase.from('photos').select('id', { count: 'exact', head: true }).eq('user_id', user.id).then(({ count }) => {
      setStats(prev => ({ ...prev, photos: count || 0 }));
    });

    // 3. 获取日记数量
    supabase.from('diaries').select('id', { count: 'exact', head: true }).eq('user_id', user.id).then(({ count }) => {
      setStats(prev => ({ ...prev, diaries: count || 0 }));
    });

    // 4. 获取消息数量
    supabase.from('messages').select('id', { count: 'exact', head: true }).or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).then(({ count }) => {
      setStats(prev => ({ ...prev, messages: count || 0 }));
    });

    // 5. 获取所有活动（日记+照片+留言），合并后按时间排序
    Promise.all([
      supabase.from('diaries').select('id, title, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('photos').select('id, caption, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('messages').select('id, content, sender_id, created_at').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).order('created_at', { ascending: false }).limit(10),
    ]).then(([diaryRes, photoRes, msgRes]) => {
      const acts: Activity[] = [];
      diaryRes.data?.forEach(d => acts.push({ id: d.id, type: 'diary', title: d.title || '无标题', created_at: d.created_at }));
      photoRes.data?.forEach(p => acts.push({ id: p.id, type: 'photo', title: p.caption || '上传了一张照片', created_at: p.created_at }));
      msgRes.data?.forEach(m => acts.push({ id: m.id, type: 'message', title: m.content.length > 20 ? m.content.slice(0, 20) + '...' : m.content, created_at: m.created_at }));
      acts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setActivities(acts.slice(0, 10));
    });

    // 6. 获取今日心情（按北京时间日期判断）
    const beijingToday = getBeijingToday();
    supabase.from('mood_records').select('mood').eq('user_id', user.id).gte('created_at', beijingToday).maybeSingle().then(({ data }) => {
      if (data) setMood(data.mood);
    });
  }, [user]);

  const handleMoodClick = async (moodValue: string) => {
    if (!user || !supabase) return;
    setMood(moodValue);

    const beijingToday = getBeijingToday();
    await supabase.from('mood_records').upsert({
      user_id: user.id,
      mood: moodValue,
      created_at: beijingToday,
    }, { onConflict: 'user_id,DATE(created_at)' });
  };

  const moodOptions = [
    { emoji: '😊', label: '开心', value: 'happy' },
    { emoji: '🥰', label: '感动', value: 'touched' },
    { emoji: '💭', label: '想念', value: 'missing' },
    { emoji: '😌', label: '平静', value: 'calm' },
    { emoji: '😢', label: '难过', value: 'sad' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'diary': return '✏️';
      case 'photo': return '📷';
      case 'message': return '💬';
      default: return '📌';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'diary': return '写了一篇日记「';
      case 'photo': return '';
      case 'message': return '发了一条留言「';
      default: return '';
    }
  };

  const getGreeting = () => {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const beijingMs = utcMs + 8 * 3600000;
    const beijingHour = new Date(beijingMs).getHours();
    if (beijingHour < 6) return '夜深了';
    if (beijingHour < 12) return '早上好';
    if (beijingHour < 14) return '中午好';
    if (beijingHour < 18) return '下午好';
    return '晚上好';
  };

  // 纪念日信息计算
  const getAnniversaryInfo = (date: string, isRecurring: boolean) => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todayMs = new Date(todayStr + 'T00:00:00+08:00').getTime();

    if (isRecurring) {
      // 找下一个日期
      const orig = new Date(date + 'T00:00:00+08:00');
      const thisYear = new Date(now.getFullYear(), orig.getMonth(), orig.getDate());
      thisYear.setHours(0, 0, 0, 0);
      const nextYear = new Date(now.getFullYear() + 1, orig.getMonth(), orig.getDate());
      nextYear.setHours(0, 0, 0, 0);
      const target = thisYear >= now ? thisYear : nextYear;
      const daysLeft = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const passed = Math.ceil((now.getTime() - orig.getTime()) / (1000 * 60 * 60 * 24));
      return { daysLeft, daysPassed: Math.max(0, passed), isPast: false };
    } else {
      const targetMs = new Date(date + 'T00:00:00+08:00').getTime();
      const diff = Math.ceil((targetMs - now.getTime()) / (1000 * 60 * 60 * 24));
      return { daysLeft: diff, daysPassed: 0, isPast: diff < 0 };
    }
  };

  const getAnniversaryIcon = (type: string) => {
    switch (type) {
      case 'relationship': return '💕';
      case 'birthday': return '🎂';
      default: return '📅';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-primary-50 to-white rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {getGreeting()}，{profile?.nickname || '你'} <span className="inline-block animate-heartbeat">❤️</span>
          </h2>
          {stats.days > 0 ? (
            <p className="text-gray-500 mt-1">
              你们在一起的第 <span className="font-bold text-primary">{stats.days}</span> 天
            </p>
          ) : partner ? (
            <p className="text-gray-500 mt-1">已与{partner.nickname}绑定，添加纪念日开始记录</p>
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
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((act) => (
                <div key={`${act.type}-${act.id}`} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <span className="text-lg mt-0.5">{getActivityIcon(act.type)}</span>
                  <div className="flex-1">
                    {act.type === 'photo' ? (
                      <p className="text-sm text-gray-700">上传了一张照片</p>
                    ) : (
                      <p className="text-sm text-gray-700">
                        {getActivityLabel(act.type)}{act.title}」
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{new Date(act.created_at).toLocaleDateString('zh-CN')}</p>
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
          {/* 所有纪念日 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">纪念日</h3>
              <Link href="/home/anniversaries" className="text-xs text-primary hover:underline">管理</Link>
            </div>
            {allAnniversaries.length > 0 ? (
              <div className="space-y-3">
                {allAnniversaries.map((item) => {
                  const info = getAnniversaryInfo(item.date, item.is_recurring);
                  const icon = getAnniversaryIcon(item.type);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span>{icon}</span>
                        <span className="text-sm text-gray-700">{item.title}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        info.isPast
                          ? 'bg-gray-100 text-gray-500'
                          : info.daysLeft === 0
                          ? 'bg-red-50 text-red-500'
                          : 'bg-primary-50 text-primary'
                      }`}>
                        {info.isPast
                          ? `${Math.abs(info.daysLeft)}天前`
                          : info.daysLeft === 0
                          ? '就是今天'
                          : `${info.daysLeft}天后`
                        }
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">暂无纪念日</p>
                <Link href="/home/anniversaries" className="text-primary text-xs hover:underline mt-1 inline-block">
                  添加第一个纪念日
                </Link>
              </div>
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
