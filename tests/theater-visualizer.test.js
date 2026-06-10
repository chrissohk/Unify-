"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const colors = require("../lib/theaterVisualizerColors.js");

describe("theaterVisualizerColors", () => {
  it("maps values linearly", () => {
    assert.equal(colors.mapValue(5, 0, 10, 0, 100), 50);
  });

  it("returns bass hues in expected range for strong bass", () => {
    const c = colors.colorBass(0, 200);
    assert.ok(c.h >= 120 && c.h <= 300);
    assert.ok(c.s >= 240);
    assert.ok(c.b >= 230);
  });

  it("returns muted mid colors when mid energy is low", () => {
    const c = colors.colorMid(0.1, 10);
    assert.deepEqual(c, { h: 300, s: 240, b: 300 });
  });

  it("backgroundC brightens on heavy bass and mid", () => {
    const c = colors.backgroundC(0.35, 20, 240, 0, 215, 100, 170);
    assert.equal(c.b, 360);
    assert.equal(c.s, 0);
  });

  it("colorOuterRing is white in HSB space", () => {
    assert.deepEqual(colors.colorOuterRing(0.2, 100), { h: 0, s: 0, b: 360 });
  });
});
