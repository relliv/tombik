import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimerStore = defineStore("timer", () => {
  // State
  const progress = ref(0);
  const currentTime = ref(0);
  const minutes = ref("10");
  const seconds = ref("00");
  const isTimerRunning = ref(false);
  const isTimerPaused = ref(false);
  const isFinished = ref(false);
  const initialTime = ref(600);
  const increment = ref(0);

  let timer: any = null;

  // Actions
  const startTimer = () => {
    clearInterval(timer);

    if (currentTime.value === -1) {
      currentTime.value = initialTime.value;
    } else if (currentTime.value === 0) {
      minutes.value = "00";
      seconds.value = "00";
      return;
    }

    isTimerRunning.value = true;
    isTimerPaused.value = false;
    isFinished.value = false;

    const totalSeconds = currentTime.value;
    increment.value = 100 / totalSeconds;

    timer = setInterval(() => {
      currentTime.value--;

      handleTimerProgress();

      if (currentTime.value <= 0) {
        clearInterval(timer);
        isTimerRunning.value = false;
        isFinished.value = true;
      }
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timer);
    isTimerPaused.value = true;
    isTimerRunning.value = false;
  };

  const stopTimer = () => {
    clearInterval(timer);
    isTimerRunning.value = false;
    isTimerPaused.value = false;
    progress.value = 0;
    currentTime.value = -1;
    isFinished.value = true;
    formatTime(initialTime.value);
  };

  const handleStartPause = () => {
    if (isTimerRunning.value) {
      pauseTimer();
    } else if (isTimerPaused.value) {
      startTimer();
    } else {
      startTimer();
    }
  };

  // Helpers
  const handleTimerProgress = () => {
    progress.value = Math.min(
      (initialTime.value - currentTime.value) * increment.value,
      100
    );
    formatTime(currentTime.value);
  };

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) {
      minutes.value = "00";
      seconds.value = "00";
      isFinished.value = true;
    }

    const minutesPart = Math.floor(totalSeconds / 60);
    const secondsPart = totalSeconds % 60;

    minutes.value = String(minutesPart).padStart(2, "0");
    seconds.value = String(secondsPart).padStart(2, "0");
  };

  const setupTimer = () => {
    currentTime.value = initialTime.value;
  };

  return {
    // getter/setter
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

    // actions
    setupTimer,
    startTimer,
    pauseTimer,
    stopTimer,
    handleStartPause,
  };
});
