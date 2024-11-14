const express = require("express");
const router = express.Router();

const db = require("../database");

// Get 50 entries for a stopwatch of provided id
router.get("/:id/entries", (req, res) => {
  const sql = `SELECT id, start_time, stop_time, note FROM stopwatches_entries WHERE stopwatch_id = ? AND user_id = ? ORDER BY id DESC LIMIT 50`;
  db.all(sql, [req.params.id, req.session.id], (err, rows) => {
    if (err) {
      console.error(
        `Error getting entries for stopwatch ${req.params.id}:`,
        err,
      );
      return res.status(500).json({
        error: `Error getting entries for stopwatch ${req.params.id}`,
      });
    }
    res.json(rows.length ? rows : []);
  });
});

// Get n entries for a stopwatch of provided id
router.get("/:id/entries/:n", (req, res) => {
  const sql = `SELECT id, start_time, stop_time, note FROM stopwatches_entries WHERE stopwatch_id = ? AND user_id = ? ORDER BY id DESC LIMIT ?`;
  db.all(sql, [req.params.id, req.session.id, req.params.n], (err, rows) => {
    if (err) {
      console.error(
        `Error getting entries for stopwatch ${req.params.id}:`,
        err,
      );
      return res.status(500).json({
        error: `Error getting entries for stopwatch ${req.params.id}`,
      });
    }
    res.json(rows.length ? rows : []);
  });
});

// Add a new stopwatch entry only if its not running
router.post("/:id/entries", async (req, res) => {
  const data = req.body;
  if (!(await stopwatchIsRunning(req.params.id))) {
    const sql = `INSERT INTO stopwatches_entries(stopwatch_id, user_id, start_time) VALUES(?, ?, ?)`;
    const values = [req.params.id, req.session.id, data.start_time];
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
router.put("/:id/entries", async (req, res) => {
  const data = req.body;
  if (await stopwatchIsRunning(req.params.id)) {
    const getEntryID = `SELECT id FROM stopwatches_entries WHERE stopwatch_id = ? AND user_id = ? ORDER BY id DESC LIMIT 1`;
    const valuesForGetEntryID = [req.params.id, req.session.id];
    db.get(getEntryID, valuesForGetEntryID, (err, row) => {
      if (err) {
        console.error(
          `Error getting entry id for stopwatch ${req.params.id}:`,
          err,
        );
        return res.status(500).json({
          error: `Error getting entry id for stopwatch ${req.params.id}`,
        });
      }
      const sql = `UPDATE stopwatches_entries SET stop_time = ? WHERE id = ? AND user_id = ?`;
      const values = [data.stop_time, row.id, req.session.id];
      db.run(sql, values, function (err) {
        if (err) {
          console.error(
            `Error updating entry for stopwatch ${req.params.id}:`,
            err,
          );
          return res.status(500).json({
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
router.delete("/entries/:entry_id", (req, res) => {
  const sql = `DELETE FROM stopwatches_entries WHERE id = ? AND user_id = ?`;
  db.run(sql, [req.params.entry_id, req.session.id], function (err) {
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
router.put("/entries/:entry_id/note", (req, res) => {
  const data = req.body;
  const sql = `UPDATE stopwatches_entries SET note = ? WHERE id = ? AND user_id = ?`;
  const values = [data.note, req.params.entry_id, req.session.id];
  db.run(sql, values, function (err) {
    if (err) {
      console.error(
        `Error updating note for entry ${req.params.entry_id}:`,
        err,
      );
      return res.status(500).json({
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

async function stopwatchIsRunning(stopwatch_id) {
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
}

module.exports = router;
