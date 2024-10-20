<template>
  <!-- Editable Timer Container -->
  <div class="editable-timer-container">
    <!-- Timer Inputs -->
    <div class="editable-timer">
      <!-- Minutes -->
      <div
        ref="minutesRef"
        class="minutes"
        placeholder="00"
        :contenteditable="!isTimerRunning && !isTimerPaused"
        @keydown="onTimerInputKeyDown($event, TimePart.MINUTES)"
        @blur="onTimerInputBlur($event, TimePart.MINUTES)"
        @wheel="onScrollChange($event, TimePart.MINUTES)"
      >
        {{ minutes }}
      </div>

      <!-- Divider -->
      <span class="divider" :class="{ 'animate-pulse': isTimerRunning }">
        :
      </span>

      <!-- Seconds -->
      <div
        ref="secondsRef"
        class="seconds"
        placeholder="00"
        :contenteditable="!isTimerRunning && !isTimerPaused"
        @keydown="onTimerInputKeyDown($event, TimePart.SECONDS)"
        @blur="onTimerInputBlur($event, TimePart.SECONDS)"
        @wheel="onScrollChange($event, TimePart.SECONDS)"
      >
        {{ seconds }}
      </div>
    </div>

    <!-- Paused -->
    <span class="status">
      {{ isTimerPaused ? "Paused" : " " }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, defineExpose } from "vue";
import {
  ITimerInputEvent,
  ITimerInputChangeEvent,
} from "@/shared/models/timer/timer";
import { TimePart } from "../../../../shared/models/timer/timer";

const minutesRef = ref(),
  secondsRef = ref();

const props = defineProps({
  minutes: String,
  seconds: String,
  isTimerRunning: Boolean,
  isTimerPaused: Boolean,
  isFinished: Boolean,
});

const emit = defineEmits([
  "onTimerInputKeyDown",
  "onTimerInputBlur",
  "onScrollChange",
]);

const onTimerInputKeyDown = (
  event: KeyboardEvent | FocusEvent,
  timePart: TimePart
) => emit("onTimerInputKeyDown", <ITimerInputEvent>{ event, timePart });

const onTimerInputBlur = (
  event: KeyboardEvent | FocusEvent,
  timePart: TimePart
) => emit("onTimerInputBlur", <ITimerInputEvent>{ event, timePart });

const onScrollChange = (event: WheelEvent, timePart: "minutes" | "seconds") => {
  if (props.isTimerRunning || props.isTimerPaused) return;

  const delta = event.deltaY < 0 ? 1 : -1;

  if (timePart === TimePart.MINUTES) {
    let newMinutes = (parseInt(props.minutes || "0") || 0) + delta;

    if (newMinutes < 0) {
      newMinutes = 0;
    }

    emit("onScrollChange", <ITimerInputChangeEvent>{
      change: String(newMinutes).padStart(2, "0"),
      timePart: TimePart.MINUTES,
    });
  } else if (timePart === TimePart.SECONDS) {
    let newSeconds = (parseInt(props.seconds || "0") || 0) + delta;

    if (newSeconds < 0) {
      newSeconds = 59;
    } else if (newSeconds > 59) {
      newSeconds = 0;
    }

    emit("onScrollChange", <ITimerInputChangeEvent>{
      change: String(newSeconds).padStart(2, "0"),
      timePart: TimePart.SECONDS,
    });
  }
};

defineExpose({
  minutesRef,
  secondsRef,
});
</script>

<style scoped>
@import "./display.scss";
</style>