const audioConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
  },
  video: false,
};

const screenConstraints = {
  video: {
    mandatory: {
      chromeMediaSource: "desktop",
      cursor: "always",
    },
  },
};

function Recorder() {
  let mediaRecorder;
  let recordedChunks = [];

  function handleDataAvailable(e) {
    recordedChunks.push(e.data);
  }

  async function handleStop(e) {
    const blob = new Blob(recordedChunks, {
      type: "video/mp4",
    });
    const buffer = Buffer.from(await blob.arrayBuffer());

    ipcRenderer.send(IPCEvents.SAVE_VIDEO, buffer);
    recordedChunks = [];
  }

  async function setup() {
    const screenStream = await navigator.mediaDevices.getUserMedia(
      screenConstraints
    );
    const audioStream = await navigator.mediaDevices.getUserMedia(
      audioConstraints
    );

    let tracks = [...screenStream.getTracks(), ...audioStream.getAudioTracks()];
    const stream = new MediaStream(tracks);
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
  }

  return {
    setup,
    getState: () => mediaRecorder.state,
    start: () => {
      timer.start();
      mediaRecorder.start();
    },
    stop: () => {
      timer.reset();
      mediaRecorder.stop();
    },
  };
}

const recorder = new Recorder();

module.exports = recorder;
