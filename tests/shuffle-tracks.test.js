"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { shuffleTracks } = require("../lib/shuffleTracks.js");

test("shuffleTracks returns empty array for empty input", () => {
  assert.deepEqual(shuffleTracks([]), []);
  assert.deepEqual(shuffleTracks(null), []);
});

test("shuffleTracks returns single-element copy unchanged in length", () => {
  const input = [{ id: "a" }];
  const out = shuffleTracks(input);
  assert.equal(out.length, 1);
  assert.equal(out[0].id, "a");
  assert.notEqual(out, input);
});

test("shuffleTracks preserves all elements", () => {
  const input = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
  const out = shuffleTracks(input);
  assert.equal(out.length, input.length);
  const ids = out.map((t) => t.id).sort();
  assert.deepEqual(ids, ["a", "b", "c", "d"]);
  assert.notEqual(out, input);
});

test("public shuffleTracks matches lib export", () => {
  const { shuffleTracks: fromPublic } = require("../public/shuffleTracks.js");
  const input = [1, 2, 3, 4, 5];
  const out = fromPublic(input);
  assert.equal(out.length, 5);
  assert.deepEqual([...out].sort((a, b) => a - b), [1, 2, 3, 4, 5]);
});
