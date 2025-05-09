<template>
    <div>
        <div class="page-background"></div>
        <div class="container">
            <h2>TÀI KHOẢN CỦA TÔI</h2>
            <p>Đăng nhập ngay để nhận các ưu đãi độc quyền từ tiệm hột xoàn</p>
            
            <!-- Navigate form -->
            <div class="tabs">
                <button
                :class="{ active: isLogin }"
                @click="isLogin = true"
                >ĐĂNG NHẬP</button>
                
                <button
                :class="{ active: !isLogin }"
                @click="isLogin = false"
                >ĐĂNG KÝ</button>
            </div>
        <!-- Login form -->
         
            <form v-if="isLogin" action="#" id="login-form" >
                <div class="form active">
                    <input type="text" placeholder="Username" name="username" required>
                </div>

                <div class="form active">
                      <input type="password" placeholder="Password" name="password" required>
                </div>
            
            <button type="submit" class="submit-btn">Login</button>
            </form>
        
        <!-- Register form -->
            <form v-else  action="#" id="register-form">
                <div class="form active">
                    <input type="text" placeholder="Username" v-model="registerForm.name" required>
                </div>

                <div class="form active">
                    <input type="email" placeholder="Email" v-model="registerForm.email" required>
                </div>

                <div class="form active">
                    <input type="text" placeholder="Address" v-model="registerForm.password" required>
                </div>

                <div class="form active">
                    <input type="password" placeholder="Password" v-model="registerForm.password" required>
                </div>
        
            <button type="submit" class="submit-btn">ĐĂNG KÝ</button>
            </form>
        </div>
   </div>
</template>

<script setup>
import { ref } from 'vue'

const isLogin = ref(true)

const loginForm = ref({
  email: '',
  password: '',
})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const handleLogin = () => {
  console.log('Đăng nhập với:', loginForm.value)
  // Gửi request login ở đây...
}

const handleRegister = () => {
  console.log('Đăng ký với:', registerForm.value)
  // Gửi request signup ở đây...
}
</script>

<style scoped>
.page-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f5f9; /* Nền ngoài cùng màu xanh da trời nhạt */
  z-index: -1;
}

.container {
  width: 350px;
  border: 1px solid #d0e6f0;
  background-color: #ffffff; /* Nền trắng */
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Bóng nhẹ */
  margin-top: 50px;
  font-family: sans-serif;
}

h2 {
  color: #4682B4; /* Màu xanh da trời (Steel Blue) cho tiêu đề */
  text-align: center;
  margin-bottom: 10px;
}

p {
  text-align: center;
  color: #888;
  margin-bottom: 20px;
  font-size: 14px;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.tabs button {
  background: none;
  border: none;
  font-weight: bold;
  padding: 10px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: #555;
  transition: all 0.2s;
}

.tabs button.active {
  border-color: #4682B4; /* Màu xanh da trời (Steel Blue) */
  color: #4682B4;
}

.form {
  display: block;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 6px;
  border: 1px solid #c0d8e8;
  background-color: #f6fafd; /* Màu xanh da trời rất nhạt cho input */
  box-sizing: border-box;
  color: #000000; /* Màu chữ đen cho input */
}

input:focus {
  border-color: #4682B4;
  outline: none;
  background-color: #fff;
}

button.submit-btn {
  background-color: #4682B4; /* Màu xanh da trời (Steel Blue) */
  color: white;
  padding: 10px;
  border: none;
  width: 100%;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.3s;
  margin-top: 10px;
  font-weight: bold;
}

button.submit-btn:hover {
  background-color: #3B6D97; /* Màu xanh da trời đậm hơn khi hover */
}
</style>