<template>
  <div class="flex flex-row">
    <ul>
      <li>isFinished:{{ timerStore.isFinished }}</li>
      <li>currentTime:{{ timerStore.currentTime }}</li>
      <li>progress:{{ timerStore.progress }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useTimerStore } from "/src/shared/stores/timer.store";

const timerStore = useTimerStore();
</script>
