function connectToDatabase() {
  const sqlite3 = require("sqlite3").verbose();

  const db = new sqlite3.Database("./db/stopwatches.db", (err) => {
    if (err) {
      console.error(`Error connecting to the stopwatches database:`);
      throw err;
    }
    console.log("Connected to the stopwatches database.");
  });
  return db;
}

async function create_tables(db) {
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )`);
}

module.exports = { connectToDatabase, create_tables };
