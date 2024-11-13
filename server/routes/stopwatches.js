const express = require("express");

const router = express.Router();

const db = require("../database");

router.use((req, res, next) => {
  if (!req.session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  db.get(`SELECT * FROM users WHERE id = ?`, [req.session.id], (err, row) => {
    if (err) {
      console.error(`Error getting user:`, err);
      return res.status(500).json({ error: "Error getting user" });
    }
    if (!row) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const inMemoryBuffer = Buffer.from(req.session.hashed_password, "utf-8");
    const dbBuffer = Buffer.from(row.hashed_password);

    console.log(inMemoryBuffer);
    console.log(dbBuffer);
    if (Buffer.compare(inMemoryBuffer, dbBuffer) !== 0) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  });
});

// Get all stopwatches for the logged-in user
router.get("/", (req, res) => {
  const sql = `SELECT id, name, description FROM stopwatches WHERE user_id = ?`;
  db.all(sql, [req.session.id], (err, rows) => {
    if (err) {
      console.error(`Error getting stopwatches:`, err);
      return res.status(500).json({ error: "Error getting stopwatches" });
    }
    res.json(rows.length ? rows : []);
  });
});

// Get a stopwatch of provided id for the logged-in user
router.get("/:id", (req, res) => {
  const sql = `SELECT id, name, description FROM stopwatches WHERE id = ? AND user_id = ?`;
  db.get(sql, [req.params.id, req.session.user.id], (err, row) => {
    if (err) {
      console.error(`Error getting stopwatches:`, err);
      return res.status(500).json({ error: "Error getting a stopwatch" });
    }
    res.json(row);
  });
});

// Add a new stopwatch for the logged-in user
router.post("/", (req, res) => {
  const sql = `INSERT INTO stopwatches(user_id, name, description) VALUES(?, ?, ?)`;
  const values = [
    req.session.user.id,
    req.body.name,
    req.body.description || "",
  ];
  db.run(sql, values, function (err) {
    if (err) {
      console.error(`Error adding stopwatch:`, err);
      return res.status(500).json({ error: "Error adding stopwatch" });
    }
    res.json({
      id: this.lastID,
      name: req.body.name,
      description: req.body.description,
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
