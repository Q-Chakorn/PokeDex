import { apiService, PokemonRawData } from './ApiService';

export interface Pokemon {
    id: number;
    dexNumber: string;
    name: string;
    types: PokemonType[];
    abilities: string[];
    hiddenAbility?: string;
    isLegendary: boolean;
    bio: string;
    stats: {
        hp: number;
        attack: number;
        defense: number;
        spAttack: number;
        spDefense: number;
        speed: number;
    };
}

export interface PokemonType {
    name: string;
    color: string;
}

// PokemonRawData is now imported from ApiService

export interface SearchFilters {
    query?: string;
    types?: PokemonType[];
    isLegendary?: boolean;
}

export interface PokemonServiceError {
    message: string;
    code: 'LOAD_ERROR' | 'NOT_FOUND' | 'INVALID_FILTER';
}

export class PokemonService {
    private pokemonData: Pokemon[] = [];
    private isLoaded = false;

    private getTypeColor(typeName: string): string {
        const typeColors: Record<string, string> = {
            'Normal': '#A8A878',
            'Fire': '#F08030',
            'Water': '#6890F0',
            'Electric': '#F8D030',
            'Grass': '#78C850',
            'Ice': '#98D8D8',
            'Fighting': '#C03028',
            'Poison': '#A040A0',
            'Ground': '#E0C068',
            'Flying': '#A890F0',
            'Psychic': '#F85888',
            'Bug': '#A8B820',
            'Rock': '#B8A038',
            'Ghost': '#705898',
            'Dragon': '#7038F8',
            'Dark': '#705848',
            'Steel': '#B8B8D0',
            'Fairy': '#EE99AC'
        };
        return typeColors[typeName] || '#68A090';
    }

    private transformRawData(raw: PokemonRawData): Pokemon {
        const types: PokemonType[] = [];
        
        if (raw.type_01?.trim()) {
            types.push({
                name: raw.type_01.trim(),
                color: this.getTypeColor(raw.type_01.trim())
            });
        }
        
        if (raw.type_02?.trim()) {
            types.push({
                name: raw.type_02.trim(),
                color: this.getTypeColor(raw.type_02.trim())
            });
        }

        const abilities = [raw.ability_01, raw.ability_02].filter(a => a?.trim());

        return {
            id: parseInt(raw.dex_number.replace('#', '').replace(/^0+/, '')) || 0,
            dexNumber: raw.dex_number,
            name: raw.name,
            types,
            abilities,
            hiddenAbility: raw.hidden_ability?.trim() || undefined,
            isLegendary: raw.is_legendary === 'True',
            bio: raw.bio,
            stats: {
                hp: parseInt(raw.hp) || 0,
                attack: parseInt(raw.attack) || 0,
                defense: parseInt(raw.defense) || 0,
                spAttack: parseInt(raw.sp_attack) || 0,
                spDefense: parseInt(raw.sp_defense) || 0,
                speed: parseInt(raw.speed) || 0
            }
        };
    }

    /**
     * Load and process Pokemon data from the API
     */
    async loadPokemon(): Promise<Pokemon[]> {
        try {
            if (this.isLoaded) {
                return this.pokemonData;
            }

            const response = await apiService.getAllPokemon();
            if (response.error || !response.data) {
                throw new Error(response.error || 'Failed to fetch Pokemon data');
            }

            // Transform raw data to application format
            this.pokemonData = response.data
                .map(raw => this.transformRawData(raw))
                .sort((a, b) => a.id - b.id);
            
            this.isLoaded = true;
            return this.pokemonData;
        } catch (error) {
            const serviceError: PokemonServiceError = {
                message: 'Failed to load Pokemon data from API',
                code: 'LOAD_ERROR'
            };
            throw serviceError;
        }
    }

    /**
     * Get all Pokemon data
     */
    async getAllPokemon(): Promise<Pokemon[]> {
        if (!this.isLoaded) {
            await this.loadPokemon();
        }
        return this.pokemonData;
    }

    /**
     * Get Pokemon by ID
     */
    async getPokemonById(id: number): Promise<Pokemon | null> {
        try {
            const response = await apiService.getPokemonById(id);
            if (response.error || !response.data) {
                return null;
            }
            return this.transformRawData(response.data);
        } catch (error) {
            console.error('Error fetching Pokemon by ID:', error);
            return null;
        }
    }

    /**
     * Get Pokemon by name (case-insensitive)
     */
    async getPokemonByName(name: string): Promise<Pokemon | null> {
        try {
            const response = await apiService.getPokemonByName(name);
            if (response.error || !response.data) {
                return null;
            }
            return this.transformRawData(response.data);
        } catch (error) {
            console.error('Error fetching Pokemon by name:', error);
            return null;
        }
    }

    /**
     * Search Pokemon with filters
     */
    async searchPokemon(filters: SearchFilters = {}): Promise<Pokemon[]> {
        try {
            const searchParams: any = {};
            
            if (filters.query) {
                searchParams.query = filters.query;
            }
            
            if (filters.types && filters.types.length > 0) {
                // For API, we'll use the first type for now
                searchParams.type = filters.types[0].name;
            }
            
            if (filters.isLegendary !== undefined) {
                searchParams.legendary = filters.isLegendary;
            }

            const response = await apiService.searchPokemon(searchParams);
            if (response.error || !response.data) {
                throw new Error(response.error || 'Failed to search Pokemon');
            }

            return response.data
                .map(raw => this.transformRawData(raw))
                .sort((a, b) => a.id - b.id);
        } catch (error) {
            console.error('Error searching Pokemon:', error);
            return [];
        }
    }

    /**
     * Get Pokemon by type
     */
    async getPokemonByType(type: PokemonType): Promise<Pokemon[]> {
        return this.searchPokemon({ types: [type] });
    }

    /**
     * Get legendary Pokemon
     */
    async getLegendaryPokemon(): Promise<Pokemon[]> {
        try {
            const response = await apiService.getLegendaryPokemon();
            if (response.error || !response.data) {
                throw new Error(response.error || 'Failed to fetch legendary Pokemon');
            }

            return response.data
                .map(raw => this.transformRawData(raw))
                .sort((a, b) => a.id - b.id);
        } catch (error) {
            console.error('Error fetching legendary Pokemon:', error);
            return [];
        }
    }

    /**
     * Get Pokemon count
     */
    async getPokemonCount(): Promise<number> {
        try {
            const response = await apiService.getStatsSummary();
            if (response.error || !response.data) {
                return 0;
            }
            return response.data.totalPokemon;
        } catch (error) {
            console.error('Error fetching Pokemon count:', error);
            return 0;
        }
    }

    /**
     * Get all unique types
     */
    async getAvailableTypes(): Promise<PokemonType[]> {
        try {
            const response = await apiService.getAvailableTypes();
            if (response.error || !response.data) {
                throw new Error(response.error || 'Failed to fetch available types');
            }

            return response.data
                .filter(typeName => typeName && typeName.trim())
                .map(typeName => ({
                    name: typeName,
                    color: this.getTypeColor(typeName)
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error('Error fetching available types:', error);
            return [];
        }
    }

    /**
     * Get Pokemon stats summary
     */
    async getStatsSummary(): Promise<{
        totalPokemon: number;
        legendaryCount: number;
        typeDistribution: Record<string, number>;
    }> {
        try {
            const response = await apiService.getStatsSummary();
            if (response.error || !response.data) {
                throw new Error(response.error || 'Failed to fetch stats summary');
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching stats summary:', error);
            return {
                totalPokemon: 0,
                legendaryCount: 0,
                typeDistribution: {}
            };
        }
    }

    /**
     * Reset service state (useful for testing)
     */
    reset(): void {
        this.pokemonData = [];
        this.isLoaded = false;
    }
}

// Export singleton instance
export const pokemonService = new PokemonService();