// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

const cors = require("cors");

app.use(cors());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/stopwatches.db", (err) => {
  if (err) {
    console.error(`Error connecting to the stopwatches database:`);
    throw err;
  }
  console.log("Connected to the stopwatches database.");
});

async function create_tables() {
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
}
create_tables();

// Get all stopwatches
app.get("/api/stopwatches", (req, res) => {
  const sql = `SELECT id, name, description FROM stopwatches`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(`Error getting stopwatches:`, err);
      return res.status(500).json({ error: "Error getting stopwatches" });
    }
    res.json(rows.length ? rows : []);
  });
});

// Get a stopwatch of provided id
app.get("/api/stopwatches/:id", (req, res) => {
  const sql = `SELECT id, name, description FROM stopwatches WHERE id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      console.error(`Error getting stopwatches:`, err);
      return res.status(500).json({ error: "Error getting a stopwatch" });
    }
    res.json(row);
  });
});

// Add a new stopwatch
app.post("/api/stopwatches", (req, res) => {
  console.log(req.body.name, req.body.description);
  const sql = `INSERT INTO stopwatches(name, description) VALUES(?, ?)`;
  const values = [req.body.name, req.body.description || ""];
  db.run(sql, values, function (err) {
    if (err) {
      console.error(`Error getting stopwatches:`, err);
      return res.status(500).json({ error: "Error getting stopwatches" });
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    res.json({
      id: this.lastID,
      name: this.name,
      description: this.description,
    });
  });
});

// Rename a stopwatch of provided id
app.put("/api/stopwatches/:id", (req, res) => {
  const data = req.body;
  const sql = `UPDATE stopwatches SET name = ? WHERE id = ?`;
  const values = [data.name, req.params.id];
  db.run(sql, values, function (err) {
    if (err) {
      console.error(`Error updating stopwatch ${req.params.id}:`, err);
      return res.status(500).json({ error: "Error renaming stopwatch" });
    }
    console.log(`Row(s) updated: ${this.changes}`);
    res.json({
      id: this.lastID,
      name: this.name,
      description: this.description,
    });
  });
});

// Delete a stopwatch of provided id and all its entries
app.delete("/api/stopwatches/:id", (req, res) => {
  const sql2 = `DELETE FROM stopwatches_entries WHERE stopwatch_id = ?`;
  db.run(sql2, [req.params.id], function (err) {
    if (err) {
      console.error(
        `Error deleting entries for stopwatch ${req.params.id}:`,
        err,
      );
      return res
        .status(500)
        .json({
          error: `Error deleting entries for stopwatch ${req.params.id}`,
        });
    }
    console.log(`Row(s) deleted: ${this.changes}`);

    const sql = `DELETE FROM stopwatches WHERE id = ?`;
    db.run(sql, [req.params.id], function (err) {
      if (err) {
        console.error(`Error deleting stopwatch ${req.params.id}:`, err);
        return res
          .status(500)
          .json({ error: `Error deleting stopwatch ${req.params.id}` });
      }
      console.log(`Row(s) deleted: ${this.changes}`);
      res.status(200);
    });
  });
});

// Edit description for a stopwatch of provided id
app.put("/api/stopwatches/:id/description", (req, res) => {
  const data = req.body;
  const sql = `UPDATE stopwatches SET description = ? WHERE id = ?`;
  const values = [data.description, req.params.id];
  db.run(sql, values, function (err) {
    if (err) {
      console.error(
        `Error updating description for stopwatch ${req.params.id}:`,
        err,
      );
      return res
        .status(500)
        .json({
          error: `Error updating description for stopwatch ${req.params.id}`,
        });
    }
    console.log(`Row(s) updated: ${this.changes}`);
    res.json({
      id: this.lastID,
      name: this.name,
      description: this.description,
    });
  });
});

// Get 50 entries for a stopwatch of provided id
app.get("/api/stopwatches/:id/entries", (req, res) => {
  const sql = `SELECT id, start_time, stop_time, note FROM stopwatches_entries WHERE stopwatch_id = ?  ORDER BY id DESC LIMIT 50`;
  db.all(sql, [req.params.id, req.params.n], (err, rows) => {
    if (err) {
      console.error(
        `Error getting entries for stopwatch ${req.params.id}:`,
        err,
      );
      return res
        .status(500)
        .json({
          error: `Error getting entries for stopwatch ${req.params.id}`,
        });
    }
    res.json(rows.length ? rows : []);
  });
});

// Get n entries for a stopwatch of provided id
app.get("/api/stopwatches/:id/entries/:n", (req, res) => {
  const sql = `SELECT id, start_time, stop_time, note FROM stopwatches_entries WHERE stopwatch_id = ?  ORDER BY id DESC LIMIT ?`;
  db.all(sql, [req.params.id, req.params.n], (err, rows) => {
    if (err) {
      console.error(
        `Error getting entries for stopwatch ${req.params.id}:`,
        err,
      );
      return res
        .status(500)
        .json({
          error: `Error getting entries for stopwatch ${req.params.id}`,
        });
    }
    res.json(rows.length ? rows : []);
  });
});

// Add a new stopwatch entry only if its not running
app.post("/api/stopwatches/:id/entries", async (req, res) => {
  const data = req.body;
  if (!(await stopwatchIsRunning(req.params.id))) {
    const sql = `INSERT INTO stopwatches_entries(stopwatch_id, start_time) VALUES(?, ?)`;
    const values = [req.params.id, data.start_time];
    db.run(sql, values, function (err) {
      if (err) {
        console.error(
          `Error adding entry for stopwatch ${req.params.id}:`,
          err,
        );
        return res
          .status(500)
          .json({ error: `Error adding entry for stopwatch ${req.params.id}` });
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
    res.json({
      id: this.lastID,
      start_time: this.start_time,
      stop_time: this.stop_time,
      note: this.note,
    });
  } else {
    return res
      .status(500)
      .json({ error: `Stopwatch ${req.params.id} is already running` });
  }
});

// Update the last stopwatch entry only if its running
app.put("/api/stopwatches/:id/entries", async (req, res) => {
  const data = req.body;
  if (await stopwatchIsRunning(req.params.id)) {
    const getEntryID = `SELECT id FROM stopwatches_entries WHERE stopwatch_id = ? ORDER BY id DESC LIMIT 1`;
    const valuesForGetEntryID = [req.params.id];
    db.get(getEntryID, valuesForGetEntryID, (err, row) => {
      if (err) {
        console.error(
          `Error getting entry id for stopwatch ${req.params.id}:`,
          err,
        );
        return res
          .status(500)
          .json({
            error: `Error getting entry id for stopwatch ${req.params.id}`,
          });
      }
      const sql = `UPDATE stopwatches_entries SET stop_time = ? WHERE id = ?`;
      const values = [data.stop_time, row.id];
      db.run(sql, values, function (err) {
        if (err) {
          console.error(
            `Error updating entry for stopwatch ${req.params.id}:`,
            err,
          );
          return res
            .status(500)
            .json({
              error: `Error updating entry for stopwatch ${req.params.id}`,
            });
        }
        console.log(`Row(s) updated: ${this.changes}`);
      });
    });
    res.json({
      id: this.lastID,
      start_time: this.start_time,
      stop_time: this.stop_time,
      note: this.note,
    });
  } else {
    return res
      .status(500)
      .json({ error: `Stopwatch ${req.params.id} is not running` });
  }
});

// Delete stopwatch entry of provided id
app.delete("/api/stopwatches/entries/:entry_id", (req, res) => {
  const sql = `DELETE FROM stopwatches_entries WHERE id = ?`;
  db.run(sql, [req.params.entry_id], function (err) {
    if (err) {
      console.error(`Error deleting entry ${req.params.entry_id}:`, err);
      return res
        .status(500)
        .json({ error: `Error deleting entry ${req.params.entry_id}` });
    }
    console.log(`Row(s) deleted: ${this.changes}`);
  });
});

// Edit note for a stopwatch entry of provided id
app.put("/api/stopwatches/entries/:entry_id/note", (req, res) => {
  const data = req.body;
  const sql = `UPDATE stopwatches_entries SET note = ? WHERE id = ?`;
  const values = [data.note, req.params.entry_id];
  db.run(sql, values, function (err) {
    if (err) {
      console.error(
        `Error updating note for entry ${req.params.entry_id}:`,
        err,
      );
      return res
        .status(500)
        .json({
          error: `Error updating note for entry ${req.params.entry_id}`,
        });
    }
    console.log(`Row(s) updated: ${this.changes}`);
  });
  res.json({
    id: this.lastID,
    start_time: this.start_time,
    stop_time: this.stop_time,
    note: this.note,
  });
});

const stopwatchIsRunning = async (stopwatch_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT stop_time FROM stopwatches_entries WHERE stopwatch_id = ? ORDER BY id DESC LIMIT 1`;
    db.get(sql, [stopwatch_id], (err, row) => {
      if (err) {
        console.error(
          `Error checking if stopwatch ${stopwatch_id} is running:`,
        );
        reject(err);
      }
      if (row && !row.stop_time) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};
