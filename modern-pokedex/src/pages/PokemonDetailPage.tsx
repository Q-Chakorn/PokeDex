import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePokemonDetail } from '../contexts';
import { useRouteSync } from '../hooks/useRouteSync';
import { PokemonService } from '../services/PokemonService';
import { PokemonDetail } from '../components/pokemon/PokemonDetail';
import type { Pokemon } from '../types/pokemon';

const PokemonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { navigateBack, navigateToPokemonList } = useRouteSync();

  useEffect(() => {
    const loadPokemonDetail = async () => {
      if (!id) {
        setError('Pokemon ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const pokemonService = new PokemonService();
        const pokemonData = await pokemonService.getPokemonById(parseInt(id, 10));
        
        if (!pokemonData) {
          setError('Pokemon not found');
        } else {
          setPokemon(pokemonData);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load Pokemon details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadPokemonDetail();
  }, [id]);

  const handleBack = () => {
    navigateBack();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PokemonDetail
        pokemon={pokemon}
        loading={loading}
        error={error}
        onBack={handleBack}
        showBackButton={true}
        className="py-6"
      />
    </div>
  );
};

export default PokemonDetailPage;