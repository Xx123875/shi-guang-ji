'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface Anniversary {
  id: string;
  title: string;
  date: string;
  type: 'relationship' | 'birthday' | 'custom';
  is_recurring: boolean;
  created_at: string;
}

export default function AnniversariesPage() {
  const { user, profile } = useAuth();
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState<'relationship' | 'birthday' | 'custom'>('custom');
  const [loading, setLoading] = useState(false);

  const fetchAnniversaries = async () => {
    if (!user || !supabase) return;
    const { data } = await supabase
      .from('anniversaries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (data) setAnniversaries(data);
  };

  useEffect(() => {
    fetchAnniversaries();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supabase || !newTitle.trim() || !newDate) return;

    setLoading(true);
    await supabase.from('anniversaries').insert({
      user_id: user.id,
      title: newTitle.trim(),
      date: newDate,
      type: newType,
      is_recurring: true,
    });
    setLoading(false);
    setShowAdd(false);
    setNewTitle('');
    setNewDate('');
    fetchAnniversaries();
  };

  const handleDelete = async (id: string) => {
    if (!user || !supabase) return;
    await supabase.from('anniversaries').delete().eq('id', id);
    fetchAnniversaries();
  };

  const getDaysInfo = (date: string) => {
    const target = new Date(date);
    const now = new Date();
    const targetThisYear = new Date(now.getFullYear(), target.getMonth(), target.getDate());
    if (targetThisYear < now) targetThisYear.setFullYear(targetThisYear.getFullYear() + 1);

    const diff = Math.ceil((targetThisYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const passed = Math.ceil((now.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    return { daysLeft: diff, daysPassed: passed };
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'relationship': return '💕';
      case 'birthday': return '🎂';
      default: return '📅';
    }
  };

  // 计算在一起总天数
  const totalDays = profile?.relationship_start_date
    ? Math.ceil((Date.now() - new Date(profile.relationship_start_date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 主倒计时卡片 */}
      {totalDays > 0 && (
        <div className="bg-gradient-to-br from-primary-100 via-primary-50 to-white rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-4 left-8 text-2xl opacity-30">💕</div>
          <div className="absolute top-8 right-12 text-xl opacity-20">🌸</div>
          <div className="absolute bottom-4 left-16 text-lg opacity-25">✨</div>
          <div className="absolute bottom-8 right-8 text-2xl opacity-20">💗</div>
          <p className="text-gray-500 text-sm mb-2">我们在一起了</p>
          <h2 className="text-5xl font-bold text-primary mb-2">{totalDays}</h2>
          <p className="text-gray-600">在一起的第 <span className="font-bold text-primary">{totalDays}</span> 天</p>
          <div className="animate-heartbeat text-4xl mt-4">❤️</div>
        </div>
      )}

      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-lg">所有纪念日</h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          {showAdd ? '取消' : '+ 添加纪念日'}
        </button>
      </div>

      {/* 添加表单 */}
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="纪念日名称"
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as 'relationship' | 'birthday' | 'custom')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="custom">自定义</option>
                <option value="relationship">恋爱纪念</option>
                <option value="birthday">生日</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {loading ? '添加中...' : '确认添加'}
          </button>
        </form>
      )}

      {/* 纪念日网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {anniversaries.map((item) => {
          const { daysLeft } = getDaysInfo(item.date);
          return (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{getIcon(item.type)}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    daysLeft === 0
                      ? 'bg-red-50 text-red-500'
                      : daysLeft < 0
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-primary-50 text-primary'
                  }`}
                >
                  {daysLeft === 0 ? '就是今天！' : daysLeft < 0 ? `已过${Math.abs(daysLeft)}天` : `还有${daysLeft}天`}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  删除
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {anniversaries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">还没有纪念日，点击上方按钮添加</p>
        </div>
      )}
    </div>
  );
}
