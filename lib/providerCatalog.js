/**
 * Mock catalog and capability flags for the MVP and tests.
 * Real search/queue with live APIs can be wired through adapters later.
 */
module.exports = {
  spotify: {
    capabilities: {
      search: true,
      libraryAccess: true,
      playlistBrowse: true,
      playbackControl: true,
      trackEndEvents: false,
      pauseResume: true
    },
    tracks: [
      {
        id: "sp-1",
        title: "Neon Skyline",
        artist: "Astra",
        durationSec: 210,
        imageUrl: "https://placehold.co/40x40/282828/1db954?text=1"
      },
      {
        id: "sp-2",
        title: "Midnight Drive",
        artist: "Pulse Engine",
        durationSec: 195,
        imageUrl: "https://placehold.co/40x40/282828/1db954?text=2"
      },
      {
        id: "sp-3",
        title: "Echo Chamber",
        artist: "Nova Lines",
        durationSec: 240,
        imageUrl: "https://placehold.co/40x40/282828/1db954?text=3"
      }
    ]
  },
  soundcloud: {
    capabilities: {
      search: true,
      libraryAccess: true,
      playlistBrowse: true,
      playbackControl: true,
      trackEndEvents: true,
      pauseResume: true
    },
    tracks: [
      {
        id: "sc-1",
        title: "Ocean Tape",
        artist: "Kite Theory",
        durationSec: 205,
        permalinkUrl: "https://soundcloud.com/forss/flickermood",
        imageUrl: "https://placehold.co/40x40/282828/ff5500?text=SC"
      },
      {
        id: "sc-2",
        title: "City Static",
        artist: "Wave Cartel",
        durationSec: 188,
        permalinkUrl: "https://soundcloud.com/forss/flickermood"
      },
      {
        id: "sc-3",
        title: "Afterglow Mix",
        artist: "Low Orbit",
        durationSec: 222,
        permalinkUrl: "https://soundcloud.com/forss/flickermood"
      }
    ]
  }
};
