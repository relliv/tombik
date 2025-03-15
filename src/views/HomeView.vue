<template>
  <div class="flex flex-col items-start justify-start gap-5">
    <span>
      {{ startDate }}
    </span>

    <div class="flex flex-col gap-6 bg-zinc-900 px-8 pb-8 pt-6 rounded-2xl">
      <h1 class="text-2xl font-thin text-gray-300 select-none">
        Activity Calendar
      </h1>

      <NxCalendarHeatmap :options="options" :data="heatmapData">
        <template #footerContent>
          <a href="#"> Footer hint </a>
        </template>
      </NxCalendarHeatmap>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import localForage from "localforage";

import { useAppStore } from "@/shared/stores/app.store";

// calendar libs
import { NxCalendarHeatmap } from "@ngeenx/nx-vue-calendar-heatmap";
import {
  IHeatmapDay,
  HeatMapCalendarType,
  ICalendarHeatmapOptions,
  IHeatmapColor,
  HeatmapLevelsDirection,
} from "@ngeenx/nx-calendar-heatmap-utils";

// third party
import { DateTime } from "luxon";

const appStore = useAppStore();

const startDate = ref(DateTime.now().startOf("year"));

const heatmapData = ref<IHeatmapDay[]>([]);

const onDayClick = (day: IHeatmapDay) => {
  console.log(`Clicked on ${day.date} with value ${day.count}`);
};

const generateHeatmapData = (startDate: DateTime) => {
  let endDate: DateTime = startDate.endOf("year");

  const daysBetween = Math.floor(endDate.diff(startDate, "days").days);
  const heatmap = [];

  let currentDate = startDate;

  for (let i = 0; i <= daysBetween; i++) {
    const day: IHeatmapDay = {
      date: currentDate,
      count: Math.floor(Math.random() * 101),
    };

    heatmap.push(day);

    currentDate = currentDate.plus({ days: 1 });
  }

  return heatmap;
};

const options = ref<ICalendarHeatmapOptions>({
  type: HeatMapCalendarType.YEARLY,
  startDate: startDate.value,
  onClick: (day: IHeatmapDay) => onDayClick(day),
});

onMounted(async () => {
  setTimeout(() => {
    heatmapData.value = generateHeatmapData(startDate.value);
  }, 300);

  const username = (await localForage.getItem("username")) as string;

  appStore.setPageTitle(`Hello, ${username}.`);
});

watch(
  () => [options, startDate],
  () => {
    heatmapData.value = generateHeatmapData(startDate.value);

    options.value = {
      ...options.value,
    };
  }
);
</script>

<style lang="scss">
@import "@ngeenx/nx-calendar-heatmap-utils/styles.css";
@import "tippy.js/dist/tippy.css";

// @import "../../node_modules/@ngeenx/nx-calendar-heatmap-utils/styles.css";
</style>
