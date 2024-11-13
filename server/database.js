const crypto = require("crypto");

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/stopwatches.db", (err) => {
  if (err) {
    console.error(`Error connecting to the stopwatches database:`);
    throw err;
  }
  console.log("Connected to the stopwatches database.");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    hashed_password BLOB,
    salt BLOB,
    name TEXT,
    email TEXT UNIQUE,
    email_verified INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS stopwatches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT (''),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS stopwatches_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stopwatch_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    stop_time TEXT,
    note TEXT NOT NULL DEFAULT (''),
    FOREIGN KEY (stopwatch_id) REFERENCES stopwatches(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  const salt1 = crypto.randomBytes(16);
  db.run(
    "INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)",
    [
      "franek",
      crypto.pbkdf2Sync("good2137job", salt1, 310000, 32, "sha256"),
      salt1,
    ],
  );
  const salt2 = crypto.randomBytes(16);
  db.run(
    "INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)",
    ["zosia", crypto.pbkdf2Sync("go2rus", salt2, 310000, 32, "sha256"), salt2],
  );
});

module.exports = db;
