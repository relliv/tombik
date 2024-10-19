import { ref } from "vue";

const progress = ref(0),
  currentTime = ref(0),
  minutes = ref("10"),
  seconds = ref("00"),
  isTimerRunning = ref(false),
  isTimerPaused = ref(false),
  isFinished = ref(false);

let initialTime = ref(600),
  timer: any = null,
  increment = ref(0);

// #region Timer

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

export {
  // const variables
  progress,
  currentTime,
  minutes,
  seconds,
  isTimerRunning,
  isTimerPaused,
  isFinished,
  // let variables
  initialTime,
  increment,
  timer,
  // methods
  startTimer,
  pauseTimer,
  stopTimer,
  handleStartPause,
};
