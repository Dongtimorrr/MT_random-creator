// server.js
const express = require('express');
const db = require('./database');
const app = express();

const PORT = 3000;

// 방문자 수 카운트 API
app.get('/visit-count', (req, res) => {
  const ipAddress = req.ip;
  const today = new Date().toISOString().split('T')[0];

  // 오늘 방문자의 IP가 이미 기록되었는지 확인
  db.get(
    'SELECT COUNT(*) as count FROM visitor_counts WHERE ip_address = ? AND visit_date = ?',
    [ipAddress, today],
    (err, row) => {
      if (err) {
        return res.status(500).send('Database error');
      }

      if (row.count === 0) {
        // 기록되지 않았다면 카운트 증가
        db.run(
          'INSERT INTO visitor_counts (ip_address, visit_date) VALUES (?, ?)',
          [ipAddress, today]
        );
      }

      // 총 방문자 수 가져오기
      db.get(
        'SELECT COUNT(*) as total_visitors FROM visitor_counts WHERE visit_date = ?',
        [today],
        (err, row) => {
          if (err) {
            return res.status(500).send('Database error');
          }
          res.json({ totalVisitors: row.total_visitors });
        }
      );
    }
  );
});

// 정적 파일 서빙
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});