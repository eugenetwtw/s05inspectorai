"use client";

import { useLanguage } from '../lib/i18n/LanguageContext';

export default function AppFooter() {
  const { t } = useLanguage();
  return (
    <footer className="text-center py-6 text-gray-500 text-sm">
      {t('copyright')}
    </footer>
  );
}
