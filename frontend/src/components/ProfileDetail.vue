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
            <i class="fas fa-user-edit"></i>
            <strong>THÔNG TIN TÀI KHOẢN</strong>
            <a class="view-all" href="#">Chỉnh sửa</a>
          </div>
          <hr>
          <div class="account-grid">
            <div>
              <strong>Username</strong>
              <p>{{ userName }}</p>
            </div>

            <div>
              <strong>Date Created</strong>
              <p>{{ userCreated }}</p>
            </div>

            <div>
              <strong>Email</strong>
              <p>{{ userEmail }}</p>
            </div>

            <div>
              <strong>Mobile</strong>
              <p>{{ userMobile }}</p>
            </div>
          </div>
        </div>
      

      
      <div class="address-box">
        <div class="header">
          <i class="fa fa-truck"></i>
          <strong>DANH SÁCH ĐỊA CHỈ</strong>
          <a class="view-all" href="#">Xem tất cả</a>
        </div>

        <hr />

        <!-- Danh sách địa chỉ -->
        <div class="address-item">
          <div>
            <strong>{{ userName }}- {{ userMobile }}</strong>
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
onMounted(() => {
  getUserData();
});
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
strong{
  font-size: 20px;
  font-family: Arial, sans-serif;
}
.user_bottom{
  display: flex ;
}
.show_hello {
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: 20px; 
  color: aliceblue;
  padding-top: 50px;
  padding-left: 48px;
}
.show_name {
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: 20px;
  color: aliceblue;
  padding-left: 48px;
}
@keyframes scroll-left {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
.user_top {
  height: 260px;
  margin-top: 3px;
  font-size: 25px;
  font-weight: bold;
  background-color: rgb(151, 151, 151);
}

.account-info {
  width: 35%;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #c6c6c6;
  background-color: white;
  margin-top: 5%;
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.account-header {
  font-size: 18px;
  font-family: Georgia, "Times New Roman", Times, serif;
  font-weight: bold;
  color: rgb(0, 0, 0);
  text-transform: uppercase;
  margin-right: 40%;
}

.account-header a {
  font-size: 14px;
  color: rgb(0, 0, 0);
  text-decoration: none;
}

.account-header a:hover {
  text-decoration: underline;
}

.account-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
  font-size: 14px;
  color:rgb(0, 0, 0);
}

.account-grid strong {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
  color: #616161;
}

.address-box {
  border: 1px solid #ccc;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  font-family: Arial, sans-serif;
  margin-top: 5%;
  margin-right: 10%;
}

.header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
}

.view-all {
  margin-left: auto;
  font-weight: bold;
  color: black;
}

.address-item {
  border: 1px solid #ddd;
  padding: 12px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}

.default-tag {
  background-color: #d9f2ff;
  color: #007acc;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  position: absolute;
  top: 12px;
  right: 50px;
}

.label {
  color: #d94f4f;
  font-weight: bold;
  margin-top: 4px;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}

.add-new {
  border: 1px dashed #aaa;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  color: #000;
}

p{
  font-size: 16px;
  font-family: sans-serif;
  font-weight: 700
}
</style>
