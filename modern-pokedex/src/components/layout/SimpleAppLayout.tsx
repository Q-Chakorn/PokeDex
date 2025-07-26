import React from 'react';
import { SimpleHeader } from './SimpleHeader';
import { SimpleFooter } from './SimpleFooter';

interface SimpleAppLayoutProps {
  children: React.ReactNode;
}

export const SimpleAppLayout: React.FC<SimpleAppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-300">
      <SimpleHeader />
      
      <main className="flex-1">
        {children}
      </main>
      
      <SimpleFooter />
    </div>
  );
};