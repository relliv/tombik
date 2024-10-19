<template>
  <TooltipProvider>
    <!-- Timer Actions -->
    <div class="actions">
      <!-- Start / Pausee -->
      <div class="action">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button @click="onStartPauseClick">
              <!-- Pause -->
              <IconPlayerPauseFilled v-if="isTimerRunning" />

              <!-- Play -->
              <IconPlayerPlayFilled
                v-if="isTimerPaused || (!isTimerRunning && !isTimerPaused)"
              />
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>
              {{ isTimerRunning ? "Pause" : "Start" }}
            </p>
          </TooltipContent>
        </Tooltip>

        <!-- <span>
        {{ isTimerRunning ? "Pause" : "Start" }}
      </span> -->
      </div>

      <!-- Stop -->
      <div
        class="action"
        :class="{
          disabled: isFinished,
        }"
      >
        <Tooltip>
          <TooltipTrigger as-child>
            <Button @click="onTimerStopClick" :disabled="isFinished">
              <IconPlayerStopFilled />
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>Stop</p>
          </TooltipContent>
        </Tooltip>

        <!-- <span> Stop </span> -->
      </div>
    </div>
  </TooltipProvider>
</template>

<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  ref,
  defineExpose,
  defineComponent,
} from "vue";
import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerStopFilled,
} from "@tabler/icons-vue";

import { Button } from "/src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "/src/components/ui/tooltip";

const props = defineProps({
  isTimerRunning: Boolean,
  isTimerPaused: Boolean,
  isFinished: Boolean,
});

const emit = defineEmits(["onStartPauseClick", "onTimerStopClick"]);
const onStartPauseClick = () => emit("onStartPauseClick");
const onTimerStopClick = () => emit("onTimerStopClick");

const minutesRef = ref(),
  secondsRef = ref();

defineExpose({
  minutesRef,
  secondsRef,
});

defineComponent({
  // icons
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerStopFilled,

  // shadcn component
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
});
</script>

<style scoped>
@import "./actions.scss";
</style>