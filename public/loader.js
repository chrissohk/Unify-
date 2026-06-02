/**
 * Opening loader — stroke-draw hexagon, trace U outline, reveal metallic fill + shimmer sweep (DESIGN.md).
 */
(function initAppLoader() {
  const loaderEl = document.getElementById("appLoader");
  const appRoot = document.getElementById("appRoot");
  const cameraEl = document.getElementById("loaderCamera");
  if (!loaderEl) return;

  const ZOOM_MS = 2200;
  const CAMERA_SCALE = 9;
  const EXIT_MS = 900;
  const EXIT_OFFSET = `-=${EXIT_MS}`;

  const resetCamera = () => {
    if (!cameraEl) return;
    cameraEl.style.transform = "none";
    cameraEl.classList.remove("is-zooming");
  };

  const removeLoader = () => {
    resetCamera();
    if (cameraEl) {
      cameraEl.remove();
    } else {
      loaderEl.remove();
    }
  };

  const finishLoading = () => {
    document.body.classList.remove("is-loading", "is-revealing");
    removeLoader();
    if (appRoot) appRoot.removeAttribute("aria-hidden");
    window.initBackgroundVideo?.();
  };

  const revealHero = () => {
    if (appRoot) appRoot.removeAttribute("aria-hidden");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-revealing");
  };

  const startZoomHandoff = () => {
    const uEl = document.querySelector("#logo .loader-u-fill");
    if (cameraEl && uEl) {
      const r = uEl.getBoundingClientRect();
      cameraEl.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
      cameraEl.classList.add("is-zooming");
    }
    loaderEl.offsetHeight;
  };

  const runHandoff = () => {
    document.body.classList.remove("is-revealing");
    removeLoader();
  };

  const skipAnimation =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches || navigator.webdriver;

  if (skipAnimation || typeof anime === "undefined") {
    finishLoading();
    return;
  }

  requestAnimationFrame(() => {
    loaderEl.classList.add("is-mounted");
    window.initBackgroundVideo?.();

    const hexPath = document.querySelector("#logo .loader-hex");
    let hexLen = 0;
    if (hexPath) {
      hexLen = hexPath.getTotalLength();
      hexPath.style.strokeDasharray = `${hexLen}`;
      hexPath.style.strokeDashoffset = `${hexLen}`;
    }

    const timeline = anime.timeline({ complete: runHandoff });

    timeline
      .add({
        targets: "#logo .loader-hex",
        delay: 300,
        duration: 1500,
        easing: "easeInOutQuart",
        strokeDashoffset: hexLen ? [hexLen, 0] : [anime.setDashoffset, 0],
      })
      .add({
        targets: "#logo .loader-u-stroke",
        duration: 900,
        easing: "easeInOutQuart",
        strokeDashoffset: [anime.setDashoffset, 0],
      })
      .add({
        targets: "#logo .loader-u-fill",
        duration: 1400,
        easing: "easeInOutSine",
        opacity: [0, 1],
      }, "-=350")
      .add({
        targets: "#loaderConvergenceU",
        gradientTransform: ["translate(32 0)", "translate(0 0)"],
        duration: 750,
        easing: "easeInOutSine",
      }, "-=250")
      .add(
        {
          targets: "#logo .loader-u-stroke",
          duration: 900,
          easing: "easeInOutSine",
          opacity: [1, 0],
        },
        "-=1100"
      )
      .add({
        targets: "#logo .loader-hex",
        duration: 250,
        easing: "easeInQuad",
        opacity: 0,
      })
      .add({
        duration: 0,
        complete: startZoomHandoff,
      })
      .add({
        targets: "#loaderCamera",
        scale: [1, CAMERA_SCALE],
        duration: ZOOM_MS,
        easing: "easeInOutCubic",
      })
      .add({
        targets: "#loaderCamera",
        opacity: [1, 0],
        filter: ["blur(0px)", "blur(6px)"],
        duration: EXIT_MS,
        easing: "easeInQuad",
        begin: () => {
          cameraEl?.classList.remove("is-zooming");
        },
        complete: revealHero,
      }, EXIT_OFFSET)
      .add({
        targets: "#appLoader",
        duration: 1300,
        easing: "easeInQuad",
        backgroundColor: ["rgba(11, 11, 12, 1)", "rgba(11, 11, 12, 0)"],
      }, "-=1900");
  });
})();
