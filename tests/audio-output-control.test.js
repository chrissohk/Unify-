"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  pickDefaultDeviceId,
  resolveOutputLabel,
  devicesHaveUsableLabels,
  getHintText,
  FALLBACK_LABEL
} = require("../public/audioOutputControl.js");

const devices = [
  { kind: "audioinput", deviceId: "in1", label: "Mic" },
  { kind: "audiooutput", deviceId: "out1", label: "" },
  { kind: "audiooutput", deviceId: "default", label: "Default — Speakers" },
  { kind: "audiooutput", deviceId: "hp1", label: "Headphones (USB)" }
];

test("pickDefaultDeviceId prefers saved id when present", () => {
  assert.equal(pickDefaultDeviceId(devices, "hp1"), "hp1");
});

test("pickDefaultDeviceId falls back to default device id", () => {
  assert.equal(pickDefaultDeviceId(devices, null), "default");
});

test("pickDefaultDeviceId uses first labeled device when no default", () => {
  const noDefault = [
    { kind: "audiooutput", deviceId: "a", label: "" },
    { kind: "audiooutput", deviceId: "b", label: "Monitor" }
  ];
  assert.equal(pickDefaultDeviceId(noDefault, null), "b");
});

test("resolveOutputLabel uses matched device label", () => {
  assert.equal(resolveOutputLabel(devices, "hp1"), "Headphones (USB)");
});

test("resolveOutputLabel uses stored label when device label empty", () => {
  assert.equal(resolveOutputLabel(devices, "out1", "Saved speakers"), "Saved speakers");
});

test("resolveOutputLabel returns fallback when no labels", () => {
  const unlabeled = [{ kind: "audiooutput", deviceId: "x", label: "" }];
  assert.equal(resolveOutputLabel(unlabeled, "x"), FALLBACK_LABEL);
});

test("devicesHaveUsableLabels detects labeled outputs", () => {
  assert.equal(devicesHaveUsableLabels(devices), true);
  assert.equal(
    devicesHaveUsableLabels([{ kind: "audiooutput", deviceId: "a", label: "" }]),
    false
  );
});

test("getHintText varies by support mode", () => {
  assert.match(getHintText("supported"), /browser tab/i);
  assert.match(getHintText("unsupported"), /system settings/i);
});
