const video = document.getElementById("video");

video.addEventListener("loadedmetadata", () => {
  console.log("Video Ready");
});

video.addEventListener("error", e => {
  console.log(e);
});
