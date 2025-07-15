const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

module.exports.setup = (app) => {
  app.use('/api/v1/user', router);

  router.get('/:user_id', userController.getUserById);                    // Lấy user từ session
  router.get('/', userController.getUserByUsername);                   // Lấy chi tiết user theo ID
  router.post('/register', userController.register);                     // Đăng ký
  router.post('/login', userController.login);                           // Đăng nhập
  router.post('/logout', userController.logout);                         // Đăng xuất
  router.put('/edit/profile/:user_id', userController.editProfile);     // Cập nhật thông tin
};
