// server/index.js
const PORT = process.env.PORT || 3001;

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var cookieParser = require("cookie-parser");
app.use(cookieParser());

const cors = require("cors");
app.use(cors());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const passport = require("passport");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

app.use(
  session({
    secret: "welcome to the club of done",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./db" }),
  }),
);
app.use(passport.authenticate("session"));

const auth = require("./routes/auth");
app.use("/api/auth", auth);

const stopwatches = require("./routes/stopwatches");
app.use("/api/stopwatches", stopwatches);

const stopwatches_entries = require("./routes/stopwatches_entries");
app.use("/api/stopwatches", stopwatches_entries);
