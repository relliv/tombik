<template>
  <header class="header">
    <!-- Greeting -->
    <div class="greeting">
      <div class="name">Hello, {{ name }}</div>

      <div class="message">Ready for today's challenges?</div>
    </div>

    <!-- Search -->
    <div class="search">
      <Input placeholder="Search..." />
    </div>
  </header>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input";
import localForage from "localforage";
import { onMounted, ref } from "vue";

const name = ref<string>("");

onMounted(async () => {
  name.value = (await localForage.getItem("username")) as string;
});
</script>

<style scoped>
@import "./header.scss";
</style>
