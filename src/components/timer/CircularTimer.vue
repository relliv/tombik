<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {
  progress,
  currentTime,
  minutes,
  seconds,
  isTimerRunning,
  isTimerPaused,
  isFinished,
  initialTime,
  increment,
  timer,
  stopTimer,
  handleStartPause,
} from "./../../shared/utils/timer/timer.util";
import TimerDisplay from "./display/TimerDisplay.vue";
import TimerActions from "./actions/TimerActions.vue";
import { ITimerInputEvent } from "../../shared/models/timer/timer";

const timerDisplayRef: any = ref(null);

// #region Timer Input Events

const onTimerInputBlur = (_event: ITimerInputEvent): void => {
  console.log("onTimerInputBlur");

  let value = (_event.event.target as HTMLElement).innerText;

  // ensure value is exactly two characters, pad with zeroes if needed
  if (_event.timePart === "minutes") {
    minutes.value = value.padStart(2, "0").substring(0, 2);
  } else if (_event.timePart === "seconds") {
    seconds.value = value.padStart(2, "0").substring(0, 2);
  }

  handleTimerLegendUpdate();
  handleTimerProgress();

  const totalSeconds = currentTime.value;
  increment.value = 100 / totalSeconds;

  progress.value = 0;
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
      minutes.value = value.padStart(2, "0").substring(0, 2);
    } else if (_event.timePart === "seconds") {
      seconds.value = value.padStart(2, "0").substring(0, 2);
    }

    (_event.event.target as HTMLElement).blur();

    handleStartPause();

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
      minutes.value = newValue;
    } else if (_event.timePart === "seconds") {
      seconds.value = newValue;
    }

    _event.event.preventDefault();
  }
};

// #endregion

// #region Actions

const onStartPauseClick = () => {
  handleStartPause();
};

const onTimerStopClick = () => {
  stopTimer();
};

// #endregion

// #region Global Events

const handleGlobalKeydownEventHandler = (event: KeyboardEvent) => {
  if (event.key == " " || event.code == "Space" || event.keyCode == 32) {
    handleStartPause();
  }
};

// #endregion

// #region Helpers

const handleTimerProgress = () => {
  progress.value = Math.min(
    (initialTime.value - currentTime.value) * increment.value,
    100
  );

  console.log("initialTime.value", initialTime.value);
  console.log("currentTime.value", currentTime.value);
  console.log("increment", increment);
  console.log("progress", progress.value);

  formatTime(currentTime.value);
};

const handleTimerLegendUpdate = () => {
  const newTime = parseTimeInput(`${minutes.value}:${seconds.value}`);

  console.log("handleTimerLegendUpdate", newTime);

  currentTime.value = newTime;
  initialTime.value = newTime;
};

const parseTimeInput = (timeString: string) => {
  const [minutes, seconds] = timeString.split(":").map(Number);

  return minutes * 60 + seconds;
};

const formatTime = (totalSeconds: number) => {
  if (totalSeconds <= 0) {
    minutes.value = "00";
    seconds.value = "00";

    isFinished.value = true;
  }

  const minutesPart = Math.floor(totalSeconds / 60),
    secondsPart = totalSeconds % 60;

  minutes.value = String(minutesPart).padStart(2, "0");
  seconds.value = String(secondsPart).padStart(2, "0");
};

// #endregion

onMounted(() => {
  currentTime.value = initialTime.value;

  document.addEventListener("keydown", handleGlobalKeydownEventHandler);
});

onUnmounted(() => {
  clearInterval(timer);

  document.removeEventListener("keydown", handleGlobalKeydownEventHandler);
});
</script>

<template>
  <div class="timer-container">
    <!-- Timer -->
    <div class="circular-timer-container">
      <ve-progress
        :progress="progress"
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
        :minutes="minutes"
        :seconds="seconds"
        :isTimerRunning="isTimerRunning"
        :isTimerPaused="isTimerPaused"
        ref="timerDisplayRef"
        @onTimerInputKeyDown="onTimerInputKeyDown($event)"
        @onTimerInputBlur="onTimerInputBlur($event)"
      />
    </div>

    <!-- Actions -->
    <TimerActions
      @onStartPauseClick="onStartPauseClick"
      @onTimerStopClick="onTimerStopClick"
    />
  </div>
</template>

<style scoped>
@import "./timer.scss";
</style>
