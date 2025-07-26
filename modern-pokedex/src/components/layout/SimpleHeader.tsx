import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSimpleTheme } from '../../contexts/SimpleThemeContext';
import { useSimpleLanguage } from '../../contexts/SimpleLanguageContext';

export const SimpleHeader: React.FC = () => {
  const { theme, toggleTheme } = useSimpleTheme();
  const { language, setLanguage, t } = useSimpleLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="apple-header">
        <div className="apple-header-container">
          <div className="apple-header-content">
            {/* Logo and Title */}
            <Link to="/" className="apple-logo-container">
              <div className="apple-logo">
                <div className="apple-logo-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="apple-logo-text">
                  <h1>Pokédex</h1>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="apple-nav-desktop">
              <div className="apple-nav-links">
                <Link
                  to="/"
                  className={`apple-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                  <span>Kanto</span>
                </Link>
                <Link
                  to="/about"
                  className={`apple-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                >
                  <span>Johto</span>
                </Link>
              </div>
            </nav>

            {/* Controls */}
            <div className="apple-header-controls">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
                className="apple-control-btn apple-lang-btn"
                title="Change Language"
              >
                <span className="apple-lang-flag">
                  {language === 'en' ? '🇹🇭' : '🇺🇸'}
                </span>
                <span className="apple-lang-text">
                  {language === 'en' ? 'TH' : 'EN'}
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="apple-control-btn apple-theme-btn"
                title="Toggle Theme"
              >
                <div className="apple-theme-icon">
                  {theme === 'light' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="5"/>
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                    </svg>
                  )}
                </div>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="apple-mobile-menu-btn"
                title="Menu"
              >
                <div className={`apple-hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`apple-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="apple-mobile-menu-content">
            <nav className="apple-mobile-nav">
              <Link
                to="/"
                className={`apple-mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Kanto</span>
              </Link>
              <Link
                to="/about"
                className={`apple-mobile-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Johto</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="apple-mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};