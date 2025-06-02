const express = require('express');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
require('./config/passport');

const userRoute = require('./routes/userRoute');
const jewelryRoute = require('./routes/jewelryRoute');
const cartRoute = require('./routes/cartRoute');
const authRoute = require('./routes/authRoute');

const app = express();
const session = require('express-session');
const secretKey = process.env.SESSION_SECRET;

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173','http://localhost:3000'],
    credentials: true //cho phep gui cookie qua cac request
}));
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true, // Ngan chan truy cap JavaScript phia client
        maxAge: 1000 * 60 * 60 * 24, // Cookie ton tai trong 1 ngay
        domain: 'localhost', // Dam bao cookie co the duoc chia se qua cac cong khac nhau tren localhost
        sameSite: 'Lax' // Đảm bảo cookie được chia sẻ giữa các trang khác nhau
    }
}))

app.use(passport.initialize());
app.use(passport.session());

userRoute.setup(app)
jewelryRoute.setup(app)
cartRoute.setup(app)
authRoute.setup(app)

module.exports = app