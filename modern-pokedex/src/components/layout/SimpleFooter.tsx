import React from 'react';
import { useSimpleTheme } from '../../contexts/SimpleThemeContext';

export const SimpleFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useSimpleTheme();

  return (
    <footer style={{
      background: theme === 'dark' ? 'rgba(29, 29, 31, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {/* Logo and Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 2px 8px rgba(0, 122, 255, 0.2)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme === 'dark' ? '#f5f5f7' : '#1d1d1f',
              letterSpacing: '-0.022em'
            }}>
              Pokédex
            </span>
          </div>

          {/* Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '14px',
                color: '#007aff',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = '#0056cc';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = '#007aff';
              }}
            >
              PokéAPI
            </a>
            <span style={{ color: '#86868b', fontSize: '14px' }}>•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '14px',
                color: '#007aff',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = '#0056cc';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = '#007aff';
              }}
            >
              GitHub
            </a>
            <span style={{ color: '#86868b', fontSize: '14px' }}>•</span>
            <span style={{
              fontSize: '14px',
              color: '#86868b',
              fontWeight: '500'
            }}>
              Kanto Region
            </span>
          </div>

          {/* Copyright and Info */}
          <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#86868b',
              margin: '0',
              fontWeight: '400'
            }}>
              © {currentYear} Pokédex • Built with React & TypeScript
            </p>
            <p style={{
              fontSize: '12px',
              color: '#86868b',
              margin: '0',
              opacity: '0.8'
            }}>
              Pokémon and Pokémon character names are trademarks of Nintendo
            </p>
          </div>

          {/* Tech Stack */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {['React', 'TypeScript', 'Vite', 'Tailwind CSS'].map((tech, index) => (
              <div
                key={tech}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {index > 0 && (
                  <span style={{ color: '#86868b', fontSize: '12px' }}>•</span>
                )}
                <span style={{
                  fontSize: '12px',
                  color: '#86868b',
                  fontWeight: '500',
                  padding: '2px 8px',
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                  borderRadius: '6px'
                }}>
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};