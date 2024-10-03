<template>
    <div>
      <!-- Se nenhum Pokémon estiver selecionado, mostra a lista -->
      <div v-if="!selectedPokemon">
        <div class="pokemon-list">
          <PokemonCard
            v-for="pokemon in pokemons"
            :key="pokemon.id"
            :name="pokemon.name"
            :number="pokemon.id"
            :image="pokemon.sprites.front_default"
            @click="selectPokemon(pokemon.id)" 
          />
        </div>
        <!-- Controles de Paginação -->
        <div class="pagination">
          <button @click="prevPage" :disabled="loading || offset === 0">Anterior</button>
          <button @click="nextPage" :disabled="loading || offset + limit >= totalPokemons">Próximo</button>
        </div>
      </div>
  
      <!-- Se um Pokémon foi selecionado, chama o componente de detalhes -->
      <div v-else>
        <Pokemon :pokemonId="selectedPokemon" @back="selectedPokemon = null" />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, onMounted } from 'vue';
  import { fetchPokemons, type PokemonDetails } from '../http/index';
  import PokemonCard from '../components/CardPokemon.vue';
  import Pokemon from '../components/Pokemon.vue'; 
  
  export default {
    components: {
      PokemonCard,
      Pokemon, 
    },
    setup() {
      const pokemons = ref<PokemonDetails[]>([]);
      const selectedPokemon = ref<number | null>(null); // Pokémon selecionado
      const offset = ref(0);
      const limit = 16;
      const totalPokemons = ref(0);
      const loading = ref(false);
  
      const loadPokemons = async () => {
        loading.value = true;
        try {
          const data = await fetchPokemons(limit, offset.value);
          pokemons.value = data;
          totalPokemons.value = 1118; // Número total de Pokémons
        } catch (error) {
          console.error('Erro ao carregar Pokémon:', error);
        } finally {
          loading.value = false;
        }
      };
  
      const selectPokemon = (id: number) => {
        //console.log(`Pokémon selecionado: ${id}`); // Log para verificar o evento de clique
        selectedPokemon.value = id;
      };
  
      const nextPage = () => {
        if (offset.value + limit < totalPokemons.value) {
          offset.value += limit;
          loadPokemons();
        }
      };
  
      const prevPage = () => {
        if (offset.value > 0) {
          offset.value -= limit;
          loadPokemons();
        }
      };
  
      onMounted(() => {
        loadPokemons();
      });
  
      return {
        pokemons,
        selectedPokemon,
        selectPokemon,  
        nextPage,
        prevPage,
        offset,
        limit,
        totalPokemons,
        loading,
      };
    },
  };
  </script>
  
  <style scoped>
  .pokemon-list {
  display: flex;
  flex-wrap: wrap; 
  align-items: center;
  justify-content: center;
  gap: 20px; 
  padding: 0 10px; 
}

.pagination {
  display: flex;
  justify-content: center; /* Centraliza os botões de paginação */
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Responsividade */
@media (max-width: 1200px) {
  .pokemon-list {
    gap: 15px; 
  }
}

@media (max-width: 768px) {
  .pokemon-list {
    justify-content: space-between; 
  }
}

@media (max-width: 576px) {
  .pokemon-list {
    justify-content: center; 
    gap: 10px; 
  }
  
  button {
    padding: 8px 16px; 
    font-size: 14px; 
  }
}
</style>
