<template>
    <header class="header">
      <h1 class="title">POKEDEX - Teste Técnico</h1> 
      <input
        type="text"
        v-model="searchQuery"
        @input="onSearch"
        placeholder="Buscar por nome ou número"
        class="search-bar"
      />
      <select v-model="selectedType" @change="onTypeChange" class="type-select">
        <option value="">Todos os tipos</option>
        <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
      </select>
    </header>
  </template>
  
  <script lang="ts">
  export default {
    emits: ['search', 'filterByType'],
    data() {
      return {
        searchQuery: '', // Armazena a consulta de pesquisa
        selectedType: '', // Armazena o tipo de Pokémon selecionado
        types: [
          'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug',
          'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic',
          'ice', 'dragon', 'dark', 'fairy'
        ], // Lista de tipos de Pokémon
      };
    },
    methods: {
      onSearch() {
        this.$emit('search', this.searchQuery); // Emite o valor de pesquisa
      },
      onTypeChange() {
        this.$emit('filterByType', this.selectedType); // Emite o tipo selecionado
      },
    },
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    flex-direction: column; 
    align-items: center; 
    margin-bottom: 20px;
  }
  
  .title {
    font-size: 24px; 
    margin-bottom: 10px; 
    color: #333; 
  }
  
  .search-bar {
    padding: 10px;
    width: 300px;
    border: 2px solid #ccc;
    border-radius: 5px;
    margin-right: 10px; 
  }
  
  .type-select {
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 5px;
  }
  </style>
  