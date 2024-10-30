import sqlite3 from 'sqlite3'

let db = new sqlite3.Database('./stopwatches.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected successfully.');
});

db.run(`CREATE TABLE IF NOT EXISTS stopwatches(
        id text,
        startTime text, 
        endTime text,
        isRunning integer
)`)