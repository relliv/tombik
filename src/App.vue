<template>
  <div class="w-full h-full">
    <FloatingContainer
      :initialPosition="{
        x: innerWidth - containerWidth - 10,
        y: innerHeight - containerHeight - 50,
      }"
      class="opacity-50 hover:opacity-100"
    >
      <div class="flex flex-col select-none min-w-[150px]">
        <button
          class="float-right mb-2 border rounded-full size-7 border-gray-50"
          @click="isDebuggerBubbleVisible = !isDebuggerBubbleVisible"
        >
          {{ isDebuggerBubbleVisible ? "-" : "+" }}
        </button>

        <ul
          class="pl-4 list-disc"
          :class="{
            hidden: !isDebuggerBubbleVisible,
          }"
        >
          <li>isFinished:{{ timerStore.isFinished }}</li>
          <li>currentTime:{{ timerStore.currentTime }}</li>
          <li>progress:{{ timerStore.progress.toFixed(1) }}</li>
        </ul>
      </div>
    </FloatingContainer>

    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import "./styles/style.scss";
import FloatingContainer from "/src/components/ui/floating-container/FloatingContainer.vue";

import { useTimerStore } from "/src/shared/stores/timer.store";

const timerStore = useTimerStore();

const { innerWidth, innerHeight } = window;
const isDebuggerBubbleVisible = ref(true);

timerStore.setupTimer();

const containerWidth = 200; // Tahmini genişlik (px cinsinden)
const containerHeight = 100; // Tahmini yükseklik (px cinsinden)
</script>
