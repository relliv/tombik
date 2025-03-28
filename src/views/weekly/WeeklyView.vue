<template>
  <div class="weekly-calendar-view">
    <!-- Hero -->
    <div class="hero">
      <div class="week-number">
        <span class="label">Week</span>
        <span class="value">{{ currentWeek }}</span>
      </div>
    </div>

    <div class="years-tabs">
      <Tabs default-value="2025" class="w-full">
        <TabsList
          class="flex flex-row items-center justify-center w-full gap-4 py-4 bg-gray-700/20 rounded-full"
        >
          <TabsTrigger
            v-for="year in avilableYears"
            :value="year.toString()"
            class="px-4 py-3 rounded-full data-[state=active]:bg-tombik-primary-500/50 hover:bg-tombik-primary-500/20 hover:scale-110"
          >
            {{ year }}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          v-for="year in avilableYears"
          :value="year.toString()"
          class="mt-6"
        >
          Make changes to your account here. {{ year }}
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useAppStore } from "@/shared/stores/app.store";
import { DateTime } from "luxon";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const appStore = useAppStore();

const avilableYears = ref<number[]>([]);

// Calculate current week number using Luxon
const currentWeek = computed(() => {
  return DateTime.now().weekNumber;
});

const initMockData = () => {
  // TODO: fetch year folder names from the workspace root folder
  avilableYears.value = [2025, 2024, 2023, 2022, 2021].sort((a, b) => a - b);
};

onMounted(async () => {
  appStore.setPageTitle("Weekly", "Track your weekly to-do lists");

  initMockData();
});
</script>

<style scoped lang="scss">
.weekly-calendar-view {
  @apply flex flex-col w-full h-full gap-4;

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

  .years-tabs {
    @apply flex flex-row items-center justify-between w-full gap-2;
  }
}
</style>
