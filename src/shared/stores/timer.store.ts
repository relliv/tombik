import { defineStore } from "pinia";
import { ref } from "vue";
import { IFinishReason } from "../models/timer/timer";

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
  const finishReason = ref("");

  let timer: any = null;

  /**
   * @source https://freesound.org/people/EagleStealthTeam/sounds/209698/
   */
  const sound = new Audio(
    "/assets/media/sounds/timer/209698__eaglestealthteam__analog-timer.mp3"
  );

  const warningTime = 15;

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
    finishReason.value = "";

    if (currentTime.value === initialTime.value) {
      const totalSeconds = currentTime.value;
      increment.value = 100 / totalSeconds;
    }

    timer = setInterval(() => {
      currentTime.value--;

      handleTimerProgress();

      if (currentTime.value === warningTime) {
        sound.play();
      }

      if (currentTime.value <= 0) {
        clearInterval(timer);
        isTimerRunning.value = false;
        isFinished.value = true;
        sound.pause();
        sound.currentTime = 0;

        setTimeout(() => {
          finishReason.value = IFinishReason.FINISHED;
        }, 1000);
      }
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timer);
    isTimerPaused.value = true;
    isTimerRunning.value = false;
    sound.pause();
  };

  const stopTimer = () => {
    clearInterval(timer);
    isTimerRunning.value = false;
    isTimerPaused.value = false;
    progress.value = 0;
    currentTime.value = -1;
    isFinished.value = true;

    sound.pause();
    sound.currentTime = 0;

    formatTime(initialTime.value);
    finishReason.value = IFinishReason.STOPPED;
  };

  const handleStartPause = () => {
    if (isTimerRunning.value) {
      pauseTimer();
    } else if (isTimerPaused.value) {
      startTimer();

      if (currentTime.value <= warningTime) {
        sound.play();
      }
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
    finishReason,

    // actions
    setupTimer,
    startTimer,
    pauseTimer,
    stopTimer,
    handleStartPause,
  };
});
