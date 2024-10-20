<template>
  <div class="calendar-heatmap">
    <div class="heatmap-grid">
      <!-- Empty Days -->
      <button
        v-for="empty in firstWeekOffset"
        :key="'empty-' + empty"
        class="day empty"
        :style="{
          height: (props.options.cellSize || 15) + 'px',
          width: (props.options.cellSize || 15) + 'px',
        }"
      ></button>

      <!-- Available Days -->
      <button
        v-for="(day, index) in heatmapData"
        :key="day.date"
        :class="getDayClass(day.value)"
        class="day"
        @click="onDayClick(day)"
        :style="getGridPosition(index)"
      ></button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { DateTime } from 'luxon';
import { ICalendarHeatmapOptions } from './calendar-heatmap';

const props = defineProps({
  options: {
    type: Object as () => ICalendarHeatmapOptions,
    default: () => ({
      type: 'yearly',
      startDate: DateTime.local(2023, 1, 1).toISODate(),
    }),
  },
});

interface Day {
  date: string;
  value: number;
}

// Calculate the number of empty cells before the first date
const calculateFirstWeekOffset = (startDate: DateTime) => {
  const weekday = startDate.weekday; // Luxon: 1 = Monday, 7 = Sunday
  
  return weekday === 7 ? 6 : weekday - 1; // Sunday (7) needs 6 empty cells, Monday (1) needs 0
};

// Generate heatmap data for the given date range
const generateHeatmapData = (startDate: DateTime, endDate: DateTime) => {
  const daysBetween = Math.floor(endDate.diff(startDate, 'days').days);
  const heatmap = [];
  let currentDate = startDate;

  for (let i = 0; i <= daysBetween; i++) {
    const day: Day = {
      date: currentDate.toISODate() || '',
      value: Math.floor(Math.random() * 5), // Random value for heatmap
    };
    heatmap.push(day);
    currentDate = currentDate.plus({ days: 1 });
  }

  return heatmap;
};

// Grid position calculation depending on format
const getGridPosition = (index: number) => {
  switch (props.options.type) {
    case 'weekly':
      return {
        gridRow: 1,
        gridColumn: index + 1,
        height: (props.options.cellSize || 15) + 'px',
        width: (props.options.cellSize || 15) + 'px'
      };
    case 'monthly':
      return {
        gridRow: ((index + firstWeekOffset.value) % 7) + 1,
        gridColumn: Math.floor((index + firstWeekOffset.value) / 7) + 1,
        height: (props.options.cellSize || 15) + 'px',
        width: (props.options.cellSize || 15) + 'px'
      };
    case 'yearly':
      return {
        gridRow: ((index + firstWeekOffset.value) % 7) + 1,
        gridColumn: Math.floor((index + firstWeekOffset.value) / 7) + 1,
        height: (props.options.cellSize || 15) + 'px',
        width: (props.options.cellSize || 15) + 'px'
      };
  }
};

const heatmapData = ref<Day[]>([]);
const firstWeekOffset = ref<number>(0);

const updateHeatmapData = () => {
  const { type, startDate } = props.options;
  let endDate: DateTime;

  switch (type) {
    case 'weekly':
      endDate = DateTime.fromISO(startDate).plus({ days: 6 }); // Weekly, only 7 days
      break;
    case 'monthly':
      endDate = DateTime.fromISO(startDate).endOf('month'); // Monthly, all days of the month
      break;
    case 'yearly':
      endDate = DateTime.fromISO(startDate).endOf('year'); // Yearly, full year
      break;
  }

  heatmapData.value = generateHeatmapData(DateTime.fromISO(startDate), endDate);
  firstWeekOffset.value = calculateFirstWeekOffset(DateTime.fromISO(startDate));
};

// Watch for prop changes and update heatmap accordingly
watch(() => props.options, updateHeatmapData, { immediate: true });

const onDayClick = (day: Day) => {
  console.log(`Clicked on ${day.date} with value ${day.value}`);
};

const getDayClass = (value: number) => {
  switch (value) {
    case 1:
      return 'bg-green-100';
    case 2:
      return 'bg-green-300';
    case 3:
      return 'bg-green-500';
    case 4:
      return 'bg-green-700';
    case 5:
      return 'bg-green-900';
    default:
      return 'bg-gray-200';
  }
};
</script>

<style scoped>
@import './calendar-heatmap.scss';
</style>
