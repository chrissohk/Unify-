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

/** Any queue row may be deleted. */
function canRemoveQueueItemAt(_item, _index, _queueState) {
  return true;
}

/** Statuses after manual removal (preserve played history before the cursor). */
function mapQueueAfterRemove(queue, currentIndex) {
  if (currentIndex < 0) {
    return queue.map((item) => ({
      ...item,
      status: item.status === "played" ? "played" : "queued"
    }));
  }
  return queue.map((item, i) => ({
    ...item,
    status:
      i === currentIndex
        ? "playing"
        : i < currentIndex && item.status === "played"
          ? "played"
          : "queued"
  }));
}

/**
 * Remove a queue row and keep the playback cursor consistent.
 * @param {unknown[]} queue
 * @param {number} index
 * @param {number} currentIndex
 */
function removeQueueItemAt(queue, index, currentIndex) {
  const len = Array.isArray(queue) ? queue.length : 0;
  if (Number.isNaN(index) || index < 0 || index >= len) {
    return { ok: false, error: "invalid index" };
  }

  const removedPlaying = currentIndex === index;
  const nextQueue = queue.filter((_, i) => i !== index);
  let nextCurrentIndex = currentIndex;

  if (removedPlaying) {
    if (nextQueue.length === 0) {
      nextCurrentIndex = -1;
    } else if (index < nextQueue.length) {
      nextCurrentIndex = index;
    } else {
      nextCurrentIndex = nextQueue.length - 1;
    }
  } else if (index < currentIndex) {
    nextCurrentIndex -= 1;
  }

  if (nextQueue.length === 0) {
    nextCurrentIndex = -1;
  }

  return {
    ok: true,
    nextQueue: mapQueueAfterRemove(nextQueue, nextCurrentIndex),
    nextCurrentIndex,
    queueEmpty: nextQueue.length === 0,
    removedPlaying
  };
}

/** Status for each row after advancing the cursor to nextIndex. */
function queueItemStatusAfterAdvance(index, nextIndex) {
  if (index < nextIndex) return "played";
  if (index === nextIndex) return "playing";
  return "queued";
}

/**
 * Preserve `played` on rows already heard; only the selected index becomes `playing`.
 * @param {Array<{ status?: string }>} queue
 * @param {number} playingIndex
 */
function mapQueueForNowPlaying(queue, playingIndex) {
  return queue.map((item, i) => ({
    ...item,
    status: i === playingIndex ? "playing" : item.status === "played" ? "played" : "queued"
  }));
}

/**
 * Resolve playback cursor when `currentIndex` is stale but a row is still marked playing.
 * @param {Array<{ status?: string }>} queue
 * @param {number} currentIndex
 * @param {string | null | undefined} status
 */
function resolveEffectiveCurrentIndex(queue, currentIndex, status) {
  const list = Array.isArray(queue) ? queue : [];
  const len = list.length;
  if (Number.isInteger(currentIndex) && currentIndex >= 0 && currentIndex < len) {
    return currentIndex;
  }
  if (status === "playing" || status === "ready") {
    const playingIdx = list.findIndex((item) => item?.status === "playing");
    if (playingIdx >= 0) return playingIdx;
  }
  return -1;
}

/**
 * Reorder queue so target index becomes the active "now playing" row.
 * When something is already playing, removes that row (skip) before promoting the pick.
 * Other queued rows stay behind the pick in their relative order.
 * @param {unknown[]} queue
 * @param {number} currentIndex - -1 when nothing is playing
 * @param {number} targetIndex
 */
function selectNowPlayingWithReorder(queue, currentIndex, targetIndex) {
  const list = Array.isArray(queue) ? [...queue] : [];
  const len = list.length;
  if (targetIndex < 0 || targetIndex >= len) {
    return { nextQueue: list, nextCurrentIndex: currentIndex };
  }
  if (targetIndex === currentIndex) {
    return { nextQueue: list, nextCurrentIndex: currentIndex };
  }

  let working = list;
  let adjTarget = targetIndex;
  if (currentIndex >= 0) {
    const { nextQueue } = pruneQueueAfterLeavingTrack(list, currentIndex);
    working = nextQueue;
    if (targetIndex > currentIndex) {
      adjTarget = targetIndex - 1;
    }
  }

  if (adjTarget < 0 || adjTarget >= working.length) {
    return { nextQueue: working, nextCurrentIndex: working.length > 0 ? 0 : -1 };
  }

  const picked = working[adjTarget];
  const inFront = working.slice(0, adjTarget);
  const after = working.slice(adjTarget + 1);
  const nextQueue = [picked, ...inFront, ...after];

  return { nextQueue, nextCurrentIndex: 0 };
}

/** Mark every row played when the queue has finished. */
function mapQueueOnQueueEnd(queue) {
  return queue.map((item) => ({ ...item, status: "played" }));
}

/**
 * Remove the track that just finished or was skipped; slide the next track to currentIndex.
 * @param {unknown[]} queue
 * @param {number} leavingIndex - index of the row that completed
 */
function pruneQueueAfterLeavingTrack(queue, leavingIndex) {
  const nextQueue = queue.filter((_, i) => i !== leavingIndex);
  const queueEnded = leavingIndex >= nextQueue.length;
  const nextCurrentIndex = queueEnded ? -1 : leavingIndex;
  return { nextQueue, nextCurrentIndex, queueEnded };
}

/**
 * Rows to show in the up-next list (excludes the currently playing index).
 * @param {unknown[]} queue
 * @param {number} currentIndex - -1 when nothing is playing
 */
function upcomingQueueEntries(queue, currentIndex) {
  const list = Array.isArray(queue) ? queue : [];
  if (currentIndex < 0) {
    return list.map((item, idx) => ({ item, idx }));
  }
  return list.map((item, idx) => ({ item, idx })).filter(({ idx }) => idx !== currentIndex);
}

/** Apply playing / queued statuses after prune. */
function mapQueueAfterPrune(queue, currentIndex) {
  if (currentIndex < 0) {
    return queue.map((item) => ({ ...item, status: "played" }));
  }
  return queue.map((item, i) => ({
    ...item,
    status: i === currentIndex ? "playing" : "queued"
  }));
}

/**
 * When nothing is playing, return the queue index to start after POST /api/queue.
 * @param {Array<{ id?: string }>} queue
 * @param {number} currentIndex
 * @param {string | null | undefined} createdItemId
 */
function resolveAutoPlayIndexAfterQueue(queue, currentIndex, createdItemId) {
  if (currentIndex >= 0 || !Array.isArray(queue) || queue.length === 0) return -1;
  const idx = queue.findIndex((q) => q?.id === createdItemId);
  return idx >= 0 ? idx : queue.length - 1;
}

module.exports = {
  reorderWithCursor,
  validateReorderIndices,
  canRemoveQueueItemAt,
  removeQueueItemAt,
  mapQueueAfterRemove,
  queueItemStatusAfterAdvance,
  mapQueueForNowPlaying,
  resolveEffectiveCurrentIndex,
  selectNowPlayingWithReorder,
  mapQueueOnQueueEnd,
  pruneQueueAfterLeavingTrack,
  mapQueueAfterPrune,
  upcomingQueueEntries,
  resolveAutoPlayIndexAfterQueue
};
