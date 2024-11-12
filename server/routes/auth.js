const express = require("express");
const router = express.Router();

const passport = require("passport");
const LocalStrategy = require("passport-local");

const crypto = require("crypto");

const { connectToDatabase } = require("../database");
const db = connectToDatabase();

passport.use(
  new LocalStrategy((email, password, cb) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const values = [email];
    db.get(sql, values, (err, row) => {
      if (err) {
        return cb(err);
      }
      if (!row) {
        return cb(null, false, {
          message: "Incorrect email or password.",
        });
      }

      crypto.pbkdf2(
        password,
        row.salt,
        310000,
        32,
        "sha256",
        (err, hashedPassword) => {
          if (err) {
            return cb(err);
          }
          if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
            return cb(null, false, {
              message: "Incorrect email or password.",
            });
          }
          return cb(null, row);
        },
      );
    });
  }),
);

router.post("/login", (req, res) => {
  passport.authenticate(
    "local",
    {
      successMessage: "Logged in!",
      failureMessage: "Invalid email or password.",
    },
    (err, user, info, status) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return res.json({ user, info, status });
    },
  )(req, res);
  console.log("login");
});

module.exports = router;
