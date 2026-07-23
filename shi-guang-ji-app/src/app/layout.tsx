import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "拾光记 — 记录我们的每一段时光",
  description: "情侣线上互动平台，记录属于你们的甜蜜时光",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <div className="flex min-h-screen">
          {/* 左侧导航栏 */}
          <Sidebar />

          {/* 右侧内容区域 */}
          <div className="flex-1 ml-[260px]">
            <Header />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
