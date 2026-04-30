const { test } = require("node:test");
const assert = require("node:assert/strict");
const { reorderWithCursor, validateReorderIndices } = require("../lib/reorderQueue");

test("validateReorderIndices rejects out of range", () => {
  assert.equal(validateReorderIndices(1, 0, 5).ok, false);
  assert.equal(validateReorderIndices(1, -1, 0).ok, false);
});

test("no-op reorder preserves queue and cursor", () => {
  const queue = [{ id: "a" }, { id: "b" }];
  const r = reorderWithCursor(queue, 0, 0, 0);
  assert.equal(r.ok, true);
  assert.equal(r.reorderApplied, false);
  assert.deepEqual(r.nextQueue, queue);
  assert.equal(r.nextCurrentIndex, 0);
});

test("moves playing item and updates cursor index", () => {
  const queue = [{ id: "1" }, { id: "2" }, { id: "3" }];
  const r = reorderWithCursor(queue, 0, 2, 0);
  assert.equal(r.ok, true);
  assert.equal(r.reorderApplied, true);
  assert.equal(r.nextQueue[2].id, "1");
  assert.equal(r.nextCurrentIndex, 2);
});

test("shifts cursor when playing index is not the moved item", () => {
  const queue = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
  const r = reorderWithCursor(queue, 3, 1, 1);
  assert.equal(r.ok, true);
  assert.equal(r.nextCurrentIndex, 2);
});

test("auto-advance target: reorder then next index is current+1 in new order", () => {
  const queue = [{ id: "sp-1" }, { id: "sc-3" }, { id: "sp-2" }];
  const afterReorder = reorderWithCursor(queue, 2, 1, 0);
  assert.equal(afterReorder.nextQueue[1].id, "sp-2");
  assert.equal(afterReorder.nextCurrentIndex, 0);
});
