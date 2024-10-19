<template>
  <router-view />
</template>

<script setup lang="ts">
import "./styles/style.scss";
import { useTimerStore } from "/src/shared/stores/timer.store";

const timerStore = useTimerStore();

timerStore.setupTimer();
</script>
