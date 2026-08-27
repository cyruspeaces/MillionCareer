import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

const notoSansSc = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "百万职场 · 接真实 AI 商单，赢创作与机会",
  description: "连接 AI 真实需求与超级创作者 —— 商单与活动平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSansSc.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
