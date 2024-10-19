<template>
  <div class="dashboard-layout">
    <Sidebar />

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "./components/sidebar/Sidebar.vue";
</script>

<style scoped>
@import "./dashboard-layout.scss";
</style>