<template>
  <div class="flex flex-col items-start justify-start gap-5">
    <span>
      {{startDate}}
    </span>

    <CalendarHeatmap :options="{
      type: 'yearly',
      startDate: startDate,
      cellSize: cellSize,
      hideEmptyDays: false,
      onClick: onDayClick,
    }"/>

    <div class="flex flex-row">
      <CalendarHeatmap :options="{
        type: 'monthly',
        startDate: month,
        cellSize: cellSize,
        onClick: onDayClick
      }" v-for="month in months"/>
    </div>
    
    <CalendarHeatmap :options="{
      type: 'weekly',
      startDate: startDate,
      cellSize: cellSize,
      onClick: onDayClick
    }"/>
  </div>
</template>

<script setup lang="ts">
import { IHeatmapDay } from "@/components/features/calendar-heatmap/calendar-heatmap";
import CalendarHeatmap from "@/components/features/calendar-heatmap/CalendarHeatmap.vue";
import { DateTime } from "luxon";
import { ref } from "vue";

const startDate = ref("1998-01-01");
const cellSize = 15;

const heatmapColors = [
  { min: 0, max: 0, color: "#FFFFFF" },
]

const months = Array.from({ length: 12 }, (_, i) => {
  const firstDayOfMonth = DateTime.local().set({ month: i + 1, day: 1 });
  return firstDayOfMonth.toISODate();
});

const onDayClick = (day: IHeatmapDay) => {
  console.log(`Clicked on ${day.date} with value ${day.count}`);
}
</script>
