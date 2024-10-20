<template>
  <div class="flex flex-col items-start justify-start gap-5">
    <span>
      {{startDate}}
    </span>

    <CalendarHeatmap :options="{
      type: 'yearly',
      startDate: startDate,
      cellSize: cellSize,
      onClick: onDayClick
    }"/>

    <CalendarHeatmap :options="{
      type: 'monthly',
      startDate: startDate,
      cellSize: cellSize,
      onClick: onDayClick
    }"/>
    
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
import { ref } from "vue";

const startDate = ref("2023-01-01");
const cellSize = 15;

const onDayClick = (day: IHeatmapDay) => {
  console.log(`Clicked on ${day.date} with value ${day.count}`);
}
</script>
