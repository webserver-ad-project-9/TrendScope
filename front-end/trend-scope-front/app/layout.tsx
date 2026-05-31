import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrendScope",
  description: "AI 기반 뉴스 키워드 트렌드 분석 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
