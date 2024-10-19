<template>
  <!-- Timer Actions -->
  <div class="actions">
    <!-- Start / Pausee -->
    <div class="action">
      <button @click="onStartPauseClick">
        <!-- Pause -->
        <IconPlayerPauseFilled v-if="isTimerRunning" />

        <!-- Play -->
        <IconPlayerPlayFilled
          v-if="isTimerPaused || (!isTimerRunning && !isTimerPaused)"
        />
      </button>

      <span>
        {{ isTimerRunning ? "Pause" : "Start" }}
      </span>
    </div>

    <!-- Stop -->
    <div
      class="action"
      :class="{
        disabled: isFinished,
      }"
    >
      <button @click="onTimerStopClick" :disabled="isFinished">
        <IconPlayerStopFilled />
      </button>

      <span> Stop </span>
    </div>
  </div>
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

const props = defineProps({
  isTimerRunning: Boolean,
  isTimerPaused: Boolean,
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
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerStopFilled,
});
</script>

<style scoped>
@import "./actions.scss";
</style>