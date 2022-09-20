const ONE_SECOND_IN_MS = 1000;

function formatTime(timeInSeconds) {
  const stringify = (str) => String(str).padStart(2, "0");
  const seconds = timeInSeconds % 60;
  const minutes = Math.floor(timeInSeconds / 60);
  return `${stringify(minutes)}:${stringify(seconds)}`;
}

function Timer() {
  const timerElement = document.querySelector("#timer");
  let timer;
  let timerCount = 0;

  function startTimer() {
    timer = setInterval(() => {
      timerCount += 1;
      timerElement.textContent = formatTime(timerCount);
    }, ONE_SECOND_IN_MS);
  }

  function resetTimer() {
    clearTimeout(timer);
    timerCount = 0;
    timer = null;
    timerElement.textContent = "00:00";
  }

  return {
    start: startTimer,
    reset: resetTimer,
  };
}

const timer = new Timer();

module.exports = timer;
