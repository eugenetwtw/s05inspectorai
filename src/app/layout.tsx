"use client";

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import { LanguageProvider } from "../lib/i18n/LanguageContext";
import { Suspense } from "react";
import AppHeader from "../components/AppHeader"; // Import the new AppHeader
import AppFooter from "../components/AppFooter"; // Import the new AppFooter

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="zh-TW">
        <body>
          <Suspense fallback={null}>
            <LanguageProvider>
              <AppHeader /> {/* Use the imported AppHeader */}
              <main>
                {children}
              </main>
              <AppFooter /> {/* Use the imported AppFooter */}
            </LanguageProvider>
          </Suspense>
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
