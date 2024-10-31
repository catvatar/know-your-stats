// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;


const app = express();

app.use(express.json());

const cors = require("cors")

app.use(cors())

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/stopwatches.db', (err) => {
  if (err) {
    console.error(`Error connecting to the stopwatches database:`);
    throw err;
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
create_tables();

// Get all stopwatches
app.get("/api/stopwatches", (req, res) => {
  const sql = `SELECT * FROM stopwatches`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(`Error getting stopwatches:`);
      throw err;
    }  
    res.json(rows);
  });  
});  

// Add a new stopwatch
app.post("/api/stopwatches", (req, res) => {
  console.log(req.body);
  const sql = `INSERT INTO stopwatches(name) VALUES(?)`;
  const values = [req.body.name];
  db.run(sql, values, function(err) {
    if (err) {
      console.error(`Error adding stopwatch ${req.body.name}:`);
      throw err.message;
    }  
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });  
  res.json({ message: "Stopwatch added successfully!", id: this.lastID });
});  

// Rename a stopwatch of provided id
app.put("/api/stopwatches/:id", (req, res) => {
  const data = req.body;
  const sql = `UPDATE stopwatches SET name = ? WHERE id = ?`;
  const values = [data.name, req.params.id];
  db.run(sql, values, function(err) {
    if (err) {
      console.error(`Error updating stopwatch ${req.params.id}:`);
      throw err.message;
    }  
    console.log(`Row(s) updated: ${this.changes}`);
  }); 
  res.json({ message: "Stopwatch updated successfully!" });
});  

// Delete a stopwatch of provided id and all its entries
app.delete("/api/stopwatches/:id", (req, res) => {
  const sql = `DELETE FROM stopwatches WHERE id = ?`;
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      console.error(`Error deleting stopwatch ${req.params.id}:`);
      throw err.message;
    }  
    console.log(`Row(s) deleted: ${this.changes}`);
  });  
  const sql2 = `DELETE FROM stopwatches_entries WHERE stopwatch_id = ?`;
  db.run(sql2, [req.params.id], function(err) {
    if (err) {
      console.error(`Error deleting entries for stopwatch ${req.params.id}:`);
      throw err.message;
    }  
    console.log(`Row(s) deleted: ${this.changes}`);
  });  
  res.json({ message: "Stopwatch deleted successfully!" });
});  

// Get all entries for a stopwatch of provided id
app.get("/api/stopwatches/:id/entries", (req, res) => {
  const sql = `SELECT * FROM stopwatches_entries WHERE stopwatch_id = ?`;
  db.all(sql, [req.params.id], (err, rows) => {
    if (err) {
      console.error(`Error getting entries for stopwatch ${req.params.id}:`);
      throw err;
    }  
    res.json(rows);
  });  
});  


// Add a new stopwatch entry only if its not running
app.post("/api/stopwatches/:id/entries", async (req, res) => {
  const data = req.body;
  if (!await stopwatchIsRunning(req.params.id)) {
    const sql = `INSERT INTO stopwatches_entries(stopwatch_id, start_time) VALUES(?, ?)`;
    const values = [req.params.id, data.start_time];
    db.run(sql, values, function(err) {
      if (err) {
        console.error(`Error adding entry for stopwatch ${req.params.id}:`);
        throw err.message;
      }  
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });  
    res.json({ message: "Stopwatch entry added successfully!" });
  } else {
    res.json({ message: "Stopwatch is already running!" });
  }  
});  


// Update the last stopwatch entry only if its running
app.put("/api/stopwatches/:id/entries", async (req, res) => {
  const data = req.body;
  if (await stopwatchIsRunning(req.params.id)) {
    const getEntryID = `SELECT * FROM stopwatches_entries WHERE stopwatch_id = ? ORDER BY id DESC LIMIT 1`;
    const valuesForGetEntryID = [req.params.id];
    db.get(getEntryID, valuesForGetEntryID, (err, row) => {
      if (err) {
        console.error(`Error getting entry id for stopwatch ${req.params.id}:`);
        throw err;
      }  
      const sql = `UPDATE stopwatches_entries SET end_time = ? WHERE id = ?`;
      const values = [data.end_time, row.id];
      db.run(sql, values, function(err) {
        if (err) {
          console.error(`Error updating entry for stopwatch ${req.params.id}:`);
          throw err.message;
        }  
        console.log(`Row(s) updated: ${this.changes}`);
      });  
    });
    res.json({ message: "Stopwatch entry updated successfully!" });
  } else {
    res.json({ message: "Stopwatch is not running!" });
  }
});  

// Delete stopwatch entry of provided id
app.delete("/api/stopwatches/entries/:entry_id", (req, res) => {
  const sql = `DELETE FROM stopwatches_entries WHERE id = ?`;
  db.run(sql, [req.params.entry_id], function(err) {
    if (err) {
      console.error(`Error deleting entry ${req.params.entry_id}:`);
      throw err.message;
    }  
    console.log(`Row(s) deleted: ${this.changes}`);
  });  
  res.json({ message: "Stopwatch entry deleted successfully!" });
});  

const stopwatchIsRunning = async (stopwatch_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM stopwatches_entries WHERE stopwatch_id = ? ORDER BY id DESC LIMIT 1`;
    db.get(sql, [stopwatch_id], (err, row) => {
      if (err) {
        console.error(`Error checking if stopwatch ${stopwatch_id} is running:`);
        reject(err);
      }  
      if (row && !row.end_time) {
        resolve(true);
      } else {
        resolve(false);
      }  
    });
  });
}