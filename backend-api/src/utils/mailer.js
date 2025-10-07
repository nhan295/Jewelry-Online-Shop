const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendWelcomeEmail = async (toEmail, name) => {
  const loginTime = new Date().toLocaleString('vi-VN',{timezone: 'Asia/Ho_Chi_Minh'});
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: toEmail,
    subject: 'Đăng nhập thành công',
    html:
     `<div style="font-family: Arial, sans-serif; padding: 16px; background-color: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #333;">Xin chào ${name},</h2>
        <p style="font-size: 15px; color: #444;">
          Chúng tôi ghi nhận một lần đăng nhập thành công vào tài khoản của bạn bằng <b>Google</b> trên hệ thống <b>Xies Xies</b>.
        </p>
        <p style="font-size: 15px; color: #444;">
          <b>Thời gian đăng nhập:</b> ${loginTime}
        </p>
        <p style="font-size: 15px; color: #444;">
          Nếu không phải bạn thực hiện, vui lòng <a href="mailto:support@xiesxies.com" style="color: #007bff; text-decoration: none;">liên hệ ngay với chúng tôi</a> để được hỗ trợ.
        </p>
        <br/>
        <p style="font-size: 15px; color: #444;">
          Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!
        </p>
        <br/>
        <p style="font-size: 14px; color: #666;">
          Trân trọng,<br/>
          <b>Đội ngũ Xies Xies</b>
        </p>
      </div>`
  };

  await transporter.sendMail(mailOptions);
  

};

module.exports = { sendWelcomeEmail };
