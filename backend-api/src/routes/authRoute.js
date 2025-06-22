const express = require ('express');
const passport = require('passport');
const router = express.Router();

module.exports.setup = (app)=>{
    app.use('/auth',router)
    router.get('/google',
    passport.authenticate('google',{scope:['profile','email']})
);

// Xử lí callback từ google
router.get('/google/callback',
    passport.authenticate('google',{
        session: true,
        failureRedirect: '/login'
    }),
    (req,res)=>{
        req.session.user = req.user;
        res.redirect('http://localhost:5173/userpage');
    }
);

router.get('/logout',(req,res)=>{
    req.logout(()=>{
        res.redirect('/');
    })
});
// Kiểm tra trạng thái login bằng google
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

}

