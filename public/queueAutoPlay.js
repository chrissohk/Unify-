"use strict";

/**
 * Client-side index resolution after queueing while idle.
 */

/**
 * @param {Array<{ id?: string }>} queue
 * @param {number} currentIndex
 * @param {string | null | undefined} createdItemId
 */
const resolveAutoPlayIndexAfterQueue = (queue, currentIndex, createdItemId) => {
  if (currentIndex >= 0 || !Array.isArray(queue) || queue.length === 0) return -1;
  const idx = queue.findIndex((q) => q?.id === createdItemId);
  return idx >= 0 ? idx : queue.length - 1;
};

globalThis.unifyQueueAutoPlay = { resolveAutoPlayIndexAfterQueue };

if (typeof module !== "undefined" && module.exports) {
  module.exports = { resolveAutoPlayIndexAfterQueue };
}
