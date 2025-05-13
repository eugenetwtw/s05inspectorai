import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "工地安全與品質檢查 AI",
  description: "使用 AI 視覺模型分析工地照片，檢查安全衛生問題、施工瑕疵或錯誤",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="zh-TW">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
