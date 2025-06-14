<template>
  <div class="pandora-page">
    <!-- Header Pandora -->
    <div class="header">
      <div class="header-top">
        <div class="logo-hot">
          <router-link to="/userpage" class="logo">XIES XIES</router-link>
        </div>
        <div class="header-icons">
          <div class="search-container">
            <form @submit.prevent="emitSearch">
              <input
                class="search-box"
                type="text"
                placeholder="Bạn cần tìm gì?"
                v-model="jewelry_name"
              />
              <button class="search-button" type="submit">
                <i class="fas fa-search"></i>
              </button>
            </form>
          </div>
          <div class="icons">
            <!-- User Dropdown -->
            <div class="user-menu">
              <div class="user-menu-wrapper">
                <div class="user-icon">
                  <i class="fas fa-user"></i>
                </div>
                <div class="user-dropdown">
                  <router-link to="/profile">Thông tin tài khoản</router-link>
                  <router-link to="#">Lịch sử mua hàng</router-link>
                  <a href="#" @click="logout()">Đăng xuất</a>
                </div>
              </div>
            </div>
            <!-- Cart -->
            <div class="cart-icon" @click="handleCartClick">
              <i class="fas fa-shopping-bag"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="header-bottom">
        <div class="nav">
          <a href="" @click.prevent="selectCategory('vong')" :class="{ active: activeCategory === 'vong' }">
            VÒNG TAY
            <i :class="['fas', 'chevron-icon', activeCategory === 'vong' ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
          </a>

          <a href="" @click.prevent="selectCategory('daychuyen')" :class="{ active: activeCategory === 'daychuyen' }">
            NHẪN
            <i :class="['fas', 'chevron-icon', activeCategory === 'daychuyen' ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref,onMounted} from 'vue';
import { useRouter } from 'vue-router';
const user_id = ref(null);

const router = useRouter();
const jewelry_name = ref('');

const activeCategory = ref(null);
const emit = defineEmits(['select-category','search-input','get-user']);

const selectCategory = (category) => {
  activeCategory.value = activeCategory.value === category ? null: category
  emit('select-category',activeCategory.value)
}

const emitSearch = () =>{
  emit('search-input',jewelry_name.value)
}

const handleCartClick = () =>{
  if(!user_id.value){
    console.log('user_id chưa có')
    return;
  }
  emit('get-user',user_id.value);
  router.push(`/cart/${user_id.value}`)
  console.log('clicked user_id:', user_id.value)
}

const logout = async() =>{
  const response = await fetch("http://localhost:3000/api/v1/user/logout",{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    credentials: 'include'
  })
  if(response.ok){
    localStorage.removeItem('user');
    router.push('/')
  }
}

onMounted(async() => {
  try{
    const response = await fetch("http://localhost:3000/api/v1/user/",{
      method: 'GET',
      credentials: 'include'
    });
    if(response.ok){
      const data = await response.json();
      console.log('User data từ session:', data); 
      user_id.value = data.user.user_id
    }else{
      console.log('Cant not find user in session');
    }
  }catch(err){
    console.error('Error to get user from session',err)
  }

  const storeUser = localStorage.getItem('user');
  if (storeUser) {
    const parsedUser = JSON.parse(storeUser);
    user_id.value = parsedUser.user_id;
  }
});
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

/* Reset và base styles */
* {
  box-sizing: border-box;
}

/* Header container */
.header {
  width: 100%;
  background-color: #ffffff;
  color: #333333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Header top section */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #e9ecef;
}

/* Logo */
.logo-hot {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  text-decoration: none;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;
  position: relative;
}

.logo::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3498db, #2980b9);
  transition: width 0.3s ease;
}

.logo:hover {
  color: #3498db;
  transform: translateY(-1px);
}

.logo:hover::after {
  width: 100%;
}

/* Header icons section */
.header-icons {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* Search container */
.search-container {
  position: relative;
}

.search-container form {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  padding: 4px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.search-container form:focus-within {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  background-color: #ffffff;
}

.search-box {
  border: none;
  outline: none;
  padding: 10px 16px;
  font-size: 14px;
  width: 220px;
  background: transparent;
  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-box::placeholder {
  color: #6c757d;
  font-weight: 400;
}

.search-button {
  background: linear-gradient(135deg, #3498db, #2980b9);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  padding: 10px 12px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.search-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* Icons section */
.icons {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icons i,
.cart-icon i {
  font-size: 18px;
  cursor: pointer;
  color: #495057;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
}

.icons i:hover,
.cart-icon i:hover {
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
  transform: translateY(-2px);
}

/* User menu */
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
}

.user-icon {
  cursor: pointer;
  position: relative;
}

.user-dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  background-color: #ffffff;
  color: #333;
  min-width: 160px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  z-index: 1000;
  display: none;
  flex-direction: column;
  padding: 8px 0;
  border: 1px solid #e9ecef;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.user-menu:hover .user-dropdown {
  display: flex;
  opacity: 1;
  transform: translateY(0);
}

.user-dropdown::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 16px;
  width: 12px;
  height: 12px;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-bottom: none;
  border-right: none;
  transform: rotate(45deg);
}

.user-dropdown a {
  padding: 12px 16px;
  text-decoration: none;
  color: #495057;
  display: block;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.user-dropdown a:hover {
  background-color: #f8f9fa;
  color: #3498db;
  padding-left: 20px;
}

/* Navigation */
.header-bottom {
  background-color: #ffffff;
  border-top: 1px solid #e9ecef;
}

.nav {
  display: flex;
  gap: 32px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 14px;
}

.nav a {
  color: #495057;
  text-decoration: none;
  position: relative;
  padding: 8px 12px;
  transition: all 0.3s ease;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
}

.nav a:hover {
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.05);
  transform: translateY(-1px);
}

.nav a.active {
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
}

.nav a.active::after {
  content: '';
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #2980b9);
  border-radius: 2px;
}

/* Chevron icons */
.chevron-icon {
  font-size: 12px !important;
  transition: all 0.3s ease;
  margin-left: 4px;
}

.nav a.active .chevron-icon {
  transform: rotate(90deg);
}

/* Responsive */
@media (max-width: 768px) {
  .header-top {
    padding: 12px 16px;
    flex-direction: column;
    gap: 16px;
  }
  
  .search-box {
    width: 180px;
  }
  
  .nav {
    padding: 12px 16px;
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .logo {
    font-size: 24px;
  }
}

/* Animation keyframes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  animation: fadeInUp 0.5s ease-out;
}
</style>