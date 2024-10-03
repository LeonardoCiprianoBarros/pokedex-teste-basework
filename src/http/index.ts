// Definir interfaces de tipagem para os Pokémons
export interface Pokemon {
    name: string;
    url: string;
  }
  
  export interface PokemonDetails {
    id: number;
    name: string;
    sprites: {
      front_default: string;
    };
    stats: Array<{
      base_stat: number;
      stat: {
        name: string;
      };
    }>;
    types: Array<{
      type: {
        name: string;
      };
    }>;
  }
  
  export interface EvolutionChain {
    id: number;
    name: string;
    sprites: {
      front_default: string;
    };
  }
  
  // Função para buscar a lista de Pokémons
  export const fetchPokemons = async (limit: number, offset: number): Promise<PokemonDetails[]> => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      const data = await response.json();
  
      // Mapeia os detalhes adicionais para cada Pokémon
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: Pokemon) => {
          const pokemonDetailsResponse = await fetch(pokemon.url);
          const pokemonDetails: PokemonDetails = await pokemonDetailsResponse.json();
  
          return {
            name: pokemonDetails.name,
            id: pokemonDetails.id,
            sprites: pokemonDetails.sprites,
            stats: pokemonDetails.stats, // Adiciona as estatísticas do Pokémon
            types: pokemonDetails.types, // Adiciona os tipos do Pokémon
          };
        })
      );
  
      return detailedPokemons;
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      throw error;
    }
  };
  
  // Função para buscar os detalhes completos de um Pokémon pelo ID
  export const fetchPokemonDetails = async (pokemonId: number): Promise<PokemonDetails> => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const pokemonDetails: PokemonDetails = await response.json();
  
      return {
        id: pokemonDetails.id,
        name: pokemonDetails.name,
        sprites: pokemonDetails.sprites,
        stats: pokemonDetails.stats, // Estatísticas do Pokémon
        types: pokemonDetails.types, // Tipos do Pokémon
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do Pokémon:', error);
      throw error;
    }
  };
  
  // Função para buscar a cadeia de evolução de um Pokémon pelo ID
  export const fetchEvolutionChain = async (pokemonId: number): Promise<EvolutionChain[]> => {
    try {
      // Busca os detalhes da espécie do Pokémon
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
      const speciesData = await speciesResponse.json();
  
      // Busca a cadeia de evolução a partir da URL fornecida na espécie
      const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionChainData = await evolutionChainResponse.json();
  
      // Função auxiliar para obter os Pokémons da cadeia de evolução
      const getEvolutionDetails = async (evolution: { species: { name: any; }; }) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolution.species.name}`);
        const data = await response.json();
        return {
          id: data.id,
          name: data.name,
          sprites: data.sprites,
        };
      };
  
      // Recorre a cadeia de evolução e coleta os Pokémons envolvidos
      const evolutions: EvolutionChain[] = [];
      let currentEvolution = evolutionChainData.chain;
  
      // Captura a cadeia de evolução iterativamente
      while (currentEvolution) {
        const evolutionDetails = await getEvolutionDetails(currentEvolution);
        evolutions.push(evolutionDetails);
        currentEvolution = currentEvolution.evolves_to[0];
      }
  
      return evolutions;
    } catch (error) {
      console.error('Erro ao buscar cadeia de evolução:', error);
      throw error;
    }
  };
  