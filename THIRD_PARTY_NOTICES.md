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

## Tab audio capture

Theater visuals use `navigator.mediaDevices.getDisplayMedia` to analyze audio from the current browser tab. Browser support and behavior vary (especially Safari). Users must explicitly grant permission each session.
