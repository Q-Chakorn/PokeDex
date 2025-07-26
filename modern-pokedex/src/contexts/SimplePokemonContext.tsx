import React, { createContext, useContext, useState, useEffect } from 'react';
import { PokemonService, Pokemon, PokemonType } from '../services/PokemonService';

interface PokemonContextType {
  pokemon: Pokemon[];
  filteredPokemon: Pokemon[];
  availableTypes: PokemonType[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTypes: PokemonType[];
  currentPage: number;
  itemsPerPage: number;
  viewMode: 'grid' | 'list';
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedTypes: (types: PokemonType[]) => void;
  setCurrentPage: (page: number) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  clearFilters: () => void;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [availableTypes, setAvailableTypes] = useState<PokemonType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 20;

  // Load Pokemon data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const service = new PokemonService();
        const data = await service.loadPokemon();
        const types = await service.getAvailableTypes();
        
        setPokemon(data);
        setAvailableTypes(types);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Pokemon data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter Pokemon based on search and types
  const filteredPokemon = React.useMemo(() => {
    let filtered = [...pokemon];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.dexNumber.toLowerCase().includes(query) ||
        p.id.toString().includes(query)
      );
    }

    // Filter by types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(p =>
        selectedTypes.some(selectedType =>
          p.types.some(pokemonType => pokemonType.name === selectedType.name)
        )
      );
    }

    return filtered;
  }, [pokemon, searchQuery, selectedTypes]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTypes]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setCurrentPage(1);
  };

  const value: PokemonContextType = {
    pokemon,
    filteredPokemon,
    availableTypes,
    loading,
    error,
    searchQuery,
    selectedTypes,
    currentPage,
    itemsPerPage,
    viewMode,
    setSearchQuery,
    setSelectedTypes,
    setCurrentPage,
    setViewMode,
    clearFilters
  };

  return (
    <PokemonContext.Provider value={value}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
};