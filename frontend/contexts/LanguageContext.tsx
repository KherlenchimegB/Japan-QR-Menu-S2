'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageCode } from '@/types/product';
import '@/lib/i18n'; // Initialize i18n

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, options?: any) => string;
  languages: {
    code: LanguageCode;
    name: string;
    nativeName: string;
  }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const languages = [
  { code: 'mn' as LanguageCode, name: 'Mongolian', nativeName: 'Монгол' },
  { code: 'en' as LanguageCode, name: 'English', nativeName: 'English' },
  { code: 'zh' as LanguageCode, name: 'Chinese', nativeName: '中文' },
];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('mn');

  useEffect(() => {
    // Get saved language from localStorage or use browser language
    const savedLanguage = localStorage.getItem('monopharma-language') as LanguageCode;
    const browserLanguage = navigator.language.split('-')[0] as LanguageCode;
    
    let initialLanguage: LanguageCode = 'mn'; // default
    
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      initialLanguage = savedLanguage;
    } else if (languages.some(lang => lang.code === browserLanguage)) {
      initialLanguage = browserLanguage;
    }
    
    setLanguage(initialLanguage);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    if (languages.some(language => language.code === lang)) {
      setCurrentLanguage(lang);
      i18n.changeLanguage(lang);
      localStorage.setItem('monopharma-language', lang);
      
      // Update HTML lang attribute
      document.documentElement.lang = lang;
      
      // Update meta tags for SEO
      const metaLang = document.querySelector('meta[name="language"]');
      if (metaLang) {
        metaLang.setAttribute('content', lang);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'language';
        meta.content = lang;
        document.head.appendChild(meta);
      }
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    languages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Utility function to get localized text from multilingual objects
export function getLocalizedText(
  multilingualText: { mn: string; en: string; zh: string } | undefined,
  language: LanguageCode,
  fallback: string = ''
): string {
  if (!multilingualText) return fallback;
  return multilingualText[language] || multilingualText.mn || fallback;
}
