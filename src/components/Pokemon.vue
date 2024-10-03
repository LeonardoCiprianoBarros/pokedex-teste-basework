<template>
    <div class="pokemon-details" v-if="pokemon">
      <button class="back-button" @click="$emit('back')">Voltar à Lista</button>
      
      <h1 class="pokemon-title">{{ pokemon.name }} (ID: {{ pokemon.id }})</h1>
      <img class="pokemon-image" :src="pokemon.sprites.front_default" alt="Imagem do Pokémon" />
    
      <h2>Estatísticas</h2>
      <ul class="stats-list">
        <li v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat-item">
          <strong>{{ stat.stat.name }}:</strong> {{ stat.base_stat }}
        </li>
      </ul>
    
      <h2>Tipos</h2>
      <ul class="types-list">
        <li
          v-for="type in pokemon.types"
          :key="type.type.name"
          class="type-item"
          :style="{ backgroundColor: typeColors[type.type.name] }"
        >
          {{ type.type.name }}
        </li>
      </ul>
    
      <h2>Cadeia de Evolução</h2>
      <div v-if="loadingEvolutionChain" class="loading-container">
        <div class="loader"></div>
        <p>Carregando cadeia de evolução...</p>
      </div>
      <ul class="evolution-chain" v-else>
        <li v-for="evolution in evolutionChain" :key="evolution.id" class="evolution-item">
          <img :src="evolution.sprites.front_default" alt="Imagem da Evolução" class="evolution-image" />
          {{ evolution.name }}
        </li>
      </ul>
    </div>
  
    <div class="loading-container" v-else>
      <div class="loader"></div>
      <p>Carregando informações do Pokémon...</p>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, onMounted } from 'vue';
  import { fetchPokemonDetails, fetchEvolutionChain } from '../http/index';
  import type { PokemonDetails, EvolutionChain } from '../http/index';
  
  export default {
    props: {
      pokemonId: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      const pokemon = ref<PokemonDetails | null>(null);
      const evolutionChain = ref<EvolutionChain[]>([]);
      const loadingEvolutionChain = ref<boolean>(false); 
  
      const typeColors: { [key: string]: string } = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#F0B0B0',
        unknown: '#68A090',
        shadow: '#8B5B29',
      };
  
      const loadPokemonDetails = async () => {
        if (props.pokemonId) {
          pokemon.value = await fetchPokemonDetails(props.pokemonId);
          loadEvolutionChain(); // Chama a função para carregar a cadeia de evolução após carregar o Pokémon
        }
      };
  
      const loadEvolutionChain = async () => {
        loadingEvolutionChain.value = true; // Define loading como verdadeiro antes de carregar a cadeia de evolução
        evolutionChain.value = await fetchEvolutionChain(props.pokemonId);
        loadingEvolutionChain.value = false; // Define loading como falso após carregar a cadeia de evolução
      };
  
      onMounted(() => {
        loadPokemonDetails();
      });
  
      return {
        pokemon,
        evolutionChain,
        loadingEvolutionChain, // Retornar o estado de loading para o template
        typeColors,
      };
    },
  };
  </script>
  
  <style scoped>
  .pokemon-details {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 2px solid #f2f2f2;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .back-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
    transition: background-color 0.3s;
  }
  
  .back-button:hover {
    background-color: #45a049;
  }
  
  .pokemon-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
  
  .pokemon-image {
    display: block;
    margin: 20px auto;
    max-width: 100%;
    border-radius: 8px;
  }
  
  .stats-list,
  .types-list,
  .evolution-chain {
    list-style: none;
    padding: 0;
  }
  
  .stat-item,
  .type-item,
  .evolution-item {
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  
  .evolution-image {
    max-width: 50px;
    border-radius: 5px;
    margin-right: 10px;
  }
  
  /* Loading Container */
  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
  }
  
  .loader {
    border: 6px solid #f3f3f3;
    border-radius: 50%;
    border-top: 6px solid #3498db;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .loading-container p {
    margin-top: 10px;
    font-size: 18px;
    color: #333;
    font-weight: 500;
  }
  </style>
  