<template>
  <div class="h-28 bg-tombik-primary-700"></div>
</template>

<script setup lang="ts">
import { useTimerStore } from "@/shared/stores/timer.store";

const timerStore = useTimerStore();
</script>
