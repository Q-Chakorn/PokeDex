import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SimpleHeader } from '../components/layout/SimpleHeader';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import SimplePokemonListPage from '../pages/SimplePokemonListPage';

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <SimpleHeader />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/list" element={<SimplePokemonListPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};