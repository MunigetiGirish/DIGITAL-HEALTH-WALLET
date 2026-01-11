const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

db.serialize(() => {
  // Users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  // Reports
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER,
      report_type TEXT,
      report_date TEXT,
      vitals TEXT,
      file_path TEXT
    )
  `);

  // Vitals over time
  db.run(`
    CREATE TABLE IF NOT EXISTS vitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      vital_type TEXT,
      value TEXT,
      recorded_at TEXT
    )
  `);

  // Shared reports (relation-based access)
  db.run(`
    CREATE TABLE IF NOT EXISTS shared_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id INTEGER,
      owner_id INTEGER,
      shared_with_email TEXT,
      relation TEXT
    )
  `);
});

module.exports = db;
