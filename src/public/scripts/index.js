const { ipcRenderer } = require("electron");
const IPCEvents = require("../../enums/events");
const recorder = require("./mediaRecorder");

const startBtn = document.querySelector("#play");
const status = document.querySelector("#status");
const selectSourceBtn = document.querySelector("#selectSourceBtn");

startBtn.onclick = toggleRecording;
selectSourceBtn.onclick = getVideoSources;

function toggleRecording() {
  console.log(recorder);
  if (recorder.getState() !== "recording") {
    startBtn.className = "stop";
    recorder.start();
  } else {
    startBtn.className = "start";
    startBtn.disabled = true;
    status.innerText = "Processando...";
    recorder.stop();
  }
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
    alert("Não foi possível processar o vídeo");
  } else {
    alert("Vídeo processado com sucesso");
  }
  status.innerText = "";
  startBtn.disabled = null;
});

ipcRenderer.on(IPCEvents.USER_CANCELLED, () => {
  status.innerText = "";
  startBtn.disabled = null;
});

getVideoSources();
