"use strict";

/**
 * Fisher-Yates shuffle (returns a new array).
 * Keep in sync with lib/shuffleTracks.js.
 */

/**
 * @param {unknown[]} items
 * @returns {unknown[]}
 */
const shuffleTracks = (items) => {
  const list = Array.isArray(items) ? [...items] : [];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = list[i];
    list[i] = list[j];
    list[j] = tmp;
  }
  return list;
};

globalThis.unifyShuffleTracks = { shuffleTracks };

if (typeof module !== "undefined" && module.exports) {
  module.exports = { shuffleTracks };
}
