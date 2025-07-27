import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SimpleAppLayout } from '../components/layout/SimpleAppLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import SimplePokemonListPage from '../pages/SimplePokemonListPage';
import PokemonDetailPage from '../pages/PokemonDetailPage';

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <SimpleAppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/list" element={<SimplePokemonListPage />} />
          <Route path="/pokemon/:dexNumber" element={<PokemonDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </SimpleAppLayout>
    </Router>
  );
};