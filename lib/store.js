const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const defaultFilePath = path.join(__dirname, "..", "data", "app.db");

function resolvePath() {
  if (process.env.SQLITE_PATH) return process.env.SQLITE_PATH;
  if (process.env.NODE_ENV === "test") return ":memory:";
  return defaultFilePath;
}

let db;

function getDb() {
  if (db) return db;
  const loc = resolvePath();
  if (loc !== ":memory:") {
    const dir = path.dirname(loc);
    if (dir && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  db = new Database(loc);
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_snapshot (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      payload TEXT NOT NULL
    );
  `);
  return db;
}

function load() {
  const database = getDb();
  const row = database.prepare("SELECT payload FROM app_snapshot WHERE id = 1").get();
  if (!row) return null;
  try {
    const data = JSON.parse(row.payload);
    return {
      queueState: data.queueState,
      sessions: data.sessions
    };
  } catch {
    return null;
  }
}

function save(state) {
  const database = getDb();
  const payload = JSON.stringify({
    queueState: state.queueState,
    sessions: state.sessions
  });
  database
    .prepare(
      `INSERT INTO app_snapshot (id, payload) VALUES (1, ?)
       ON CONFLICT(id) DO UPDATE SET payload = excluded.payload`
    )
    .run(payload);
}

function clear() {
  const database = getDb();
  database.prepare("DELETE FROM app_snapshot WHERE id = 1").run();
}

/** Test helper: close DB so a fresh :memory: instance can be created in same process if needed. */
function closeForTests() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { load, save, clear, getDb, closeForTests, resolvePath };
