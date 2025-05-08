const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173','http://localhost:3000'],
    credentials: true //cho phep gui cookie qua cac request
}));

module.exports = app