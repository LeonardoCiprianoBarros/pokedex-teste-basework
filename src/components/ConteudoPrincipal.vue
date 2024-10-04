<template>
  <div>
    <!-- Barra de pesquisa no header -->
    <Header @search="filterPokemons" @filterByType="filterPokemonsByType" />

    <!-- Carregando Pokémon -->
    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p>Carregando Pokémon...</p>
    </div>

    <!-- Lista de Pokémon filtrada -->
    <div v-if="!loading && !selectedPokemon">
      <div v-if="filteredPokemons.length === 0" class="no-results">
        <p>Nenhum Pokémon encontrado.</p>
      </div>

      <div class="pokemon-list" v-else>
        <PokemonCard
          v-for="pokemon in paginatedPokemons"
          :key="pokemon.id"
          :name="pokemon.name"
          :number="pokemon.id"
          :image="pokemon.sprites.front_default"
          @click="selectPokemon(pokemon.id)" 
        />
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="loading || offset === 0">Anterior</button>
        <button @click="nextPage" :disabled="loading || offset + limit >= filteredPokemons.length">Próximo</button>
      </div>
    </div>

    <!-- Detalhes do Pokémon -->
    <div v-else>
      <Pokemon v-if="selectedPokemon" :pokemonId="selectedPokemon" @back="selectedPokemon = null" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetchPokemons, type PokemonDetails } from '../http/index';
import PokemonCard from '../components/CardPokemon.vue';
import Pokemon from '../components/Pokemon.vue';
import Header from '../components/Header.vue';

export default {
  components: {
    PokemonCard,
    Pokemon,
    Header,
  },
  setup() {
    const pokemons = ref<PokemonDetails[]>([]);
    const filteredPokemons = ref<PokemonDetails[]>([]);
    const selectedPokemon = ref<number | null>(null);
    const offset = ref(0);
    const limit = 20;
    const loading = ref(false);

    const loadPokemons = async () => {
      loading.value = true;
      try {
        const data = await fetchPokemons(1118, 0); 
        pokemons.value = data;
        filteredPokemons.value = data; 
      } catch (error) {
        console.error('Erro ao carregar Pokémon:', error);
      } finally {
        loading.value = false;
      }
    };

    const selectPokemon = (id: number) => {
      selectedPokemon.value = id;
    };

    // Função para filtrar Pokémons por nome ou número
    const filterPokemons = (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      filteredPokemons.value = pokemons.value.filter(pokemon =>
        pokemon.name.toLowerCase().includes(lowerCaseQuery) ||
        pokemon.id.toString().includes(lowerCaseQuery)
      );
      offset.value = 0; // Reiniciar a página ao filtrar
    };

    // Função para filtrar Pokémons por tipo
    const filterPokemonsByType = (selectedType: string) => {
      if (selectedType) {
        filteredPokemons.value = pokemons.value.filter(pokemon =>
          pokemon.types.some(type => type.type.name === selectedType)
        );
      } else {
        filteredPokemons.value = pokemons.value; // Se nenhum tipo estiver selecionado, mostra todos os Pokémons
      }
      offset.value = 0; // Reiniciar a página ao filtrar
    };

    const paginatedPokemons = computed(() => {
      return filteredPokemons.value.slice(offset.value, offset.value + limit);
    });

    const nextPage = () => {
      if (offset.value + limit < filteredPokemons.value.length) {
        offset.value += limit;
      }
    };

    const prevPage = () => {
      if (offset.value > 0) {
        offset.value -= limit;
      }
    };

    onMounted(() => {
      loadPokemons();
    });

    return {
      pokemons,
      filteredPokemons,
      selectedPokemon,
      selectPokemon,
      filterPokemons,
      filterPokemonsByType, //  nova função de filtragem por tipo
      paginatedPokemons,
      nextPage,
      prevPage,
      offset,
      limit,
      loading,
    };
  },
};
</script>

<style scoped>
.pokemon-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
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

.no-results {
  text-align: center;
  margin: 20px;
  font-size: 18px;
  color: #333;
}
</style>
