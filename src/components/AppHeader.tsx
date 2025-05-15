"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { useLanguage } from '../lib/i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function AppHeader() {
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
          {isSignedIn && (
            <Link href="/history" className={`text-blue-600 hover:text-blue-800 ${pathname === "/history" ? "font-bold underline" : ""}`}>
              {t('history')}
            </Link>
          )}
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
