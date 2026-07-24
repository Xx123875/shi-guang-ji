'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const { user, profile, partner } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    if (!user || !partner || !supabase) return;

    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partner.id}),and(sender_id.eq.${partner.id},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  useEffect(() => {
    if (partner) {
      fetchMessages();
      // 每 10 秒轮询新消息
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [user, partner?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !partner || !supabase || !newMessage.trim()) return;

    setSending(true);
    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: partner.id,
      content: newMessage.trim(),
    });
    setNewMessage('');
    setSending(false);
    fetchMessages();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ' ' +
      date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  // 未绑定伴侣的提示
  if (!partner) {
    return (
      <div className="animate-fade-in-up">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-lg mx-auto">
          <div className="text-5xl mb-4">💌</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">还没有绑定伴侣</h3>
          <p className="text-sm text-gray-500 mb-6">
            绑定伴侣后，你们就可以在这里互相留言了
          </p>

          {profile?.invite_code && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-2">将你的邀请码发给另一半</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-lg font-mono font-bold text-blue-600">{profile.invite_code}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(profile.invite_code)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  复制
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            或在设置页面输入伴侣的邀请码
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* 聊天头部 */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 py-3 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-white text-sm font-bold">
          {partner.nickname ? partner.nickname.charAt(0) : '?'}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{partner.nickname || '伴侣'}</p>
          <p className="text-xs text-green-500">已绑定</p>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4" style={{ minHeight: 'calc(100vh - 280px)', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                      ? 'bg-primary-100 text-gray-800 rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-400' : 'text-gray-400'}`}>
                    {formatDate(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">开始你们的第一次对话吧</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSend} className="flex items-center gap-3 mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="说点什么..."
          className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </form>
    </div>
  );
}
