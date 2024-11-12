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

const { connectToDatabase, create_tables } = require("./database");

const db = connectToDatabase();
create_tables(db);

const stopwatches = require("./routes/stopwatches");
app.use("/api/stopwatches", stopwatches);

const stopwatches_entries = require("./routes/stopwatches_entries");
app.use("/api/stopwatches", stopwatches_entries);

const auth = require("./routes/auth");
app.use("/api/auth", auth);
