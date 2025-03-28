<template>
  <div class="weekly-calendar-view">
    <div class="hero">
      <div class="week-number">
        <span class="label">Week</span>
        <span class="value">{{ currentWeek }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useAppStore } from "@/shared/stores/app.store";
import { DateTime } from "luxon";

const appStore = useAppStore();

// Calculate current week number using Luxon
const currentWeek = computed(() => {
  return DateTime.now().weekNumber;
});

onMounted(async () => {
  appStore.setPageTitle("Weekly", "Track your weekly to-do lists");
});
</script>

<style scoped lang="scss">
.weekly-calendar-view {
  @apply flex flex-col w-full h-full;

  .hero {
    @apply flex flex-col items-center justify-between;

    .week-number {
      @apply flex flex-row items-center justify-between text-4xl;

      .label {
        @apply mr-2 font-medium text-tombik-primary-600;
      }

      .value {
        @apply text-8xl font-bold text-tombik-primary-500;
      }
    }
  }
}
</style>
