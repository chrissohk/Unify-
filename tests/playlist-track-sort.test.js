"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { sortPlaylistTracks, sortPlaylistTracksByPlaylistOrder } = require("../lib/sortPlaylistTracks.js");

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

test("sortPlaylistTracks reverses by playlistPosition when timestamps tie", () => {
  const tied = [
    { id: "1", addedAt: "2024-01-01T00:00:00.000Z", playlistPosition: 0 },
    { id: "2", addedAt: "2024-01-01T00:00:00.000Z", playlistPosition: 1 },
    { id: "3", addedAt: "2024-01-01T00:00:00.000Z", playlistPosition: 2 }
  ];
  assert.deepEqual(
    sortPlaylistTracks(tied, "newest").map((t) => t.id),
    ["3", "2", "1"]
  );
  assert.deepEqual(
    sortPlaylistTracks(tied, "oldest").map((t) => t.id),
    ["1", "2", "3"]
  );
});

test("sortPlaylistTracks tail page with same addedAt shows newest playlist positions first", () => {
  const tailPage = [
    { id: "t48", addedAt: "2024-06-01T00:00:00.000Z", playlistPosition: 48 },
    { id: "t49", addedAt: "2024-06-01T00:00:00.000Z", playlistPosition: 49 },
    { id: "t50", addedAt: "2024-06-01T00:00:00.000Z", playlistPosition: 50 }
  ];
  assert.deepEqual(
    sortPlaylistTracks(tailPage, "newest").map((t) => t.id),
    ["t50", "t49", "t48"]
  );
  assert.deepEqual(
    sortPlaylistTracks(tailPage, "oldest").map((t) => t.id),
    ["t48", "t49", "t50"]
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

test("sortPlaylistTracksByPlaylistOrder ignores addedAt and sorts by playlistPosition", () => {
  const tracks = [
    { id: "first", addedAt: "2024-06-03T00:00:00.000Z", playlistPosition: 0 },
    { id: "second", addedAt: "2024-06-01T00:00:00.000Z", playlistPosition: 1 },
    { id: "third", addedAt: "2024-06-02T00:00:00.000Z", playlistPosition: 2 }
  ];
  assert.deepEqual(
    sortPlaylistTracks(tracks, "newest").map((t) => t.id),
    ["first", "third", "second"]
  );
  assert.deepEqual(
    sortPlaylistTracksByPlaylistOrder(tracks, "oldest").map((t) => t.id),
    ["first", "second", "third"]
  );
  assert.deepEqual(
    sortPlaylistTracksByPlaylistOrder(tracks, "newest").map((t) => t.id),
    ["third", "second", "first"]
  );
});

test("sortPlaylistTracksByPlaylistOrder newest is exact reverse of oldest", () => {
  const tracks = [
    { id: "a", addedAt: "2024-01-01T00:00:00.000Z", playlistPosition: 10 },
    { id: "b", addedAt: "2024-01-01T00:00:00.000Z", playlistPosition: 11 },
    { id: "c", addedAt: "2024-01-02T00:00:00.000Z", playlistPosition: 12 }
  ];
  const oldest = sortPlaylistTracksByPlaylistOrder(tracks, "oldest").map((t) => t.id);
  const newest = sortPlaylistTracksByPlaylistOrder(tracks, "newest").map((t) => t.id);
  assert.deepEqual(oldest, ["a", "b", "c"]);
  assert.deepEqual(newest, [...oldest].reverse());
});
