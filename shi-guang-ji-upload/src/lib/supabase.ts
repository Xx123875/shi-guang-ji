import { createClient } from '@supabase/supabase-js';

// Supabase 凭据：优先使用环境变量，fallback 到硬编码值
// anon key 是公开的客户端密钥，安全地用于浏览器端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tpfprgplfhwbvbdqujvk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZnByZ3BsZmh3YnZiZHF1anZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2Nzk3NjUsImV4cCI6MjEwMDI1NTc2NX0.F2H5JGvXnz9WV7pglMZcJrVQOOYOedQRFuaUCyN7wNM';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
