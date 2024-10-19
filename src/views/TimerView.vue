<template>
  <div class="flex flex-col w-full h-full">
    <ul>
      <li>isFinished:{{ timerStore.isFinished }}</li>
      <li>currentTime:{{ timerStore.currentTime }}</li>
      <li>progress:{{ timerStore.progress }}</li>
    </ul>

    <CircularTimer />
  </div>
</template>

<script setup lang="ts">
import CircularTimer from "../components/features/timer/CircularTimer.vue";
import { useTimerStore } from "/src/shared/stores/timer.store";

const timerStore = useTimerStore();
</script>