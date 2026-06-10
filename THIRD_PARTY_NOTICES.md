# Third-Party Notices

This project incorporates GPL-3.0 licensed components. See [LICENSE](LICENSE).

## amandayehh/audio-visualizer

- **Source:** https://github.com/amandayehh/audio-visualizer
- **License:** GNU General Public License v3.0
- **Use:** Theater mode audio visualization (`public/theaterVisualizerSketch.js`, derived from `javascript/sketch.js`)

## p5.js

- **Source:** https://p5js.org/
- **License:** LGPL-2.1 (p5.js core); see upstream for p5.sound
- **Use:** Vendored in `public/vendor/p5.min.js` and `public/vendor/p5.sound.min.js`

## Microphone audio capture

Theater visuals use `navigator.mediaDevices.getUserMedia` to analyze audio from the device microphone (what is playing through speakers or headphones). Browser support and behavior vary. Users must explicitly grant microphone permission each session. Headphones are recommended to reduce feedback.
