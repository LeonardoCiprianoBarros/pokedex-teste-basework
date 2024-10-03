<template>
  <div>
    <!-- Barra de pesquisa no header -->
    <Header @search="filterPokemons" />

    <!-- Lista de Pokémon filtrada -->
    <div v-if="!selectedPokemon">
      <div class="pokemon-list">
        <PokemonCard
          v-for="pokemon in filteredPokemons"
          :key="pokemon.id"
          :name="pokemon.name"
          :number="pokemon.id"
          :image="pokemon.sprites.front_default"
          @click="selectPokemon(pokemon.id)" 
        />
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="loading || offset === 0">Anterior</button>
        <button @click="nextPage" :disabled="loading || offset + limit >= totalPokemons">Próximo</button>
      </div>
    </div>

    <!-- Detalhes do Pokémon -->
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
    const totalPokemons = ref(0);
    const loading = ref(false);

    const loadPokemons = async () => {
      loading.value = true;
      try {
        const data = await fetchPokemons(limit, offset.value);
        pokemons.value = data;
        filteredPokemons.value = data; //  lista filtrada com todos os Pokémon
        totalPokemons.value = 1118; // Número total de Pokémon
      } catch (error) {
        console.error('Erro ao carregar Pokémon:', error);
      } finally {
        loading.value = false;
      }
    };

    const selectPokemon = (id: number) => {
      selectedPokemon.value = id;
    };

    const filterPokemons = (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      filteredPokemons.value = pokemons.value.filter(pokemon =>
        pokemon.name.toLowerCase().includes(lowerCaseQuery) ||
        pokemon.id.toString().includes(lowerCaseQuery)
      );
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
      filteredPokemons,
      selectedPokemon,
      selectPokemon,
      filterPokemons,  
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
</style>
