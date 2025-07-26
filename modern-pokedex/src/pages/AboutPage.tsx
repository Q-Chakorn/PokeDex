import React from 'react';
import { useSimpleLanguage } from '../contexts/SimpleLanguageContext';

const AboutPage: React.FC = () => {
  const { t } = useSimpleLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Apple-style subtle background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            {/* Apple-style badge */}
            <div className="inline-flex items-center px-6 py-2 rounded-full glass text-blue-600 dark:text-blue-400 text-sm font-medium mb-12 animate-fade-in-up">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
              Kanto Region Collection
            </div>

            {/* Apple-style heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-semibold tracking-tight text-gray-900 dark:text-white mb-8 animate-fade-in" style={{lineHeight: '1.05', letterSpacing: '-0.025em'}}>
              <span className="block animate-slide-in-left">Modern</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-slide-in-right">
                Pokédex
              </span>
            </h1>

            {/* Apple-style subtitle */}
            <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 font-normal leading-relaxed animate-fade-in-up" style={{animationDelay: '0.3s', lineHeight: '1.381', letterSpacing: '0.011em'}}>
              Discover, explore, and learn about your favorite Pokémon with our beautiful, modern interface designed for trainers.
            </p>
          </div>
        </div>
      </div>

      {/* Apple-style Features Section */}
      <div className="py-24 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 dark:text-white mb-6" style={{lineHeight: '1.05', letterSpacing: '-0.025em'}}>
              Everything you need to explore
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-normal" style={{lineHeight: '1.381', letterSpacing: '0.011em'}}>
              Powerful features designed to make your Pokémon discovery journey seamless and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group card p-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4" style={{letterSpacing: '-0.022em'}}>
                Smart Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg" style={{lineHeight: '1.381'}}>
                Find any Pokémon instantly with intelligent search and advanced filtering by type, stats, and more.
              </p>
            </div>

            <div className="group card p-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4" style={{letterSpacing: '-0.022em'}}>
                Detailed Stats
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg" style={{lineHeight: '1.381'}}>
                Comprehensive stats, abilities, and detailed information for every Pokémon in the Kanto region.
              </p>
            </div>

            <div className="group card p-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4" style={{letterSpacing: '-0.022em'}}>
                Modern Design
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg" style={{lineHeight: '1.381'}}>
                Beautiful, responsive interface that works perfectly across all devices with dark mode support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Kanto Region Collection
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explore the complete first generation of Pokémon
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">151</div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Total Pokémon</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Complete collection</div>
            </div>

            <div className="text-center bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">18</div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Different Types</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Unique abilities</div>
            </div>

            <div className="text-center bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">1st</div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Generation</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Classic era</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;