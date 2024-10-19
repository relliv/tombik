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
        :contenteditable="!isTimerRunning && isFinished"
        @keydown="onTimerInputKeyDown($event, 'minutes')"
        @blur="onTimerInputBlur($event, 'minutes')"
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
        :contenteditable="!isTimerRunning && isFinished"
        @keydown="onTimerInputKeyDown($event, 'seconds')"
        @blur="onTimerInputBlur($event, 'seconds')"
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
import { ITimerInputEvent } from "../../../shared/models/timer/timer";

const minutesRef = ref(),
  secondsRef = ref();

const props = defineProps({
  minutes: String,
  seconds: String,
  isTimerRunning: Boolean,
  isTimerPaused: Boolean,
  isFinished: Boolean,
});

const emit = defineEmits(["onTimerInputKeyDown", "onTimerInputBlur"]);

const onTimerInputKeyDown = (
  event: KeyboardEvent | FocusEvent,
  timePart: "minutes" | "seconds"
) => emit("onTimerInputKeyDown", <ITimerInputEvent>{ event, timePart });

const onTimerInputBlur = (
  event: KeyboardEvent | FocusEvent,
  timePart: "minutes" | "seconds"
) => emit("onTimerInputBlur", <ITimerInputEvent>{ event, timePart });

defineExpose({
  minutesRef,
  secondsRef,
});
</script>

<style scoped>
@import "./display.scss";
</style>