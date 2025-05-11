<template>
  <div class="pandora-page">
    <!-- Header Pandora -->
    <div class="header">
      <div class="header-top">
        <div class="logo-hot">
          <span class="logo">XIES XIES</span>
        </div>
        <div class="header-icons">
          <div class="search-container">
            <input
              class="search-box"
              type="text"
              placeholder="Bạn cần tìm gì?"
            />
            <button class="search-button">
              <i class="fas fa-search"></i>
            </button>
          </div>
          <div class="icons">
            <!-- User Dropdown -->
            <div class="user-menu">
              <div class="user-menu-wrapper">
                <div class="user-icon">
                  <i class="fas fa-user"></i>
                </div>
                <div class="user-dropdown">
                  <router-link to="../index">Register</router-link>
                  <router-link to="../index">Login</router-link>
                </div>
              </div>
            </div>
            <i class="fas fa-shopping-bag"></i>
          </div>
        </div>
      </div>

      <div class="header-bottom">
        <div class="nav">
          
          <a href="" @click.prevent="selectCategory('vong')">VÒNG TAY
            <i :class="['fas', activeCategory==='vong' ? 'fa-chevron-down': 'fas fa-chevron-up']"></i>
          </a>

          <a href="" @click.prevent="selectCategory('daychuyen')">NHẪN
            <i :class="['fas', activeCategory==='daychuyen' ? 'fa-chevron-down': 'fas fa-chevron-up']"></i>
          </a>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const activeCategory = ref(null);  //quan li trang thai mui ten
const emit = defineEmits(['select-category']);  //khai bao emit cho su kien select-category
const selectCategory = (category) => {
  activeCategory.value = activeCategory.value === category ? null: category    //nếu mục đó đã được mở thì gán lại null
  emit('select-category',activeCategory.value) //phat ra su kien kem theo du lieu cua category  
}
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

/* Tổng thể header */
.header {
  width: 100%;
  background-color: #ffffff;
  color: white;
  font-family: Arial, sans-serif;
}

/* Phần trên cùng của header */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background-color: #0b62bf;
}

/* Logo */
.logo-hot {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  font-size: 26px;
  font-weight: bold;
  color: white;
}

/* Search và icons bên phải */
.header-icons {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-container {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 4px;
  padding: 4px 8px;
}

.search-box {
  border: none;
  outline: none;
  padding: 6px 8px;
  font-size: 14px;
  width: 180px;
}

.search-button {
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  font-size: 16px;
}

.icons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icons i {
  font-size: 18px;
  cursor: pointer;
  color: white;
  transition: color 0.2s;
}

.icons i:hover {
  color: #00bcd4;
}

/* User menu dropdown */
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
}

.user-icon {
  cursor: pointer;
}

/* Dropdown mặc định ẩn */
.user-dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  background-color: white;
  color: black;
  min-width: 130px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  z-index: 1000;
  display: none;
  flex-direction: column;
  padding: 8px 0;
}

/* Hiện dropdown khi hover user-menu */
.user-menu:hover .user-dropdown {
  display: flex;
}

.user-dropdown a {
  padding: 8px 16px;
  text-decoration: none;
  color: black;
  display: block;
  font-size: 14px;
}

.user-dropdown a:hover {
  background-color: #f0f0f0;
  color: #0b62bf;
}

/* Thanh điều hướng */
.header-bottom {
  background-color: white;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #aea7a7;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 12px 24px;
  font-weight: bold;
  font-size: 14px;
}

.nav a {
  color: black;
  text-decoration: none;
  position: relative;
  padding: 4px 6px;
  transition: color 0.2s;
}

.nav a:hover {
  color: #00bcd4;
}

.nav a.special {
  color: #e91e63;
}

.nav a.active {
  border-bottom: 2px solid #00bcd4;
  color: #00bcd4;
}
</style>
