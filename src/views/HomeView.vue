<template>
  <h1>Home Page</h1>
</template>

<script setup lang="ts">
import { useTimerStore } from "/src/shared/stores/timer.store";

const timerStore = useTimerStore();
</script>
