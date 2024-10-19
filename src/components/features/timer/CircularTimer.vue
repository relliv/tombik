<template>
  <div class="timer-container">
    <!-- Timer -->
    <div class="circular-timer-container">
      <ve-progress
        :progress="timerStore.progress"
        :angle="-90"
        color="#7012CE"
        empty-color="#1B143F"
        :size="300"
        :thickness="25"
        empty-thickness="25"
        empty-line-position="in"
        :hide-legend="true"
        legend-class="timer-legend-style"
        :noData="false"
        font-color="white"
      >
      </ve-progress>

      <TimerDisplay
        :minutes="timerStore.minutes"
        :seconds="timerStore.seconds"
        :isTimerRunning="timerStore.isTimerRunning"
        :isTimerPaused="timerStore.isTimerPaused"
        :isFinished="timerStore.isFinished"
        ref="timerDisplayRef"
        @onTimerInputKeyDown="onTimerInputKeyDown($event)"
        @onTimerInputBlur="onTimerInputBlur($event)"
      />
    </div>

    <!-- Actions -->
    <TimerActions
      :isTimerRunning="timerStore.isTimerRunning"
      :isTimerPaused="timerStore.isTimerPaused"
      :isFinished="timerStore.isFinished"
      @onStartPauseClick="onStartPauseClick"
      @onTimerStopClick="onTimerStopClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTimerStore } from "/src/shared/stores/timer.store";
import TimerDisplay from "./display/TimerDisplay.vue";
import TimerActions from "./actions/TimerActions.vue";
import { ITimerInputEvent } from "../../shared/models/timer/timer";

const timerDisplayRef: any = ref(null);
const timerStore = useTimerStore();

// #region Timer Input Events

const onTimerInputBlur = (_event: ITimerInputEvent): void => {
  console.log("onTimerInputBlur");

  let value = (_event.event.target as HTMLElement).innerText;

  // ensure value is exactly two characters, pad with zeroes if needed
  if (_event.timePart === "minutes") {
    timerStore.minutes = value.padStart(2, "0").substring(0, 2);
  } else if (_event.timePart === "seconds") {
    timerStore.seconds = value.padStart(2, "0").substring(0, 2);
  }

  handleTimerLegendUpdate();
  handleTimerProgress();

  const totalSeconds = timerStore.currentTime;
  timerStore.increment = 100 / totalSeconds;

  timerStore.progress = 0;
};

const onTimerInputKeyDown = (_event: ITimerInputEvent): void => {
  console.log("onTimerInputKeyDown");

  const value = (_event.event.target as HTMLElement).innerText;

  // handle tabbing behavior for contenteditable
  if (_event.event.key === "Tab") {
    _event.event.preventDefault();

    if (_event.timePart === "minutes") {
      timerDisplayRef.value?.secondsRef?.focus();
    } else if (_event.timePart === "seconds") {
      timerDisplayRef.value?.minutesRef?.focus();
    }
  }

  // handle enter key
  if (_event.event.key === "Enter") {
    _event.event.preventDefault();

    // ensure value is exactly two characters, pad with zeroes if needed
    if (_event.timePart === "minutes") {
      timerStore.minutes = value.padStart(2, "0").substring(0, 2);
    } else if (_event.timePart === "seconds") {
      timerStore.seconds = value.padStart(2, "0").substring(0, 2);
    }

    (_event.event.target as HTMLElement).blur();

    timerStore.handleStartPause();

    return;
  }

  // only allow digits and backspace
  if (!/\d/.test(_event.event.key) && _event.event.key !== "Backspace") {
    _event.event.preventDefault();

    return;
  }

  // left-shift the value and keep only two digits if already two characters
  if (value.length >= 2 && _event.event.key !== "Backspace") {
    const newValue = value.substring(1) + _event.event.key;

    if (_event.timePart === "minutes") {
      timerStore.minutes = newValue;
    } else if (_event.timePart === "seconds") {
      timerStore.seconds = newValue;
    }

    _event.event.preventDefault();
  }
};

// #endregion

// #region Actions

const onStartPauseClick = () => {
  timerStore.handleStartPause();
};

const onTimerStopClick = () => {
  timerStore.stopTimer();
};

// #endregion

// #region Global Events

const handleGlobalKeydownEventHandler = (event: KeyboardEvent) => {
  if (event.key == " " || event.code == "Space" || event.keyCode == 32) {
    timerStore.handleStartPause();
  }
};

// #endregion

// #region Helpers

const handleTimerProgress = () => {
  timerStore.progress = Math.min(
    (timerStore.initialTime - timerStore.currentTime) * timerStore.increment,
    100
  );

  console.log("initialTime.value", timerStore.initialTime);
  console.log("currentTime.value", timerStore.currentTime);
  console.log("increment", timerStore.increment);
  console.log("progress", timerStore.progress);

  formatTime(timerStore.currentTime);
};

const handleTimerLegendUpdate = () => {
  const newTime = parseTimeInput(`${timerStore.minutes}:${timerStore.seconds}`);

  console.log("handleTimerLegendUpdate", newTime);

  timerStore.currentTime = newTime;
  timerStore.initialTime = newTime;
};

const parseTimeInput = (timeString: string) => {
  const [minutes, seconds] = timeString.split(":").map(Number);

  return minutes * 60 + seconds;
};

const formatTime = (totalSeconds: number) => {
  if (totalSeconds <= 0) {
    timerStore.minutes = "00";
    timerStore.seconds = "00";

    timerStore.isFinished = true;
  }

  const minutesPart = Math.floor(totalSeconds / 60),
    secondsPart = totalSeconds % 60;

  timerStore.minutes = String(minutesPart).padStart(2, "0");
  timerStore.seconds = String(secondsPart).padStart(2, "0");
};

// #endregion

onMounted(() => {
  document.addEventListener("keydown", handleGlobalKeydownEventHandler);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleGlobalKeydownEventHandler);
});
</script>


<style scoped>
@import "./timer.scss";
</style>
