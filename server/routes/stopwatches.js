const express = require("express");

const router = express.Router();

const db = require("../database");

// Get all stopwatches
router.get("/", (req, res) => {
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
router.get("/:id", (req, res) => {
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
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  const sql2 = `DELETE FROM stopwatches_entries WHERE stopwatch_id = ?`;
  db.run(sql2, [req.params.id], function (err) {
    if (err) {
      console.error(
        `Error deleting entries for stopwatch ${req.params.id}:`,
        err,
      );
      return res.status(500).json({
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
router.put("/:id/description", (req, res) => {
  const data = req.body;
  const sql = `UPDATE stopwatches SET description = ? WHERE id = ?`;
  const values = [data.description, req.params.id];
  db.run(sql, values, function (err) {
    if (err) {
      console.error(
        `Error updating description for stopwatch ${req.params.id}:`,
        err,
      );
      return res.status(500).json({
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

module.exports = router;
