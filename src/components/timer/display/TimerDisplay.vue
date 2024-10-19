<template>
  <!-- Editable Timer Container -->
  <div class="editable-timer-container">
    <!-- Timer Inputs -->
    <div class="editable-timer">
      <div
        ref="minutesRef"
        class="minutes"
        placeholder="00"
        :contenteditable="!isTimerRunning"
        @keydown="onTimerInputKeyDown($event, 'minutes')"
        @blur="onTimerInputBlur($event, 'minutes')"
      >
        {{ minutes }}
      </div>
      <span>:</span>
      <div
        ref="secondsRef"
        class="seconds"
        placeholder="00"
        :contenteditable="!isTimerRunning"
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

const minutesRef = ref(),
  secondsRef = ref();

const props = defineProps({
  minutes: String,
  seconds: String,
  isTimerRunning: Boolean,
  isTimerPaused: Boolean,
});

const emit = defineEmits(["onTimerInputKeyDown", "onTimerInputBlur"]);

const onTimerInputKeyDown = (
  event: KeyboardEvent | FocusEvent,
  timePart: "minutes" | "seconds"
) => emit("onTimerInputKeyDown", { event, timePart });

const onTimerInputBlur = (
  event: KeyboardEvent | FocusEvent,
  timePart: "minutes" | "seconds"
) => emit("onTimerInputBlur", { event, timePart });

defineExpose({
  minutesRef,
  secondsRef,
});
</script>

<style scoped>
@import "./display.scss";
</style>