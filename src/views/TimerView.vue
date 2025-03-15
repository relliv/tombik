<template>
  <div class="flex flex-col w-full h-full">
    <CircularTimer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAppStore } from "@/shared/stores/app.store";
import CircularTimer from "@/components/features/timer/CircularTimer.vue";
import { useTimerStore } from "@/shared/stores/timer.store";

const timerStore = useTimerStore();
const appStore = useAppStore();

onMounted(async () => {
  appStore.setPageTitle("Timer", "Start your pomodoro session");
});
</script>
