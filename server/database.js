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
  db.run(`CREATE TABLE IF NOT EXISTS stopwatches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT ('')
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS stopwatches_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stopwatch_id INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    stop_time TEXT,
    note TEXT NOT NULL DEFAULT ('')
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    hashed_password BLOB,
    salt BLOB,
    name TEXT,
    email TEXT UNIQUE,
    email_verified INTEGER
    )`);

  const salt = crypto.randomBytes(16);
  db.run(
    "INSERT OR IGNORE INTO users (username, email, hashed_password, salt) VALUES (?, ?, ?, ?)",
    [
      "franek",
      "email",
      crypto.pbkdf2Sync("letmein", salt, 310000, 32, "sha256"),
      salt,
    ],
  );
});

module.exports = db;
