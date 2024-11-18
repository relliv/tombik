<template>
  <div class="dashboard-layout">
    <Sidebar />

    <main>
      <Header />

      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "./components/sidebar/Sidebar.vue";
import Header from "./components/header/Header.vue";
</script>

<style scoped>
@import "./dashboard-layout.scss";
</style>
