"use strict";

/**
 * Pure HSB color helpers ported from amandayehh/audio-visualizer (GPL-3.0).
 */

function mapValue(n, start1, stop1, start2, stop2) {
  if (stop1 === start1) return start2;
  return start2 + ((stop2 - start2) * (n - start1)) / (stop1 - start1);
}

function colorBass(_bpm, bass) {
  return {
    h: mapValue(bass, 40, 255, 120, 300),
    s: mapValue(bass, 40, 255, 240, 330),
    b: mapValue(bass, 40, 150, 230, 300)
  };
}

function colorMid(level, mid) {
  if (mid < 40) return { h: 300, s: 240, b: 300 };
  return {
    h: mapValue(mid, 40, 200, 300, 90),
    s: mapValue(mid, 40, 255, 240, 360),
    b: mapValue(mid, 40, 255, 300, 360)
  };
}

function colorTreble(_level, treble) {
  return {
    h: mapValue(treble, 0, 255, 100, 50),
    s: mapValue(treble, 0, 200, 180, 360),
    b: 360
  };
}

function colorMidRing(level, mid) {
  return {
    h: mapValue(mid, 0, 200, 120, 45),
    s: mapValue(level, 0, 0.4, 200, 360),
    b: mapValue(level, 0, 0.4, 260, 360)
  };
}

function colorHighMidRing(_level, highMid) {
  return {
    h: mapValue(highMid, 0, 200, 160, 90),
    s: 360,
    b: 360
  };
}

function colorOuterRing() {
  return { h: 0, s: 0, b: 360 };
}

function backgroundC(level, treble, bass, _bpm, lowMid, _highMid, mid) {
  let h = mapValue(mid, 0, 255, 220, 310);
  let s = 330;
  let b = mapValue(level, 0, 0.01, 70, 100);

  if (level > 0.01) {
    if (
      bass > 230 &&
      lowMid > 210 &&
      level > 0.3 &&
      bass - treble > 90 &&
      treble < 60 &&
      mid > 144
    ) {
      return { h: 0, s: 0, b: 360 };
    }
    if (
      bass > 200 &&
      lowMid > 180 &&
      lowMid < 210 &&
      level > 0.07 &&
      bass - treble > 90 &&
      treble < 120 &&
      mid > 160
    ) {
      h = mapValue(bass, 200, 255, 300, 160);
      if (h > 360) h -= 360;
      b = mapValue(mid, 160, 185, 200, 360);
      if (mid > 185) b = 360;
      s = 360;
    } else {
      h = mapValue(mid, 0, 255, 220, 310);
      s = 330;
      b = 100;
    }
  }
  return { h, s, b };
}

const api = {
  mapValue,
  colorBass,
  colorMid,
  colorTreble,
  colorMidRing,
  colorHighMidRing,
  colorOuterRing,
  backgroundC
};

if (typeof window !== "undefined") {
  window.TheaterVisualizerColors = api;
}
