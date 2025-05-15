import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import { LanguageProvider } from "../lib/i18n/LanguageContext";
import { headers } from "next/headers";

// Default metadata (will be overridden by client components using translations)
export const metadata: Metadata = {
  title: "工地安全與品質檢查 AI",
  description: "使用 AI 視覺模型分析工地照片，檢查安全衛生問題、施工瑕疵或錯誤",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the Accept-Language header to determine initial language for HTML lang attribute
  const headersList = headers();
  const acceptLanguage = headersList.get("accept-language") || "";
  
  // Determine initial language for HTML lang attribute
  let initialLang = "zh-TW"; // Default
  
  if (acceptLanguage.includes("en")) {
    initialLang = "en";
  } else if (acceptLanguage.includes("zh")) {
    if (acceptLanguage.includes("TW") || acceptLanguage.includes("HK")) {
      initialLang = "zh-TW";
    } else {
      initialLang = "zh-CN";
    }
  }

  return (
    <ClerkProvider>
      <html lang={initialLang}>
        <body>
          <LanguageProvider>
            {children}
          </LanguageProvider>
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
