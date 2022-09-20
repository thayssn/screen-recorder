const userVideo = document.querySelector("#user");
const toggleVideo = document.querySelector("#toggleVideo");
const userVideoWrapper = document.querySelector(".user_video_wrapper");

toggleVideo.addEventListener("click", async () => {
  userVideoWrapper.classList.toggle("hidden");
  toggleVideo.classList.toggle("on");
  toggleVideo.classList.toggle("off");
  const videoIsHidden = userVideoWrapper.classList.contains("hidden");
  videoIsHidden ? resetUserVideo() : await recordUserVideo();
});

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
