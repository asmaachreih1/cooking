"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  df: (obj: any, field: string) => any;
}

const translations = { en, ar };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (path: string) => {
    const keys = path.split('.');
    let result: any = translations[language];
    
    for (const key of keys) {
      if (result[key]) {
        result = result[key];
      } else {
        return path; // Fallback to key name if not found
      }
    }
    
    return result;
  };

  const isRTL = language === 'ar';
  
  const df = (obj: any, field: string) => {
    if (!obj) return '';
    
    if (language === 'ar') {
      const fieldAr = `${field}_ar`;
      const valAr = obj[fieldAr];
      
      // Check if Arabic value exists and is not empty (string or array)
      if (valAr !== undefined && valAr !== null) {
        if (typeof valAr === 'string' && valAr.trim() !== '') {
          return valAr;
        }
        if (Array.isArray(valAr) && valAr.length > 0) {
          // Additional check for array of empty strings
          const hasContent = valAr.some(item => typeof item === 'string' && item.trim() !== '');
          if (hasContent) return valAr;
        }
      }
    }
    
    // Fallback to English (primary field)
    return obj[field];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, df }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
