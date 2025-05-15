"use client";

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { Language } from '../lib/i18n/translations';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Language display names
  const languageNames: Record<Language, string> = {
    'zh-TW': '繁體中文',
    'zh-CN': '简体中文',
    'en': 'English',
    'de': 'Deutsch' // Added German
  };

  // Language flags/icons (using emoji for simplicity)
  const languageIcons: Record<Language, string> = {
    'zh-TW': '🇹🇼',
    'zh-CN': '🇨🇳',
    'en': '🇺🇸',
    'de': '🇩🇪' // Added German flag
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 px-3 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm font-medium">{languageNames[language]}</span>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-sm border border-gray-100 z-10 overflow-hidden">
          {Object.entries(languageNames).map(([langCode, name]) => (
            <button
              key={langCode}
              onClick={() => handleLanguageChange(langCode as Language)}
              className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                language === langCode ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span className="text-base mr-2">{languageIcons[langCode as Language]}</span>
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
