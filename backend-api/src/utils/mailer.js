const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendWelcomeEmail = async (toEmail, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: toEmail,
    subject: 'Đăng nhập thành công',
    html: `<h3>Xin chào ${name},</h3><p>Bạn vừa đăng nhập vào Xies Xies bằng Google.</p>`
  };

  await transporter.sendMail(mailOptions);
  

};

module.exports = { sendWelcomeEmail };
