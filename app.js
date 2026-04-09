const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 80;

const db = new sqlite3.Database("./visitors.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT,
    user_agent TEXT,
    ts DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  if (req.path === "/dashboard") {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    db.run("INSERT INTO visits (ip, user_agent) VALUES (?, ?)", [ip, ua]);
  }
  next();
});

app.get("/", (req, res) => res.redirect("/dashboard"));

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/api/stats", (req, res) => {
  db.serialize(() => {
    db.get("SELECT COUNT(*) as total FROM visits", (e1, total) => {
      db.get("SELECT COUNT(*) as today FROM visits WHERE DATE(ts)=DATE('now')", (e2, today) => {
        db.all("SELECT * FROM visits ORDER BY ts DESC LIMIT 10", (e3, last) => {
          res.json({
            total: total.total,
            today: today.today,
            last: last
          });
        });
      });
    });
  });
});

app.listen(port, () => console.log("Running"));
