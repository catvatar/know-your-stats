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
    name TEXT NOT NULL
  )`);
  await db.run(`CREATE TABLE IF NOT EXISTS stopwatches_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stopwatch_id INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT
  )`);
}
create_table();

// Get all stopwatches
app.get("/api/stopwatches", (req, res) => {
  let sql = `SELECT * FROM stopwatches`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// Add a new stopwatch
app.post("/api/stopwatches", (req, res) => {
  console.log(req.body);
  let sql = `INSERT INTO stopwatches(name) VALUES(?)`;
  let values = [req.body.name];
  db.run(sql, values, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
  res.json({ message: "Stopwatch added successfully!" });
});

// Rename a stopwatch of provided id
app.put("/api/stopwatches/:id", (req, res) => {
  let data = req.body;
  let sql = `UPDATE stopwatches SET name = ? WHERE id = ?`;
  let values = [data.name, req.params.id];
  db.run(sql, values, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
  });
  res.json({ message: "Stopwatch updated successfully!" });
});

// Delete a stopwatch of provided id and all its entries
app.delete("/api/stopwatches/:id", (req, res) => {
  let sql = `DELETE FROM stopwatches WHERE id = ?`;
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) deleted: ${this.changes}`);
  });
  let sql2 = `DELETE FROM stopwatches_entries WHERE stopwatch_id = ?`;
  db.run(sql2, [req.params.id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) deleted: ${this.changes}`);
  });
  res.json({ message: "Stopwatch deleted successfully!" });
});

// Get all entries for a stopwatch of provided id
app.get("/api/stopwatches/:id/entries", (req, res) => {
  let sql = `SELECT * FROM stopwatches_entries WHERE stopwatch_id = ?`;
  db.all(sql, [req.params.id], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

const stopwatchIsRunning = (stopwatch_id) => {
  let sql = `SELECT * FROM stopwatches_entries WHERE stopwatch_id = ? ORDER BY id DESC LIMIT 1`;
  db.get(sql, [stopwatch_id], (err, row) => {
    if (err) {
      throw err;
    }
    if (row && !row.end_time) {
      return true;
    } else {
      return false;
    }
  });
}

// Add a new stopwatch entry only if its not running
app.post("/api/stopwatches/:id/entries", (req, res) => {
  let data = req.body;
  if (!stopwatchIsRunning(req.params.id)) {
    let sql = `INSERT INTO stopwatches_entries(stopwatch_id, start_time) VALUES(?, ?)`;
    let values = [req.params.id, data.start_time];
    db.run(sql, values, function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
    res.json({ message: "Stopwatch entry added successfully!" });
  } else {
    res.json({ message: "Stopwatch is already running!" });
  }
});


// Update the last stopwatch entry only if its running
app.put("/api/stopwatches/:id/entries", (req, res) => {
  let data = req.body;
  if (stopwatchIsRunning(req.params.id)) {
    let sql = `UPDATE stopwatches_entries SET end_time = ? WHERE stopwatch_id = ? ORDER BY id DESC LIMIT 1`;
    let values = [data.end_time, req.params.id];
    db.run(sql, values, function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);
    });
    res.json({ message: "Stopwatch entry updated successfully!" });
  } else {
    res.json({ message: "Stopwatch is not running!" });
  }
});

// Delete stopwatch entry of provided id
app.delete("/api/stopwatches/:id/entries/:entry_id", (req, res) => {
  let sql = `DELETE FROM stopwatches_entries WHERE id = ?`;
  db.run(sql, [req.params.entry_id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) deleted: ${this.changes}`);
  });
  res.json({ message: "Stopwatch entry deleted successfully!" });
});




app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

