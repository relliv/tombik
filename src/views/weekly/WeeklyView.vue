<template>
  <div class="weekly-calendar-view">
    <!-- Hero -->
    <div class="hero">
      <div class="week-number">
        <span class="label">Week</span>
        <span class="value">{{ currentWeek }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="years-tabs">
      <Tabs default-value="2025" class="w-full">
        <!-- Year Tabs -->
        <TabsList
          class="flex flex-row items-center justify-center w-full gap-4 py-2 bg-gray-700/20 rounded-full"
        >
          <TabsTrigger
            v-for="yearFolder in avilableYearFolders"
            :value="yearFolder.name"
            class="px-4 py-3 rounded-full data-[state=active]:bg-tombik-primary-500 data-[state=active]:dark:text-gray-800 hover:bg-tombik-primary-500/20 hover:scale-110 font-normal"
          >
            {{ yearFolder.name }}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          v-for="year in avilableYearFolders"
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
import WeeklyService from "@/shared/services/weekly.service.ts";
import { IBasicFolder } from "@/shared/models/file/folder.model.ts";

const appStore = useAppStore();

const avilableYearFolders = ref<IBasicFolder[]>([]);

// Calculate current week number using Luxon
const currentWeek = computed(() => {
  return DateTime.now().weekNumber;
});

const initMockData = () => {
  // TODO: fetch year folder names from the workspace root folder
  // avilableYearFolders.value = [2025, 2024, 2023, 2022, 2021].sort((a, b) => a - b);
};

const loadAvaiableYears = async () => {
  const years = await WeeklyService.loadWeeklyYearFolders();

  avilableYearFolders.value = years.sort((a, b) => a - b);
};

onMounted(async () => {
  appStore.setPageTitle("Weekly", "Track your weekly to-do lists");

  initMockData();
  loadAvaiableYears();
});
</script>

<style scoped lang="scss">
.weekly-calendar-view {
  @apply flex flex-col w-full h-full gap-4;

  .hero {
    @apply flex flex-col items-center justify-between my-5;

    .week-number {
      @apply flex flex-row items-center justify-between text-4xl;

      .label {
        @apply mr-2 font-medium text-tombik-primary-600;
      }

      .value {
        @apply text-8xl text-tombik-primary-500;
      }
    }
  }

  .years-tabs {
    @apply flex flex-row items-center justify-between w-full gap-2;
  }
}
</style>
