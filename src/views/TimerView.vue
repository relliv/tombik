<template>
  <div class="flex flex-col w-full h-full">
    <CircularTimer />
  </div>
</template>

<script setup lang="ts">
import CircularTimer from "../components/features/timer/CircularTimer.vue";
import { useTimerStore } from "@/shared/stores/timer.store";

const timerStore = useTimerStore();
</script>