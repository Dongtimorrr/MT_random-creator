// database.js
const sqlite3 = require('sqlite3').verbose();

// 데이터베이스 연결
const db = new sqlite3.Database(':memory:');

// 테이블 생성
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS visitor_counts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address TEXT NOT NULL,
      visit_date TEXT NOT NULL
    )
  `);
});

module.exports = db;