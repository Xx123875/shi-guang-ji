'use client';

import RequireAuth from '@/components/RequireAuth';
import Layout from '@/components/Layout';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Layout>
        {children}
      </Layout>
    </RequireAuth>
  );
}
