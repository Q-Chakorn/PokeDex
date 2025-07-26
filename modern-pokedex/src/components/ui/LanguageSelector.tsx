import React from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from '../../types/app';
import { saveLanguage } from '../../utils/storage';

export const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (language: Language) => {
    i18n.changeLanguage(language);
    saveLanguage(language);
  };

  const currentLanguage = i18n.language as Language;

  return (
    <div className="relative inline-block">
      <select
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value as Language)}
        className="
          appearance-none bg-transparent border border-gray-300 dark:border-gray-600
          rounded-md px-3 py-2 pr-8 text-sm
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          hover:border-gray-400 dark:hover:border-gray-500
          transition-colors duration-200
        "
        aria-label={t('language.select')}
      >
        <option value="en">{t('language.english')}</option>
        <option value="th">{t('language.thai')}</option>
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};