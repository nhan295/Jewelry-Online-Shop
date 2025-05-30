const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const jewelryRoute = require('./routes/jewelryRoute');
const cartRoute = require('./routes/cartRoute');

const app = express();
const session = require('express-session');
const crypto = require('crypto')
const secretKey = crypto.randomBytes(64).toString('hex');

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173','http://localhost:3000'],
    credentials: true //cho phep gui cookie qua cac request
}));
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        httpOnly: true, // Ngan chan truy cap JavaScript phia client
        maxAge: 1000 * 60 * 60 * 24, // Cookie ton tai trong 1 ngay
        domain: 'localhost', // Dam bao cookie co the duoc chia se qua cac cong khac nhau tren localhost
        sameSite: 'Lax' // Đảm bảo cookie được chia sẻ giữa các trang khác nhau
    }
}))

userRoute.setup(app)
jewelryRoute.setup(app)
cartRoute.setup(app)

module.exports = app