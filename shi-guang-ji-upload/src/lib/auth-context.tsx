'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  nickname: string | null;
  avatar_url: string | null;
  gender: 'male' | 'female' | 'other' | null;
  invite_code: string;
  invited_by: string | null;
  partner_id: string | null;
  birthday: string | null;
  relationship_start_date: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  partner: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  configured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [partner, setPartner] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const configured = !!supabase;

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
    return data as Profile;
  }, []);

  const fetchPartner = useCallback(async (partnerId: string) => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', partnerId)
      .single();

    if (error) {
      console.error('Failed to fetch partner:', error);
      return null;
    }
    return data as Profile;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;

    const p = await fetchProfile(user.id);
    setProfile(p);

    if (p?.partner_id) {
      const pt = await fetchPartner(p.partner_id);
      setPartner(pt);
    } else {
      setPartner(null);
    }
  }, [user, fetchProfile, fetchPartner]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;

    const getSession = async () => {
      const { data: { session: currentSession } } = await client.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    };

    getSession();

    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id).then((p) => {
        setProfile(p);
        if (p?.partner_id) {
          fetchPartner(p.partner_id).then(setPartner);
        } else {
          setPartner(null);
        }
        setLoading(false);
      });
    } else {
      setProfile(null);
      setPartner(null);
      setLoading(false);
    }
  }, [user, fetchProfile, fetchPartner]);

  // 生成邀请码
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // 翻译 Supabase 英文错误为中文
  const translateError = (msg: string | null): string => {
    if (!msg) return '未知错误';
    const map: Record<string, string> = {
      'Invalid login credentials': '邮箱或密码错误',
      'Invalid email': '邮箱格式不正确',
      'Password should be at least 6 characters': '密码至少需要 6 个字符',
      'User already registered': '该邮箱已注册，请直接登录',
      'Database error saving new user': '注册时创建资料失败，请稍后重试',
      'Email not confirmed': '请先确认邮箱后再登录',
      'Rate limit exceeded': '操作过于频繁，请稍后再试',
      'Network request failed': '网络连接失败，请检查网络后重试',
      'Invalid credentials': '邮箱或密码错误',
    };
    for (const [en, zh] of Object.entries(map)) {
      if (msg.includes(en)) return zh;
    }
    return msg;
  };

  // 邮箱+密码注册
  const signUp = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: '服务未配置，请联系管理员' };

    // 先尝试关闭邮箱确认的注册方式
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // 关闭邮箱确认，注册后直接可用
        emailRedirectTo: undefined,
        data: {
          email_confirm: true as unknown as string,
        },
      },
    });

    if (error) return { error: translateError(error.message) };

    // 注册成功后，确保 profile 存在（作为触发器的 fallback）
    if (data.user) {
      // 等待触发器执行
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        // 触发器失败，手动创建 profile
        const insertResult = await supabase.from('profiles').insert({
          id: data.user.id,
          email: email.trim(),
          invite_code: generateInviteCode(),
        });
        if (insertResult.error) {
          console.error('手动创建 profile 失败:', insertResult.error);
          // 即使 profile 创建失败也允许注册成功，登录后再重试
        }
      }

      // 如果用户没有被自动登录（因为邮箱确认），手动登录
      if (!data.session) {
        const loginResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginResult.error) {
          // 登录失败但有用户存在，提示用户手动登录
          return { error: null };
        }
      }
    }

    return { error: null };
  };

  // 邮箱+密码登录
  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: '服务未配置，请联系管理员' };
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 登录失败时，尝试检查是否已有 profile，没有则创建
      if (error.message?.includes('Invalid login credentials')) {
        return { error: '邮箱或密码错误' };
      }
      return { error: translateError(error.message) };
    }

    // 登录成功后，确保 profile 存在
    const session = await supabase.auth.getSession();
    if (session.data.session?.user) {
      const userId = session.data.session.user.id;
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (!existingProfile) {
        await supabase.from('profiles').insert({
          id: userId,
          email: email.trim(),
          invite_code: generateInviteCode(),
        });
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setPartner(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        partner,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        configured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
