import { Analytics } from "@vercel/analytics/next";
import { Noto_Sans_KR } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-korean",
});

export const metadata: Metadata = {
  title: "WhenWe — 모두의 시간을 한눈에 맞춰보세요",
  description:
    "여러 사람의 가능한 시간을 모아 가장 좋은 약속을 찾아주는 일정 조율 서비스 WhenWe.",
  generator: "v0.app",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f6f8fc",
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`bg-background ${notoSansKr.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
