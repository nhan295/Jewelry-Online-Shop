<template>
    <div>
        <div class="page-background"></div>
          <div class="wrapper">
          <div class="container">
              <h2>TÀI KHOẢN CỦA TÔI</h2>
              <p>Đăng nhập ngay để nhận các ưu đãi độc quyền từ tiệm Xies Xies</p>
              
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
          
              <form v-if="isLogin" @submit.prevent="handleLogin" >
                  <div class="form active">
                      <input type="text" placeholder="Username" v-model="loginForm.username" required>
                  </div>

                  <div class="form active">
                        <input type="password" placeholder="Password" v-model="loginForm.password" required>
                  </div>
                  
                  <span class="message-resgister">{{message}}</span>
              
              <button type="submit" class="submit-btn">Login</button>
              </form>
          
          <!-- Register form -->
              <form v-else  @submit.prevent="handleRegister">
                  <div class="form active">
                      <input type="text" placeholder="Username" v-model="registerForm.username" required>
                  </div>

                  <div class="form active">
                      <input type="email" placeholder="Email" v-model="registerForm.email" required>
                  </div>

                  <div class="form active">
                      <input type="text" placeholder="Address" v-model="registerForm.address" required>
                  </div>

                  <div class="form active">
                      <input type="password" placeholder="Password" v-model="registerForm.password" required>
                  </div>

                  <div class="form active">
                      <input type="password" placeholder="Confirm Password" v-model="registerForm.confirmPass" required>
                  </div>

                  <div class="form active">
                      <input id="date" type="hidden" placeholder="" v-model="registerForm.date">
                  </div>

              <span class="message-resgister">{{message}}</span>
              <button type="submit" class="submit-btn">ĐĂNG KÝ</button>
              </form>
          </div>
        </div>
   </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const message = ref('') // Khai báo message để hiển thị lỗi/thành công

const router = useRouter();
const isLogin = ref(true)

// State form
const loginForm = ref({
  username: '',
  password: '',
})

const registerForm = ref({
  username: '',
  email: '',
  addresss: '',
  password: '',
  confirmPassword: '',
  date: ''
})

const getDate = () =>{
  const now = new Date();
  const year = now.getFullYear();
  const month =String( now.getMonth() +1).padStart(2, '0');
  const day = String (now.getDate()).padStart(2, '0');

  const currentDateTime = `${year}-${month}-${day}`;
  registerForm.value.date = currentDateTime;

}

const handleLogin = async() => {
  console.log('Đăng nhập với:', loginForm.value)

  const {username,password} = loginForm.value
  try{
    const response = await fetch('http://localhost:3000/api/v1/user/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
      body: JSON.stringify({ username,  password})
    })
    const resData = await response.json();
    if(response.ok){
      localStorage.setItem("user", JSON.stringify(resData.message));
      router.push('/userpage')
    }else{
      message.value = resData.message || 'Login failed'
    }
    
  }
  catch (err){
    message.value = 'Lỗi kết nối đến server.'
    console.error(err)
  }
}


const handleRegister = async () => {

  console.log('Đăng ký với:', registerForm.value)

  getDate();
  const { username, email, address, password, confirmPass, date} = registerForm.value
  
  try {
    const response = await fetch('http://localhost:3000/api/v1/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, //du lieu dang json
      credentials: 'include', //gui cookie hoac request theo token
      body: JSON.stringify({ username, email, address, password, confirmPass, date})
    })

    const resData = await response.json()

    if (response.ok) {
      router.push('/userpage')
    } else {
      message.value = resData.message || 'Đăng ký thất bại.'
    }
  } catch (err) {
    message.value = 'Lỗi kết nối đến server.'
    console.error(err)
  }
}

</script>

<style scoped>
.page-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff; /* Nền ngoài cùng màu xanh da trời nhạt */
  z-index: -1;
}
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Chiều cao 100% màn hình */
  position: relative;
}


.container {
  width: 350px;
  border: 1px solid #a4a4a4;
  background-color: #ffffff; /* Nền trắng */
  padding: 30px;
  border-radius: 12px;
  font-family: sans-serif;
  justify-content: center;
}

h2 {
  color: #000000; /* Màu xanh da trời (Steel Blue) cho tiêu đề */
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
.message-resgister {
  color: rgb(228, 52, 52);
  display: block;
  text-align: center;
  margin-bottom: 10px;
  font-size: 14px;
}

</style>