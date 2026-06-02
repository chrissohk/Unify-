"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { clampVolume, levelFromPercent, percentFromLevel } = require("../public/volumeControl.js");

test("clampVolume bounds 0..1", () => {
  assert.equal(clampVolume(-1), 0);
  assert.equal(clampVolume(0), 0);
  assert.equal(clampVolume(0.5), 0.5);
  assert.equal(clampVolume(1), 1);
  assert.equal(clampVolume(2), 1);
  assert.equal(clampVolume(NaN), 0);
});

test("levelFromPercent and percentFromLevel round-trip", () => {
  assert.equal(levelFromPercent(0), 0);
  assert.equal(levelFromPercent(50), 0.5);
  assert.equal(levelFromPercent(100), 1);
  assert.equal(percentFromLevel(0.8), 80);
});
