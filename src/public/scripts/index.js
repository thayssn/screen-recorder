const { ipcRenderer } = require("electron");
const IPCEvents = {
  REQUEST_SOURCES: "REQUEST_SOURCES",
  SOURCE_SELECTED: "SOURCE_SELECTED",
  SAVE_VIDEO: "SAVE_VIDEO",
  USER_CANCELLED: "USER_CANCELLED",
  COMPRESSED_VIDEO: "COMPRESSED_VIDEO",
  CLOSE_APP: "CLOSE_APP",
};

const startBtn = document.querySelector("#play");
const status = document.querySelector("#status");
const selectSourceBtn = document.querySelector("#selectSourceBtn");
const closeBtn = document.querySelector("#closeApp");

startBtn.onclick = toggleRecording;
closeBtn.onclick = closeApp;
selectSourceBtn.onclick = getVideoSources;

function toggleRecording() {
  console.log(recorder);
  if (recorder.getState() !== "recording") {
    startBtn.className = "stop";
    recorder.start();
  } else {
    startBtn.className = "start";
    startBtn.disabled = true;
    selectSourceBtn.disabled = true;
    closeBtn.disabled = true;
    status.innerText = "Processing...";
    recorder.stop();
  }
}

async function closeApp() {
  ipcRenderer.send(IPCEvents.CLOSE_APP);
}

async function getVideoSources() {
  ipcRenderer.send(IPCEvents.REQUEST_SOURCES);
  recorder.setup();
}

ipcRenderer.on(IPCEvents.SOURCE_SELECTED, (event, source) => {
  startBtn.className = "start";
  selectSource(source);
});

async function selectSource(source) {
  selectSourceBtn.innerText = source.name;
}

ipcRenderer.on(IPCEvents.COMPRESSED_VIDEO, (event, error) => {
  if (error) {
    console.error(error);
    alert("An error ocurred while processing the recording.");
  } else {
    alert("Recording saved successfuly");
  }
  status.innerText = "";
  startBtn.disabled = null;
  selectSourceBtn.disabled = null;
  closeBtn.disabled = null;
});

ipcRenderer.on(IPCEvents.USER_CANCELLED, () => {
  status.innerText = "";
  startBtn.disabled = null;
  selectSourceBtn.disabled = null;
  closeBtn.disabled = null;
});

ipcRenderer.on(IPCEvents.SAVE_VIDEO, (event, error) => {
  if (error) {
    console.error(error);
    alert(
      "Could not save the recording. An error occurred while writing the requested file."
    );
  }
});

getVideoSources();
