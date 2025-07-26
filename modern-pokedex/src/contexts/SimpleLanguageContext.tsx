import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Simple translations
const translations = {
  en: {
    'app.title': 'Pokédex',
    'nav.pokedex': 'Pokédex',
    'nav.about': 'About',
    'search.placeholder': 'Search Pokémon',
    'filter.type': 'Filter by type',
    'results.found': 'Pokémon found',
    'results.none': 'No Pokémon found',
    'page.of': 'Page {current} of {total}',
    'button.clear': 'Clear All',
    'button.try_again': 'Try Again',
    'error.loading': 'Error loading Pokemon data',
    'stats.hp': 'HP',
    'stats.attack': 'ATK',
    'stats.defense': 'DEF',
    'badge.legendary': 'Legendary'
  },
  th: {
    'app.title': 'โปเกเด็กซ์',
    'nav.pokedex': 'โปเกเด็กซ์',
    'nav.about': 'เกี่ยวกับ',
    'search.placeholder': 'ค้นหาโปเกมอน',
    'filter.type': 'กรองตามประเภท',
    'results.found': 'โปเกมอนที่พบ',
    'results.none': 'ไม่พบโปเกมอน',
    'page.of': 'หน้า {current} จาก {total}',
    'button.clear': 'ล้างทั้งหมด',
    'button.try_again': 'ลองใหม่',
    'error.loading': 'เกิดข้อผิดพลาดในการโหลดข้อมูลโปเกมอน',
    'stats.hp': 'พลังชีวิต',
    'stats.attack': 'โจมตี',
    'stats.defense': 'ป้องกัน',
    'badge.legendary': 'ตำนาน'
  }
};

const SimpleLanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const SimpleLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || 'en';
  });

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations['en']];
    return translation || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <SimpleLanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </SimpleLanguageContext.Provider>
  );
};

export const useSimpleLanguage = () => {
  const context = useContext(SimpleLanguageContext);
  if (!context) {
    throw new Error('useSimpleLanguage must be used within a SimpleLanguageProvider');
  }
  return context;
};