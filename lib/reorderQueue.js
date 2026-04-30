/**
 * Pure queue reorder with playback cursor tracking.
 * Moving the item at currentIndex updates the cursor to toIndex without changing which logical track is playing.
 */

function validateReorderIndices(queueLength, fromIndex, toIndex) {
  if (
    Number.isNaN(fromIndex) ||
    Number.isNaN(toIndex) ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= queueLength ||
    toIndex >= queueLength
  ) {
    return { ok: false, error: "invalid fromIndex or toIndex" };
  }
  return { ok: true };
}

/**
 * @param {unknown[]} queue
 * @param {number} fromIndex
 * @param {number} toIndex
 * @param {number} currentIndex - -1 when nothing is playing
 * @returns {{ ok: true, nextQueue: unknown[], nextCurrentIndex: number, reorderApplied: boolean } | { ok: false, error: string }}
 */
function reorderWithCursor(queue, fromIndex, toIndex, currentIndex) {
  const len = Array.isArray(queue) ? queue.length : 0;
  const validation = validateReorderIndices(len, fromIndex, toIndex);
  if (!validation.ok) {
    return validation;
  }

  if (fromIndex === toIndex) {
    return {
      ok: true,
      nextQueue: Array.isArray(queue) ? [...queue] : [],
      nextCurrentIndex: currentIndex,
      reorderApplied: false
    };
  }

  const nextQueue = [...queue];
  const [moved] = nextQueue.splice(fromIndex, 1);
  nextQueue.splice(toIndex, 0, moved);

  let nextCurrentIndex = currentIndex;
  if (currentIndex === fromIndex) {
    nextCurrentIndex = toIndex;
  } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
    nextCurrentIndex -= 1;
  } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
    nextCurrentIndex += 1;
  }

  return {
    ok: true,
    nextQueue,
    nextCurrentIndex,
    reorderApplied: true
  };
}

module.exports = {
  reorderWithCursor,
  validateReorderIndices
};
