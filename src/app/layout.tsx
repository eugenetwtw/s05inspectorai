"use client";

import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import { LanguageProvider, useLanguage } from "../lib/i18n/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";


function AppHeader() {
  const { t } = useLanguage();
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold hover:text-blue-700 transition-colors">
            {t('appName')}
          </Link>
          <Link href="/demo" className={`text-blue-600 hover:text-blue-800 ${pathname === "/demo" ? "font-bold underline" : ""}`}>
            {t('demo')}
          </Link>
          <Link href="/history" className={`text-blue-600 hover:text-blue-800 ${pathname === "/history" ? "font-bold underline" : ""}`}>
            {t('history')}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                {t('login')}
              </button>
            </SignInButton>
          </SignedOut>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}

function AppFooter() {
  const { t } = useLanguage();
  return (
    <footer className="text-center py-6 text-gray-500 text-sm">
      {t('copyright')}
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="zh-TW">
        <body>
          <LanguageProvider>
            <AppHeader />
            <main>
              {children}
            </main>
            <AppFooter />
          </LanguageProvider>
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
