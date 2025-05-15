"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Language, translations, TranslationKeys } from './translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
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
    
    if (urlLang && ['zh-TW', 'zh-CN', 'en'].includes(urlLang)) {
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
    
    // Use window.history to update URL without navigation
    window.history.pushState({}, '', `${pathname}?${newParams.toString()}`);
  };

  // Translation function
  const t = (key: keyof TranslationKeys): string => {
    const translation = translations[language][key];
    
    // Replace dynamic values like {year}
    if (key === 'copyright') {
      return translation.replace('{year}', new Date().getFullYear().toString());
    }
    
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
