function initBackgroundVideo() {
  const video = document.querySelector(".video-background__media");
  if (!video || video.dataset.bgVideoInit === "1") return;

  const url = video.getAttribute("data-src");
  if (!url) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  video.dataset.bgVideoInit = "1";

  const tryPlay = () => {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  const canPlayNativeHls =
    video.canPlayType("application/vnd.apple.mpegurl") ||
    video.canPlayType("application/x-mpegURL");

  if (canPlayNativeHls) {
    video.src = url;
    video.addEventListener("loadedmetadata", tryPlay, { once: true });
    tryPlay();
    return;
  }

  const Hls = window.Hls;
  if (!Hls || !Hls.isSupported()) return;

  const hls = new Hls({ enableWorker: true });
  hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
  hls.on(Hls.Events.ERROR, (_event, data) => {
    if (data.fatal) {
      hls.destroy();
    }
  });
  hls.loadSource(url);
  hls.attachMedia(video);
}

window.initBackgroundVideo = initBackgroundVideo;
