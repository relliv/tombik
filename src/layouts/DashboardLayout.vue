<template>
  <div class="flex flex-row w-full h-full">
    <Sidebar />

    <main class="w-full h-full">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "./components/sidebar/Sidebar.vue";
</script>