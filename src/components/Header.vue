<template>
    <header class="header">
      <input
        type="text"
        v-model="searchQuery"
        @input="onSearch"
        placeholder="Buscar por nome ou número"
        class="search-bar"
      />
    </header>
  </template>
  
  <script lang="ts">
  export default {
    emits: ['search'],
    data() {
      return {
        searchQuery: '', // Armazena a consulta de pesquisa
      };
    },
    methods: {
      onSearch() {
        this.$emit('search', this.searchQuery); // Emite o valor de pesquisa
      },
    },
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .search-bar {
    padding: 10px;
    width: 300px;
    border: 2px solid #ccc;
    border-radius: 5px;
  }
  </style>
  