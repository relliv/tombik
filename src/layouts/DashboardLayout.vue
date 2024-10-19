<template>
  <div class="flex flex-row">
    <Sidebar />

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "./components/sidebar/Sidebar.vue";
</script>