let keysPressed = new Set([]);
let keyTimer = null;

window.addEventListener("keydown", ({ code }) => {
  if (keysPressed.has(code)) return;
  clearTimeout(keyTimer);
  keysPressed.add(code);
  const hasCombo = [...keysPressed].every((key) =>
    ["MetaLeft", "ShiftLeft", "KeyR"].includes(key)
  );
  if (hasCombo) {
    keysPressed = new Set([]);
    toggleRecording();
  }
  keyTimer = setTimeout(() => {
    keysPressed = new Set([]);
    clearTimeout(keyTimer);
  }, 500);
});
