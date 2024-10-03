<template>
  <div class="pokemon-card">
    <img :src="image" :alt="name" class="pokemon-image" />
    <h2 class="pokemon-name">{{ name }}</h2>
    <p class="pokemon-number">#{{ number }}</p>
  </div>
</template>

<script lang="ts">
export default {
  name: "PokemonCard",
  props: {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.pokemon-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  max-width: 220px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer; /* Adicionado para indicar que o card é clicável */
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.pokemon-image {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}

.pokemon-name {
  margin: 10px 0;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.pokemon-number {
  font-size: 14px;
  color: #777;
}
</style>
