import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware } from "@clerk/nextjs/server";

// 合併 Clerk 與 i18n middleware
export default async function middleware(request: NextRequest) {
  // 先執行 Clerk middleware
  const clerkResponse = await clerkMiddleware()(request, undefined);
  if (clerkResponse) {
    // Clerk middleware 可能會回傳 redirect/response
    return clerkResponse;
  }

  // i18n 語言偵測與 redirect（不處理 /api 路徑）
  const url = request.nextUrl.clone();
  const hasLangParam = url.searchParams.has('lang');
  if (!hasLangParam && !request.nextUrl.pathname.startsWith('/api')) {
    const acceptLanguage = request.headers.get('accept-language') || '';
    let detectedLang = 'zh-TW'; // 預設語言

    if (acceptLanguage.includes('en')) {
      detectedLang = 'en';
    } else if (acceptLanguage.includes('zh')) {
      if (acceptLanguage.includes('TW') || acceptLanguage.includes('HK')) {
        detectedLang = 'zh-TW';
      } else {
        detectedLang = 'zh-CN';
      }
    }

    url.searchParams.set('lang', detectedLang);
    return NextResponse.redirect(url);
  }

  // 沒有攔截則繼續
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
