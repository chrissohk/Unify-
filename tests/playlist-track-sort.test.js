"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { sortPlaylistTracks } = require("../lib/sortPlaylistTracks.js");

const sample = [
  { id: "a", title: "Alpha", addedAt: "2024-01-01T00:00:00.000Z" },
  { id: "b", title: "Beta", addedAt: "2024-06-01T00:00:00.000Z" },
  { id: "c", title: "Gamma", addedAt: "2024-03-01T00:00:00.000Z" },
  { id: "d", title: "No date" }
];

test("sortPlaylistTracks returns input order for default mode", () => {
  assert.deepEqual(sortPlaylistTracks(sample, "default"), sample);
  assert.deepEqual(sortPlaylistTracks(sample, ""), sample);
  assert.deepEqual(sortPlaylistTracks(sample, "invalid"), sample);
});

test("sortPlaylistTracks sorts newest first by addedAt", () => {
  const out = sortPlaylistTracks(sample, "newest");
  assert.deepEqual(
    out.map((t) => t.id),
    ["b", "c", "a", "d"]
  );
});

test("sortPlaylistTracks sorts oldest first by addedAt", () => {
  const out = sortPlaylistTracks(sample, "oldest");
  assert.deepEqual(
    out.map((t) => t.id),
    ["a", "c", "b", "d"]
  );
});

test("sortPlaylistTracks keeps stable order for equal timestamps", () => {
  const tied = [
    { id: "1", addedAt: "2024-01-01T00:00:00.000Z" },
    { id: "2", addedAt: "2024-01-01T00:00:00.000Z" },
    { id: "3", addedAt: "2024-01-01T00:00:00.000Z" }
  ];
  assert.deepEqual(
    sortPlaylistTracks(tied, "newest").map((t) => t.id),
    ["1", "2", "3"]
  );
  assert.deepEqual(
    sortPlaylistTracks(tied, "oldest").map((t) => t.id),
    ["1", "2", "3"]
  );
});

test("sortPlaylistTracks treats missing addedAt as last", () => {
  const mixed = [
    { id: "dated", addedAt: "2024-05-01T00:00:00.000Z" },
    { id: "undated" },
    { id: "older", addedAt: "2024-01-01T00:00:00.000Z" }
  ];
  assert.deepEqual(
    sortPlaylistTracks(mixed, "newest").map((t) => t.id),
    ["dated", "older", "undated"]
  );
  assert.deepEqual(
    sortPlaylistTracks(mixed, "oldest").map((t) => t.id),
    ["older", "dated", "undated"]
  );
});
