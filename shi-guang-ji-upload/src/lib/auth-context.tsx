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
  signUp: (email: string) => Promise<{ error: string | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>;
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

  const signUp = async (email: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: 'Supabase 未配置' };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    return { error: error?.message ?? null };
  };

  const verifyOtp = async (email: string, token: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: 'Supabase 未配置' };
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    return { error: error?.message ?? null };
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
        verifyOtp,
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
