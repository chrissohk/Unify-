"use strict";

/**
 * Fisher-Yates shuffle (returns a new array).
 * @param {unknown[]} items
 * @returns {unknown[]}
 */
function shuffleTracks(items) {
  const list = Array.isArray(items) ? [...items] : [];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = list[i];
    list[i] = list[j];
    list[j] = tmp;
  }
  return list;
}

module.exports = { shuffleTracks };
