<template>
  <div>
    <FloatingContainer />

    <router-view />
  </div>
</template>

<script setup lang="ts">
import "./styles/style.scss";
import FloatingContainer from "/src/components/ui/floating-container/FloatingContainer.vue";

import { useTimerStore } from "/src/shared/stores/timer.store";

const timerStore = useTimerStore();

timerStore.setupTimer();
</script>
