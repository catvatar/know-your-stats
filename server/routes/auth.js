var express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
var db = require("../database");
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
    req.session.user = { id: req.user.id, username: req.user.username }; // Ensure user ID is set in session
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

let dailyCode;

function generateDailyCode() {
  dailyCode = crypto.randomBytes(8).toString('hex'); // 16 characters long
  console.log(`Daily code: ${dailyCode}`);
}

// Generate and log the code once a day
setInterval(generateDailyCode, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
generateDailyCode(); // Initial call to generate the code immediately

router.post("/register", function (req, res, next) {
  if (req.body.dailyCode !== dailyCode) {
    return res.status(403).json({ message: "Invalid daily code" });
  }

  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, "sha256", function (err, hashedPassword) {
    if (err) {
      return next(err);
    }
    db.run(
      "INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)",
      [req.body.username, hashedPassword, salt],
      function (err) {
        if (err) {
          return next(err);
        }
        res.json({ message: "User created successfully" });
      }
    );
  });
});

module.exports = router;
