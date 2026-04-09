const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 80;

// Database setup
const db = new sqlite3.Database("./visitors.db");
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY AUTOINCREMENT, ts DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

// Middleware
app.use(express.static(path.join(__dirname, "public")));

// Increment visitor count
app.use((req, res, next) => {
  if (req.path === "/dashboard") {
    db.run("INSERT INTO visits DEFAULT VALUES");
  }
  next();
});

// Routes
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
  db.get("SELECT COUNT(*) AS count FROM visits", (err, row) => {
    if (err) return res.status(500).send("DB error");
    res.sendFile(path.join(__dirname, "views", "dashboard.html"));
  });
});

// API for visitor count
app.get("/api/visitors", (req, res) => {
  db.get("SELECT COUNT(*) AS count FROM visits", (err, row) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json({ visitors: row.count });
  });
});

app.listen(port, () => console.log(`App running on port ${port}`));
