<template>
  <div>
    <div class="user_top">
      <div class="show_hello">
        <h1 class="hello">HELLO</h1>
      </div>

      <div class="show_name">
        <h1>{{ userName }}</h1>
      </div>
    </div>

    <div class="user_bottom">
        <div class="account-info">
          <div class="header">
            <i class="fas fa-user-edit icon-bounce"></i>
            <strong>THÔNG TIN TÀI KHOẢN</strong>
            <a class="view-all" href="#">Chỉnh sửa</a>
          </div>
          <hr class="divider">
          <div class="account-grid">
            <div class="account-item">
              <strong>Username</strong>
              <p>{{ userName }}</p>
            </div>

            <div class="account-item">
              <strong>Date Created</strong>
              <p>{{ userCreated }}</p>
            </div>

            <div class="account-item">
              <strong>Email</strong>
              <p>{{ userEmail }}</p>
            </div>

            <div class="account-item">
              <strong>Mobile</strong>
              <p>{{ userMobile }}</p>
            </div>

            <div class="account-item">
              <strong>Address</strong>
              <p>{{ userAddress }}</p>
            </div>
          </div>
        </div>
      

      
      <div class="address-box">
        <div class="header">
          <i class="fa fa-truck icon-pulse"></i>
          <strong>DANH SÁCH ĐỊA CHỈ</strong>
          <a class="view-all" href="#">Xem tất cả</a>
        </div>

        <hr class="divider" />

        <!-- Danh sách địa chỉ -->
        <div class="address-item">
          <div>
            <strong>{{ userName }} - {{ userMobile }}</strong>
            <div>, Vietnam</div>
            <div class="label">Nhà riêng</div>
          </div>
          <span class="default-tag">Mặc định</span>
          <button class="edit-btn">
            <i class="fa fa-pen"></i>
          </button>
        </div>

        <!-- Thêm địa chỉ mới -->
        <div class="add-new" @click="addNew">
          <i class="fa fa-plus"></i>
          <span>Thêm địa chỉ mới</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const message = ref("");

const userName = ref(null);
const userEmail = ref(null);
const userAddress = ref(null);
const userMobile = ref(null);
const userCreated = ref(null);

const getUserData = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/user/", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      userName.value = data.user.user_name;
      userEmail.value = data.user.user_email;
      userAddress.value = data.user.user_address;
      userMobile.value = data.user.user_mobile;
      userCreated.value = data.user.date_created;
    }
  } catch (err) {
    message.value = "Failed to receiving user data";
    console.error(err);
  }
};

const addNew = () => {
  // Add your logic here
  console.log("Add new address");
};

onMounted(() => {
  getUserData();
});
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

/* Global smooth transitions */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

strong {
  font-size: 20px;
  font-family: Arial, sans-serif;
}

.user_bottom {
  display: flex;
  animation: slideUp 0.8s ease-out;
}

/* Header animations */
.show_hello {
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: 20px; 
  color: aliceblue;
  padding-top: 50px;
  padding-left: 48px;
  animation: fadeInLeft 1s ease-out;
}

.show_name {
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: 20px;
  color: aliceblue;
  padding-left: 48px;
  animation: fadeInLeft 1.2s ease-out;
}

.hello {
  animation: glow 2s ease-in-out infinite alternate;
}

.user_top {
  height: 260px;
  margin-top: 3px;
  font-size: 25px;
  font-weight: bold;
  background: linear-gradient(135deg, rgb(151, 151, 151), rgb(120, 120, 120));
  position: relative;
  overflow: hidden;
}

.user_top::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
}

/* Account info section */
.account-info {
  width: 35%;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #c6c6c6;
  background-color: white;
  margin-top: 5%;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  animation: slideInLeft 0.8s ease-out;
}

.account-info:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.account-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
  font-size: 14px;
  color: rgb(0, 0, 0);
}

.account-item {
  padding: 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.account-item:hover {
  border-left-color: #007acc;
  transform: translateX(8px);
  background: linear-gradient(135deg, #fff, #f1f3f4);
  box-shadow: 0 4px 12px rgba(0,122,204,0.15);
}

.account-grid strong {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
  color: #616161;
}

/* Address section */
.address-box {
  border: 1px solid #ccc;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  font-family: Arial, sans-serif;
  margin-top: 5%;
  margin-right: 10%;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  animation: slideInRight 0.8s ease-out;
}

.address-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  margin-bottom: 16px;
}

.view-all {
  margin-left: auto;
  font-weight: bold;
  color: black;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  transition: all 0.3s ease;
}

.view-all:hover {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  transform: scale(1.05);
  text-decoration: none;
}

.address-item {
  border: 1px solid #ddd;
  padding: 12px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  border-radius: 8px;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  transition: all 0.3s ease;
}

.address-item:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  border-color: #007acc;
}

.default-tag {
  background: linear-gradient(135deg, #d9f2ff, #b3e5fc);
  color: #007acc;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 20px;
  position: absolute;
  top: 12px;
  right: 50px;
  animation: pulse 2s infinite;
}

.label {
  color: #d94f4f;
  font-weight: bold;
  margin-top: 4px;
}

.edit-btn {
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  transform: rotate(180deg) scale(1.1);
}

.add-new {
  border: 2px dashed #aaa;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  color: #000;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  transition: all 0.3s ease;
}

.add-new:hover {
  border-color: #007acc;
  background: linear-gradient(135deg, #e3f2fd, #f8f9fa);
  transform: scale(1.02);
  color: #007acc;
}

.add-new i {
  margin-right: 8px;
  transition: transform 0.3s ease;
}

.add-new:hover i {
  transform: rotate(90deg);
}

.divider {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, #007acc, transparent);
  margin: 16px 0;
  animation: glow 2s ease-in-out infinite alternate;
}

p {
  font-size: 16px;
  font-family: sans-serif;
  font-weight: 700;
}

/* Icon animations */
.icon-bounce {
  animation: bounce 2s infinite;
}

.icon-pulse {
  animation: iconPulse 2s infinite;
}

/* Keyframe animations */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes glow {
  from {
    text-shadow: 0 0 5px rgba(255,255,255,0.5);
  }
  to {
    text-shadow: 0 0 20px rgba(255,255,255,0.8);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes iconPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .user_bottom {
    flex-direction: column;
  }
  
  .account-info {
    width: 90%;
  }
  
  .address-box {
    margin-right: 0;
    margin-top: 20px;
  }
}
</style>