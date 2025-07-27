// API configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Raw Pokemon data structure from MongoDB
export interface PokemonRawData {
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

export interface ApiResponse<T> {
    data?: T;
    error?: string;
}

class ApiService {
    private async fetchWithErrorHandling<T>(url: string): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${API_BASE_URL}${url}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return { data };
        } catch (error) {
            console.error('API Error:', error);
            return { 
                error: error instanceof Error ? error.message : 'Unknown error occurred' 
            };
        }
    }

    async getAllPokemon(): Promise<ApiResponse<PokemonRawData[]>> {
        return this.fetchWithErrorHandling<PokemonRawData[]>('/pokemon');
    }

    async getPokemonById(id: number): Promise<ApiResponse<PokemonRawData>> {
        return this.fetchWithErrorHandling<PokemonRawData>(`/pokemon/${id}`);
    }

    async getPokemonByName(name: string): Promise<ApiResponse<PokemonRawData>> {
        return this.fetchWithErrorHandling<PokemonRawData>(`/pokemon/name/${encodeURIComponent(name)}`);
    }

    async searchPokemon(params: {
        query?: string;
        type?: string;
        legendary?: boolean;
    }): Promise<ApiResponse<PokemonRawData[]>> {
        const searchParams = new URLSearchParams();
        
        if (params.query) searchParams.append('q', params.query);
        if (params.type) searchParams.append('type', params.type);
        if (params.legendary !== undefined) searchParams.append('legendary', params.legendary.toString());
        
        const queryString = searchParams.toString();
        const url = `/pokemon/search${queryString ? `?${queryString}` : ''}`;
        
        return this.fetchWithErrorHandling<PokemonRawData[]>(url);
    }

    async getAvailableTypes(): Promise<ApiResponse<string[]>> {
        return this.fetchWithErrorHandling<string[]>('/pokemon/types');
    }

    async getLegendaryPokemon(): Promise<ApiResponse<PokemonRawData[]>> {
        return this.fetchWithErrorHandling<PokemonRawData[]>('/pokemon/legendary');
    }

    async getStatsSummary(): Promise<ApiResponse<{
        totalPokemon: number;
        legendaryCount: number;
        typeDistribution: Record<string, number>;
    }>> {
        return this.fetchWithErrorHandling('/pokemon/stats');
    }
}

export const apiService = new ApiService();