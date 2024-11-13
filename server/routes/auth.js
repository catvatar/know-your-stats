var express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
var db = require("../database");
const { redirect } = require("react-router-dom");
var router = express.Router();

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      function (err, row) {
        if (err) {
          return cb(err);
        }
        if (!row) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }

        crypto.pbkdf2(
          password,
          row.salt,
          310000,
          32,
          "sha256",
          function (err, hashedPassword) {
            if (err) {
              return cb(err);
            }
            if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
              return cb(null, false, {
                message: "Incorrect username or password.",
              });
            }
            return cb(null, row);
          },
        );
      },
    );
  }),
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// router.get("/success", function (req, res) {
//   res.json({ message: "Login successful", user: req.session.user });
// });

router.get("/failure", function (req, res) {
  res.status(401).json({ message: "Login failed" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/api/auth/failure",
  }),
  (req, res) => {
    req.session.user = req.user; // Store user in session
    res.json({ message: "Login successful", user: req.user });
  },
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });
});

module.exports = router;
