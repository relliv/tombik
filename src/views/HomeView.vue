<template>
  <div class="flex flex-col items-start justify-start gap-5">
    <span>
      {{startDate}}
    </span>

    <CalendarHeatmap :options="{
      type: 'yearly',
      startDate: startDate,
      cellSize: cellSize
    }"/>

    <CalendarHeatmap :options="{
      type: 'monthly',
      startDate: startDate,
      cellSize: cellSize
    }"/>
    
    <CalendarHeatmap :options="{
      type: 'weekly',
      startDate: startDate,
      cellSize: cellSize
    }"/>
  </div>
</template>

<script setup lang="ts">
import CalendarHeatmap from "@/components/features/calendar-heatmap/CalendarHeatmap.vue";
import { ref } from "vue";

const startDate = ref("2022-01-01");
const cellSize = 15;
</script>
