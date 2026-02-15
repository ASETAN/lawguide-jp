const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'lawguide.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Laws table
    db.run(`CREATE TABLE IF NOT EXISTS laws (
    id TEXT PRIMARY KEY,
    law_id TEXT UNIQUE,
    title TEXT,
    category TEXT,
    last_updated DATETIME
  )`);

    // Revisions table
    db.run(`CREATE TABLE IF NOT EXISTS revisions (
    id TEXT PRIMARY KEY,
    law_id TEXT,
    revision_date DATETIME,
    promulgation_date DATETIME,
    enforcement_date DATETIME,
    summary TEXT,
    diff_content TEXT,
    status TEXT, -- 'detected', 'analyzed', 'reviewed'
    FOREIGN KEY(law_id) REFERENCES laws(id)
  )`);

    // Impact Analysis table
    db.run(`CREATE TABLE IF NOT EXISTS impact_analysis (
    id TEXT PRIMARY KEY,
    revision_id TEXT,
    affected_departments TEXT, -- JSON string
    risk_level TEXT,
    status TEXT,
    FOREIGN KEY(revision_id) REFERENCES revisions(id)
  )`);

    // Audit Logs
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT,
    action TEXT,
    details TEXT
  )`);

    console.log("Database initialized at " + dbPath);
});

module.exports = db;
