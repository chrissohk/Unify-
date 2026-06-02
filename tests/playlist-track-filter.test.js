"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { filterPlaylistTracks } = require("../lib/filterPlaylistTracks.js");

const sample = [
  { title: "Alpha Song", artist: "Artist One" },
  { title: "Beta", artist: "Second Artist" },
  { title: "Gamma", artist: "One More" }
];

test("filterPlaylistTracks returns all tracks when query is empty", () => {
  assert.deepEqual(filterPlaylistTracks(sample, ""), sample);
  assert.deepEqual(filterPlaylistTracks(sample, "   "), sample);
});

test("filterPlaylistTracks matches title case-insensitively", () => {
  const out = filterPlaylistTracks(sample, "alpha");
  assert.equal(out.length, 1);
  assert.equal(out[0].title, "Alpha Song");
});

test("filterPlaylistTracks matches artist case-insensitively", () => {
  const out = filterPlaylistTracks(sample, "second");
  assert.equal(out.length, 1);
  assert.equal(out[0].title, "Beta");
});

test("filterPlaylistTracks returns empty when nothing matches", () => {
  assert.deepEqual(filterPlaylistTracks(sample, "zzz"), []);
});

test("filterPlaylistTracks matches title only without requiring artist in query", () => {
  const out = filterPlaylistTracks(sample, "gamma");
  assert.equal(out.length, 1);
  assert.equal(out[0].title, "Gamma");
});

test("filterPlaylistTracks matches artist when title does not contain query", () => {
  const out = filterPlaylistTracks(sample, "one more");
  assert.equal(out.length, 1);
  assert.equal(out[0].artist, "One More");
});
