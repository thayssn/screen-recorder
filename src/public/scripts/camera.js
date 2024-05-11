const userVideo = document.querySelector("#user");
const toggleCameraIcon = document.querySelector("#toggleVideo");
const userVideoWrapper = document.querySelector(".user_video_wrapper");

async function recordUserVideo() {
  const videoConstraints = {
    audio: false,
    video: true,
  };

  await navigator.mediaDevices.getUserMedia(videoConstraints).then((stream) => {
    userVideo.srcObject = stream;
    userVideo.onloadedmetadata = () => {
      userVideo.play();
    };
  });
}

async function resetUserVideo() {
  userVideo.srcObject = null;
}

function disableCamera() {
  userVideoWrapper.classList.add("hidden");
  toggleCameraIcon.classList.remove("on");
  recordUserVideo();
}

async function enableCamera() {
  userVideoWrapper.classList.remove("hidden");
  toggleCameraIcon.classList.add("on");
  await recordUserVideo();
}

async function toggleCamera() {
  const videoIsHidden = userVideoWrapper.classList.contains("hidden");
  console.log(videoIsHidden);
  videoIsHidden ? await enableCamera() : disableCamera();
}

toggleCameraIcon.addEventListener("click", toggleCamera);
