import pokemonDataset from '../assets/data/pokemon_kanto_dataset.json';

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

interface PokemonRawData {
    dex_number: string;
    name: string;
    type_01: string;
    type_02: string;
    ability_01: string;
    ability_02: string;
    hidden_ability: string;
    is_legendary: string;
    bio: string;
    hp: string;
    attack: string;
    defense: string;
    sp_attack: string;
    sp_defense: string;
    speed: string;
}

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
     * Load and process Pokemon data from the dataset
     */
    async loadPokemon(): Promise<Pokemon[]> {
        try {
            if (this.isLoaded) {
                return this.pokemonData;
            }

            // Transform raw data to application format
            this.pokemonData = (pokemonDataset as PokemonRawData[])
                .map(raw => this.transformRawData(raw))
                .sort((a, b) => a.id - b.id);
            
            this.isLoaded = true;
            return this.pokemonData;
        } catch (error) {
            const serviceError: PokemonServiceError = {
                message: 'Failed to load Pokemon data',
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
        if (!this.isLoaded) {
            await this.loadPokemonData();
        }

        const pokemon = this.pokemonData.find(p => p.id === id);
        return pokemon || null;
    }

    /**
     * Get Pokemon by name (case-insensitive)
     */
    async getPokemonByName(name: string): Promise<Pokemon | null> {
        if (!this.isLoaded) {
            await this.loadPokemonData();
        }

        const pokemon = this.pokemonData.find(
            p => p.name.toLowerCase() === name.toLowerCase()
        );
        return pokemon || null;
    }

    /**
     * Search Pokemon with filters
     */
    async searchPokemon(filters: SearchFilters = {}): Promise<Pokemon[]> {
        if (!this.isLoaded) {
            await this.loadPokemonData();
        }

        let filteredPokemon = [...this.pokemonData];

        // Filter by search query (name or dex number)
        if (filters.query) {
            const query = filters.query.toLowerCase().trim();
            filteredPokemon = filteredPokemon.filter(pokemon => {
                const nameMatch = pokemon.name.toLowerCase().includes(query);
                const dexMatch = pokemon.dexNumber.toLowerCase().includes(query);
                const idMatch = pokemon.id.toString().includes(query);
                return nameMatch || dexMatch || idMatch;
            });
        }

        // Filter by types
        if (filters.types && filters.types.length > 0) {
            filteredPokemon = filteredPokemon.filter(pokemon =>
                filters.types!.some(filterType =>
                    pokemon.types.some(pokemonType => pokemonType.name === filterType.name)
                )
            );
        }

        // Filter by legendary status
        if (filters.isLegendary !== undefined) {
            filteredPokemon = filteredPokemon.filter(
                pokemon => pokemon.isLegendary === filters.isLegendary
            );
        }

        return filteredPokemon;
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
        return this.searchPokemon({ isLegendary: true });
    }

    /**
     * Get Pokemon count
     */
    async getPokemonCount(): Promise<number> {
        if (!this.isLoaded) {
            await this.loadPokemonData();
        }
        return this.pokemonData.length;
    }

    /**
     * Get all unique types
     */
    async getAvailableTypes(): Promise<PokemonType[]> {
        if (!this.isLoaded) {
            await this.loadPokemon();
        }

        const typesMap = new Map<string, PokemonType>();
        this.pokemonData.forEach(pokemon => {
            pokemon.types.forEach(type => {
                if (!typesMap.has(type.name)) {
                    typesMap.set(type.name, type);
                }
            });
        });

        return Array.from(typesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * Get Pokemon stats summary
     */
    async getStatsSummary(): Promise<{
        totalPokemon: number;
        legendaryCount: number;
        typeDistribution: Record<string, number>;
    }> {
        if (!this.isLoaded) {
            await this.loadPokemon();
        }

        const totalPokemon = this.pokemonData.length;
        const legendaryCount = this.pokemonData.filter(p => p.isLegendary).length;

        const typeDistribution: Record<string, number> = {};
        this.pokemonData.forEach(pokemon => {
            pokemon.types.forEach(type => {
                typeDistribution[type.name] = (typeDistribution[type.name] || 0) + 1;
            });
        });

        return {
            totalPokemon,
            legendaryCount,
            typeDistribution
        };
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