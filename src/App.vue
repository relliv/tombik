<template>
  <div class="w-full h-full">
    <FloatingContainer
      :initialPosition="{
        x: innerWidth - containerWidth - 10,
        y: innerHeight - containerHeight - 1 * 100,
      }"
      class="absolute z-50 opacity-50 hover:opacity-100"
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
          <li>increment:{{ timerStore.increment.toFixed(1) }}</li>
          <li>finishReason:{{ timerStore.finishReason }}</li>
        </ul>
      </div>
    </FloatingContainer>

    <router-view />

    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import FloatingContainer from "/src/components/ui/floating-container/FloatingContainer.vue";
import { useTimerStore } from "/src/shared/stores/timer.store";
import Toaster from "/src/components/ui/toast/Toaster.vue";
import { useToast } from "/src/components/ui/toast/use-toast";

import "./styles/style.scss";
import { IFinishReason } from "./shared/models/timer/timer";

const timerStore = useTimerStore();
const { toast } = useToast();

const { innerWidth, innerHeight } = window;
const isDebuggerBubbleVisible = ref(true);

timerStore.setupTimer();

const containerWidth = 200;
const containerHeight = 100;

watch(
  () => timerStore.finishReason,
  (newValue: IFinishReason) => {
    if (newValue === IFinishReason.FINISHED) {
      toast({
        title: "Sprint completed!",
        description: "Well done!",
      });
    }
  }
);
</script>
