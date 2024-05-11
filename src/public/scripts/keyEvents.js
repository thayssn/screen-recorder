let keyTimer = null;
let canType = true;
const acceptedKeys = ["KeyR", "KeyT"];
const operationsMapper = {
  KeyR: toggleRecording,
  KeyT: toggleCamera,
};

window.addEventListener("keydown", async ({ code, repeat }) => {
  console.log(canType);
  if (!canType || !acceptedKeys.includes(code) || repeat) return;
  canType = false;
  clearTimeout(keyTimer);
  const operation = operationsMapper[code];

  await operation();
  keyTimer = setTimeout(() => {
    canType = true;
    clearTimeout(keyTimer);
  }, 500);
});
