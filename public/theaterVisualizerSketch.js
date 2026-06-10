"use strict";

/**
 * Theater audio visualizer sketch — ported from amandayehh/audio-visualizer (GPL-3.0).
 * Uses microphone MediaStream instead of dropped audio files.
 */

(function () {
  const colors = () => window.TheaterVisualizerColors;

  function createSketchState() {
    return {
      cframe: 0,
      plevel: 0,
      level: 0,
      treble: 0,
      ptreble: 0,
      pmid: 0,
      mid: 0,
      highMid: 0,
      phighmid: 0,
      ringN1: 0,
      ringN2: 0,
      ringN3: 0,
      bpm: 0,
      pbtime: 0,
      s1: 0,
      sw1: 0,
      expand: 1,
      cposx: [],
      cposy: [],
      csize: 0,
      csw: 0,
      midRingP: 60,
      trebleRingP: 390,
      highMidRingP: 200
    };
  }

  function fillHsb(p, c) {
    p.fill(c.h, c.s, c.b);
  }

  function create(container, stream, options = {}) {
    const st = createSketchState();
    let fft;
    let amplitude;
    let peakDetect;
    let mediaSource;
    let resetSketchState = null;

    const sketchFn = (p) => {
      resetSketchState = () => {
        Object.assign(st, createSketchState());
      };

      p.setup = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        p.createCanvas(w, h).parent(container);
        p.colorMode(p.HSB, 360);
        p.rectMode(p.CENTER);

        const ac = p.getAudioContext();
        if (typeof p.userStartAudio === "function") {
          p.userStartAudio();
        }
        if (ac.state === "suspended") {
          void ac.resume();
        }

        mediaSource = ac.createMediaStreamSource(stream);
        const tap = ac.createGain();
        tap.gain.value = 1;
        mediaSource.connect(tap);

        fft = new p5.FFT(0, 1024);
        fft.setInput(tap);
        amplitude = new p5.Amplitude();
        amplitude.setInput(tap);
        peakDetect = new p5.PeakDetect();
        resetSketchState();
      };

      p.windowResized = () => {
        p.resizeCanvas(container.clientWidth, container.clientHeight);
      };

      p.draw = () => {
        const c = colors();
        if (!c || !fft || !amplitude) return;

        if (options.getPlaybackFrozen?.()) {
          p.noStroke();
          p.background(0, 0, 15);
          return;
        }

        fft.analyze();

        p.noStroke();
        p.colorMode(p.HSB, 360);

        const prevTreble = st.treble;
        st.treble = fft.getEnergy("treble");
        const bass = fft.getEnergy("bass");
        st.phighmid = st.highMid;
        st.highMid = fft.getEnergy("highMid");
        const lowMid = fft.getEnergy("lowMid");
        st.pmid = st.mid;
        st.mid = fft.getEnergy("mid");
        st.plevel = st.level;
        st.level = amplitude.getLevel();
        peakDetect.update(fft);

        const bg = c.backgroundC(st.level, st.treble, bass, st.bpm, lowMid, st.highMid, st.mid);
        p.background(bg.h, bg.s, bg.b);

        if (peakDetect.isDetected) {
          st.bpm = st.cframe - st.pbtime;
          st.pbtime = st.cframe;
        } else {
          st.bpm *= 0.95;
        }
        st.cframe++;

        p.noStroke();
        fillHsb(p, c.colorBass(st.bpm, bass));
        if (bass > 40) {
          p.rect(p.width / 2, p.height / 2, p.width, p.map(bass, 40, 255, 0, 150));
        }

        if (st.treble > prevTreble - 3) {
          if (st.treble > prevTreble) {
            st.ringN2 += p.map(st.treble - prevTreble, 0, 20, 0, 1);
          }
        } else {
          if (st.ringN2 > 6) st.ringN2 *= 0.4;
          else st.ringN2--;
          if (st.ringN2 < 1) st.ringN2 = 0;
        }
        fillHsb(p, c.colorOuterRing(st.level, st.treble));

        if (st.highMid > st.phighmid - 3) {
          if (st.highMid > st.phighmid) {
            st.ringN3 += p.map(st.highMid - st.phighmid, 0, 6, 0, 0.3);
          }
        } else {
          if (st.ringN3 > 6) st.ringN3 *= 0.4;
          else st.ringN3--;
          if (st.ringN3 < 1) st.ringN3 = 0;
        }

        if (st.mid > st.pmid - 3) {
          if (st.mid > st.pmid) {
            st.ringN1 += p.map(st.mid - st.pmid, -1, 8, 0, 0.2);
          }
        } else {
          if (st.ringN1 > 6) st.ringN1 *= 0.3;
          else st.ringN1--;
          if (st.ringN1 < 1) st.ringN1 = 0;
        }
        fillHsb(p, c.colorMidRing(st.level, st.mid));

        fillHsb(p, c.colorMid(st.level, st.mid));
        if (st.mid > 40) {
          const midSize = p.map(st.mid, 40, 255, 0, 400);
          p.ellipse(p.width / 2, p.height / 2, midSize, midSize);
        }

        if (peakDetect.isDetected && lowMid > 210 && st.mid > 168) {
          const bassStroke = p.map(st.level, 0, 0.3, 30, 120);
          p.stroke(bassStroke, 360, 360);
          st.s1 = p.map(st.mid, 0, 255, 0, 400);
          st.expand = p.map(st.level, 0.15, 0.4, 1.1, 1.16);
          st.sw1 = p.map(st.level, 0.05, 0.6, 0, 400);
          p.strokeWeight(st.sw1);
          p.ellipse(p.width / 2, p.height / 2, st.s1, st.s1);
        } else if (st.sw1 > 1) {
          p.stroke(0, 0, 360);
          st.sw1 *= 0.8;
          st.s1 *= st.expand;
          p.strokeWeight(st.sw1);
          p.noFill();
          p.ellipse(p.width / 2, p.height / 2, st.s1, st.s1);
        }
        p.noStroke();

        fillHsb(p, c.colorTreble(st.level, st.treble));
        p.push();
        p.translate(p.width / 2, p.height / 2);
        p.rotate(p.radians(45));
        const trebleSize = p.map(st.treble, 0, 255, 0, 300);
        p.rect(0, 0, trebleSize, trebleSize);
        p.pop();

        if (peakDetect.isDetected && lowMid < 210 && st.mid > 168 && st.level > 0.16) {
          const numofc = p.map(st.level, 0, 0.5, 1, 15);
          st.cposx = [];
          st.cposy = [];
          for (let i = 0; i < numofc; i++) {
            st.cposx.push(p.random(0, p.width));
            st.cposy.push(p.random(0, p.height));
          }
          st.csize = p.map(st.treble, 50, 255, 0, 100);
          st.csw = p.map(st.level, 0, 0.5, 0, 60);
        }
        if (st.csw > 1) {
          p.noFill();
          p.strokeWeight(st.csw);
          p.stroke(0, 0, 360);
          st.csize *= 1.2;
          st.csw *= 0.7;
          for (let i = 0; i < st.cposx.length; i++) {
            p.ellipse(st.cposx[i], st.cposy[i], st.csize, st.csize);
          }
        }

        if (bass > 240 && lowMid > 192 && st.level > 0.15) {
          p.fill(230, 360, 360);
        } else {
          fillHsb(p, c.colorMidRing(st.level, st.mid));
        }

        p.push();
        p.translate(p.width / 2, p.height / 2);
        for (let i = 1; i <= st.ringN1; i++) {
          if (lowMid < 220 && bass < 230) {
            p.push();
            p.rotate(p.radians((360 / st.ringN1) * i));
            if (st.midRingP < 60) st.midRingP += 30;
            p.rect(
              st.midRingP + p.map(st.mid, 0, 255, 0, 240),
              0,
              30 + p.map(st.mid, 80, 255, 0, 230),
              p.map(st.mid, 0, 255, 0, 50)
            );
            p.pop();
          } else {
            if (st.midRingP > 20) st.midRingP -= 30;
            p.push();
            p.rotate(p.radians((360 / st.ringN1) * i));
            p.rect(
              st.midRingP + p.map(st.mid, 0, 255, 0, 240),
              0,
              30 + p.map(st.mid, 80, 255, 0, 230),
              p.map(st.mid, 0, 255, 0, 50)
            );
            p.pop();
          }
        }
        p.pop();

        fillHsb(p, c.colorHighMidRing(st.level, st.highMid));
        if (st.ringN3 > 2) {
          p.push();
          p.translate(p.width / 2, p.height / 2);
          if (lowMid < 220 && bass < 230) {
            if (st.highMidRingP < 205) st.highMidRingP += 60;
            for (let i = 0; i <= st.ringN3; i++) {
              p.push();
              p.rotate(p.radians((360 / st.ringN3) * i));
              p.rect(
                st.highMidRingP + p.map(st.highMid, 0, 255, 0, 240),
                0,
                30 + p.map(st.highMid, 80, 255, 0, 100),
                p.map(st.highMid, 0, 255, 0, 20)
              );
              p.pop();
            }
          } else {
            if (st.highMidRingP > 60) st.highMidRingP -= 60;
            for (let i = 0; i <= st.ringN3; i++) {
              p.push();
              p.rotate(p.radians((360 / st.ringN3) * i));
              p.rect(
                st.highMidRingP + p.map(st.highMid, 0, 255, 0, 240),
                0,
                30 + p.map(st.highMid, 80, 255, 0, 100),
                p.map(st.highMid, 0, 255, 0, 30)
              );
              p.pop();
            }
          }
          p.pop();
        }

        if (bass > 240 && lowMid > 192 && st.level > 0.15) {
          p.fill(340, 300, 360);
        } else {
          fillHsb(p, c.colorOuterRing(st.level, st.treble));
        }
        if (st.ringN2 > 2) {
          p.push();
          p.translate(p.width / 2, p.height / 2);
          for (let i = 1; i <= st.ringN2; i++) {
            if (lowMid < 220 && bass < 230) {
              p.push();
              if (st.trebleRingP < 390) st.trebleRingP += 60;
              p.rotate(p.radians((360 / st.ringN2) * i));
              p.rect(
                st.trebleRingP + p.map(st.treble, 0, 255, 0, 90),
                0,
                30 + p.map(st.treble, 40, 255, 0, 100),
                p.map(st.treble, 0, 255, 0, 30)
              );
              p.pop();
            } else {
              if (st.trebleRingP > 150) st.trebleRingP -= 60;
              p.push();
              p.rotate(p.radians((360 / st.ringN2) * i));
              p.rect(
                st.trebleRingP + p.map(st.treble, 0, 255, 0, 90),
                0,
                30 + p.map(st.treble, 40, 255, 0, 100),
                p.map(st.treble, 0, 255, 0, 30)
              );
              p.pop();
            }
          }
          p.pop();
        }
      };

    };

    const instance = new p5(sketchFn, container);
    instance._theaterVisualizerReset = () => resetSketchState?.();
    return instance;
  }

  function resetState(instance) {
    instance?._theaterVisualizerReset?.();
  }

  async function warmupAudio() {
    if (typeof p5 === "undefined") return;
    const ac = p5.prototype.getAudioContext?.();
    if (ac?.state === "suspended") {
      await ac.resume();
    }
  }

  const api = { create, resetState, warmupAudio };

  if (typeof window !== "undefined") {
    window.TheaterVisualizerSketch = api;
  }
})();
