<template>
    <div class="footer-container">
        <div class="logo-footer">
            <router-link to="/userpage" class="logo">XIES XIES</router-link>
        </div>
        
        <div class="col-customer-care">
            <h4>Chăm sóc khách hàng</h4>
            <ul>
                <li><a href="#">Câu hỏi thường gặp</a></li>
                <li><a href="#">Chính sách bảo mật</a></li>
                <li><a href="#">Chính sách thanh toán</a></li>
                <li><a href="#">Chính sách đổi hàng</a></li>
                <li><a href="#">Hướng dẫn bảo dưỡng trang sức</a></li>
                
            </ul>
        </div>

        <div class="col-address">
            <h4>Địa chỉ cửa hàng</h4>   
            <p>Thọ hoà đông A, Xã Phú Tâm</p>
            <p>Huyện Châu Thành, Sóc Trăng</p>
            <p>Giờ mở cửa: 8:00 - 22:00</p>
            <div style="width: 100%; height: 80px; background: #e8e8e8; border-radius: 4px; margin: 12px 0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">
                Bản đồ
            </div>
            <a href="#">Xem bản đồ</a>
        </div>

        <div class="col-contact">
            <h4>Về chúng tôi</h4>
            <p><strong>Điện thoại để được tư vấn trực tiếp</strong></p>
            <p>0375458318</p>
            <p><strong>E-mail:</strong></p>
            <p>xies2@gmail.com</p>
            <div class="social-icons">
                <a href="#" class="social-icon">f</a>
                <a href="#" class="social-icon">@</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.footer-container {
  width: 100%;
  background: #f8f8f8;
  color: #666;
  padding: 60px 0 40px 0;
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

.logo-footer {
    flex: 1;
    padding-right: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 200px;
    padding-right: 5px;
}

.logo {
    font-size: 36px;
    font-weight: 300;
    color: #333;
    text-decoration: none;
    font-family: 'Georgia', serif;
    font-style: italic;
    letter-spacing: 2px;
    margin-bottom: 8px;
}

.logo:hover {
  color: #555;
}

.logo-footer::after {
  content: "Trang sức cao cấp";
  font-size: 15px;
  color: #999;
  font-weight: 400;
  letter-spacing: 1px;
  margin-top: 4px;
}

.col-customer-care, 
.col-address, 
.col-contact {
  flex: 1;
  padding: 0 30px;
}

.col-customer-care h4,
.col-address h4,
.col-contact h4 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.col-address p, 
.col-contact p {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

.col-address a {
  color: #4a90e2;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.col-address a:hover {
  color: #357abd;
  text-decoration: underline;
}

/* Menu items cho cột chăm sóc khách hàng */
.col-customer-care ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.col-customer-care li {
  margin-bottom: 8px;
}

.col-customer-care a {
  color: #666;
  text-decoration: none;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.2s;
  font-size: large;
}

.col-customer-care a:hover {
  color: #333;
}

/* Social icons cho cột contact */
.social-icons {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.social-icon {
  width: 32px;
  height: 32px;
  background: #4a90e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.2s;
}

.social-icon:hover {
  background: #357abd;
}

/* Copyright footer */
.footer-container::after {
  content: "XIES XIES © Bản quyền 2024 - Thiết kế bởi Guide Marketing";
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #999;
  text-align: center;
}

.footer-container {
  position: relative;
  margin-bottom: 50px;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    padding: 40px 20px 20px 20px;
    gap: 32px;
  }
  
  .logo-footer {
    padding-right: 0;
    align-items: center;
    text-align: center;
    margin-right: 0; /* Xoá margin khi mobile */
  }
  
  .col-customer-care, 
  .col-address, 
  .col-contact {
    padding: 0;
    text-align: center;
  }
  
  .social-icons {
    justify-content: center;
  }
}
</style>