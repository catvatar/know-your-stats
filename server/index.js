// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/stopwatches.db',sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the stopwatches database.');
});

async function create_tables(){
  await db.run(`CREATE TABLE IF NOT EXISTS stopwatches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT
  )`);
  await db.run(`CREATE TABLE IF NOT EXISTS stopwatches_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stopwatch_id INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT
  )`);
}
create_table();

app.post("/api/stopwatch", (req, res) => {
  console.log(req.body);
  let sql = `INSERT INTO stopwatches(name,start_time) VALUES(?,?)`;
  let values = [req.body.uname,req.body.start_time];
  db.run(sql, values, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
  res.json({ message: "Stopwatch added successfully!" });
});

app.get("/api/stopwatch", (req, res) => {
  let sql = `SELECT id name FROM stopwatches`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.get("/api/stopwatch/:id", (req, res) => {
  let sql = `SELECT * FROM stopwatches WHERE id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      throw err;
    }
    res.json(row);
  });
});

app.put("/api/stopwatch/:id", (req, res) => {
  let data = req.body;
  let sql = `UPDATE stopwatches SET end_time = ? WHERE id = ?`;
  let values = [data.end_time, req.params.id];
  db.run(sql, values, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
  });
  res.json({ message: "Stopwatch updated successfully!" });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

