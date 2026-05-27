import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Company OS — 一键创建AI公司",
  description: "按照世界500强公司标准，一键创建AI公司，立即启动业务开始变现。真实的公司运营模式，AI驱动的组织架构与管理流程。",
  keywords: ["AI Company", "AI公司", "人工智能", "一键创建", "AI员工", "自动化运营"],
  openGraph: {
    title: "AI Company OS — 一键创建AI公司",
    description: "一键创建AI公司，立即启动业务开始变现",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
