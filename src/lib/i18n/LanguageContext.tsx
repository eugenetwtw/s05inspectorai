"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Language, translations, TranslationKeys } from './translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys, replacements?: Record<string, string>) => string; // Updated type definition
};

const defaultLanguage: Language = 'zh-TW';

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  // Initialize language from URL or browser settings
  useEffect(() => {
    let determinedLang: Language | null = null;

    // 1. Try localStorage
    const storedLang = localStorage.getItem('appLanguage') as Language | null;
    if (storedLang && ['zh-TW', 'zh-CN', 'en', 'de'].includes(storedLang)) {
      determinedLang = storedLang;
    }

    // 2. Try URL parameter if localStorage not set or invalid
    if (!determinedLang) {
      const urlLang = searchParams.get('lang') as Language | null;
      if (urlLang && ['zh-TW', 'zh-CN', 'en', 'de'].includes(urlLang)) {
        determinedLang = urlLang;
      }
    }

    // 3. Try browser language if still not determined
    if (!determinedLang) {
      const browserLang = navigator.language;
      if (browserLang.startsWith('zh')) {
        determinedLang = (browserLang.includes('TW') || browserLang.includes('HK')) ? 'zh-TW' : 'zh-CN';
      } else if (browserLang.startsWith('en')) {
        determinedLang = 'en';
      } else if (browserLang.startsWith('de')) {
        determinedLang = 'de';
      }
    }

    // 4. Fallback to default language
    const finalLang = determinedLang || defaultLanguage;
    setLanguageState(finalLang);
    
    // Persist to localStorage if it came from URL or browser detection initially
    if (finalLang && finalLang !== storedLang) {
        localStorage.setItem('appLanguage', finalLang);
    }

    // Update URL if it doesn't match the determined language, or if lang param is missing
    const currentUrlLang = searchParams.get('lang');
    if (finalLang && currentUrlLang !== finalLang) {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('lang', finalLang);
        // Use replace to avoid adding to history if only updating lang param on load
        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }

  }, [searchParams, pathname, router]); // router and pathname added for replace

  // Function to change language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang); // Save to localStorage
    
    // Update URL with language parameter
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('lang', lang);
    
    // Use router to navigate to the new URL (push to reflect change immediately)
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Translation function
  const t = (key: keyof TranslationKeys, replacements?: Record<string, string>): string => {
    let translation = translations[language][key] || key.toString();
    
    // Replace dynamic values like {year} for copyright
    if (key === 'copyright') {
      translation = translation.replace('{year}', new Date().getFullYear().toString());
    }

    // Handle other replacements if provided
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
