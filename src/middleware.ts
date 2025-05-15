import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware } from "@clerk/nextjs/server";

// Export Clerk's middleware directly
export default clerkMiddleware();

// Create a separate middleware function for language detection
export const middleware = (req: NextRequest) => {
  // Check if the URL already has a language parameter
  const url = req.nextUrl.clone();
  const hasLangParam = url.searchParams.has('lang');
  
  // If the URL doesn't have a language parameter, add it based on the Accept-Language header
  if (!hasLangParam && !req.nextUrl.pathname.startsWith('/api')) {
    const acceptLanguage = req.headers.get('accept-language') || '';
    let detectedLang = 'zh-TW'; // Default language
    
    if (acceptLanguage.includes('en')) {
      detectedLang = 'en';
    } else if (acceptLanguage.includes('zh')) {
      if (acceptLanguage.includes('TW') || acceptLanguage.includes('HK')) {
        detectedLang = 'zh-TW';
      } else {
        detectedLang = 'zh-CN';
      }
    }
    
    // Add the detected language as a query parameter
    url.searchParams.set('lang', detectedLang);
    
    // Return the response with the modified URL
    return NextResponse.redirect(url);
  }
  
  // If the URL already has a language parameter or it's an API route, continue with normal flow
  return NextResponse.next();
};

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
