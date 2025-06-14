const passport = require('passport');
const db = require('../config/db'); // đây là knex instance
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { sendWelcomeEmail } = require('../utils/mailer');


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // Kiểm tra người dùng đã tồn tại chưa
        const users = await db('user').where({ user_email: email });

        if (users.length > 0) {
            return done(null, users[0]);
        } else {
            const newUser = {
                user_name: name,
                user_email: email,
                user_password: null,
                user_mobile: null,
                user_address: null,
                date_created: new Date()
            };

            const [insertedId] = await db('user').insert(newUser); // trả về mảng [id]
            newUser.user_id = insertedId;
            user = newUser
        }
            await sendWelcomeEmail(email, name);

            return done(null, user);

    } catch (err) {
        return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user.user_id); // xác định dữ liệu nào sẽ được vào session
});

passport.deserializeUser(async(user_id,done)=>{  //lấy lại đầy đủ thông tin người dùng từ user_id trong session, gán vào req.user cho các request tiếp theo
    try{
        const user = await db('user').where({user_id:user_id}).first();
        if(user.length===0) return done(null,false);
        return done(null,user); //gán lại user object vào req.user
    }catch(err){
        return done(err);
    }
})