const express = require('express');
const app = express();
const db = require('./src/config/db'); // <-- bé phải import pool từ db.js vào


app.listen(3000, () => {
  console.log('Server đang chạy ở http://localhost:3000');
});
