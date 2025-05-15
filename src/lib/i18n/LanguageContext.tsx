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
    const urlLang = searchParams.get('lang') as Language | null;
    
    if (urlLang && ['zh-TW', 'zh-CN', 'en', 'de'].includes(urlLang)) { // Added 'de'
      setLanguageState(urlLang);
    } else {
      // Detect browser language
      const browserLang = navigator.language;
      
      if (browserLang.startsWith('zh')) {
        // Check if it's Traditional or Simplified Chinese
        if (browserLang.includes('TW') || browserLang.includes('HK')) {
          setLanguageState('zh-TW');
        } else {
          setLanguageState('zh-CN');
        }
      } else if (browserLang.startsWith('en')) {
        setLanguageState('en');
      } else if (browserLang.startsWith('de')) { // Added 'de'
        setLanguageState('de');
      }
      // Default is already set to 'zh-TW'
    }
  }, [searchParams]);

  // Function to change language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    
    // Update URL with language parameter
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('lang', lang);
    
    // Use router to navigate to the new URL
    router.push(`${pathname}?${newParams.toString()}`);
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
