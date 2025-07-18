<template>
  <div>
    <!-- Hiển thị thông báo -->
    <div
      v-if="message"
      class="message-alert"
      :class="{ error: message.includes('Lỗi') || message.includes('Failed') }"
    >
      {{ message }}
      <button class="close-message" @click="message = ''">&times;</button>
    </div>

    <div class="user_top">
      <div class="show_hello">
        <h1 class="hello">HELLO</h1>
      </div>

      <div class="show_name">
        <h1>{{ userData.user_name || "Chưa tải được tên" }}</h1>
      </div>
    </div>

     <!-- Thanh tab ngang -->
    <div class="tab-header">
      <button :class="{ active: currentTab === 'account' }" @click="currentTab = 'account'">
        Thông tin khách hàng
      </button>
      <button :class="{ active: currentTab === 'address' }" @click="currentTab = 'address'">
        Địa chỉ giao hàng
      </button>
      <button :class="{ active: currentTab === 'history' }" @click="currentTab = 'history'">
        Lịch sử mua hàng
      </button>
    </div>
    
    <!-- mục thông tin tài khoản -->
    <div class="user_bottom">
       <div v-show="currentTab === 'account'">
        <AccountInfoSection :userData="userData" />

      </div>

      <div v-show="currentTab === 'address'">
        <AddressSection />
      </div>

      <div v-show="currentTab === 'history'">
        <p style="padding: 20px; font-size: 14px;">Chưa có dữ liệu.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AccountInfoSection from "./AccountInfoSection.vue";
import AddressSection from "./AddressSection.vue";
const currentTab = ref('account');
const message = ref("");

const userData = ref({
  user_id: null,
  user_name: '',
  user_email: '',
  user_mobile: '',
  user_address: '',
  date_created: ''
});

const fetchUserFromSession = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/user', {
      method: 'GET',
      credentials: 'include'
    });
    const data = await res.json();
    if (res.ok && data.user?.user_id) {
      userData.value.user_id = data.user.user_id;
      await fetchUserData(data.user.user_id);
    } else {
      message.value = 'Không tìm thấy người dùng trong session';
      autoHideMessage();
    }
  } catch (err) {
    message.value = 'Lỗi kết nối đến server';
    autoHideMessage();
  }
};

// Step 2: Lấy thông tin chi tiết từ DB qua user_id
const fetchUserData = async (userId) => {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/user/${userId}`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await res.json();
    if (res.ok && data.user) {
      userData.value = { ...data.user };
    } else {
      message.value = `Lỗi: ${data.message || 'Không thể tải dữ liệu'}`;
      autoHideMessage();
    }
  } catch (err) {
    message.value = 'Lỗi kết nối đến server';
    autoHideMessage();
  }
};

onMounted(async() => {
  await fetchUserFromSession();
});


</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

/* ============== GLOBAL STYLES ============== */
* {
  transition: all 0.2s ease;
}

/* ============== MESSAGE ALERT ============== */
.message-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  background: #4caf50;
  color: white;
  font-weight: 500;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideInRight 0.3s ease-out;
}

.message-alert.error {
  background: #f44336;
}

.close-message {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-message:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ============== USER TOP BANNER ============== */
.user_top {
  height: 200px;
  margin-top: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.user_top::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  pointer-events: none;
}

.show_hello {
  padding: 40px 0 0 48px;
  position: relative;
  z-index: 1;
}

.show_name {
  padding: 8px 0 0 48px;
  position: relative;
  z-index: 1;
}

.hello {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.show_name h1 {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* ============== TAB NAVIGATION ============== */
.tab-header {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin: 20px 0;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.tab-header button {
  flex: 1;
  padding: 16px 24px;
  border: none;
  background: transparent;
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  outline: none;
}

.tab-header button:hover {
  background: #f8f9fa;
  color: #495057;
}

.tab-header button.active {
  background: #007acc;
  color: white;
  font-weight: 600;
}

.tab-header button.active::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
}

.tab-header button:not(:last-child) {
  border-right: 1px solid #e9ecef;
}

.tab-header button.active + button {
  border-left: 1px solid #007acc;
}

/* ============== CONTENT AREA ============== */
.user_bottom {
  margin-top: 20px;
}

.user_bottom > div {
  animation: fadeIn 0.4s ease-out;
}

/* ============== ANIMATIONS ============== */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============== RESPONSIVE DESIGN ============== */
@media (max-width: 768px) {
  .user_top {
    height: 160px;
  }
  
  .show_hello,
  .show_name {
    padding-left: 24px;
  }
  
  .hello {
    font-size: 20px;
  }
  
  .show_name h1 {
    font-size: 24px;
  }
  
  .tab-header {
    flex-direction: column;
    margin: 15px 0;
  }
  
  .tab-header button {
    padding: 14px 20px;
    border-right: none !important;
    border-bottom: 1px solid #e9ecef;
  }
  
  .tab-header button:last-child {
    border-bottom: none;
  }
  
  .tab-header button.active::before {
    height: 100%;
    width: 4px;
    top: 0;
    bottom: auto;
    left: 0;
    right: auto;
  }
  
  .message-alert {
    top: 10px;
    right: 10px;
    left: 10px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .user_top {
    height: 140px;
  }
  
  .show_hello,
  .show_name {
    padding-left: 20px;
  }
  
  .hello {
    font-size: 18px;
  }
  
  .show_name h1 {
    font-size: 20px;
  }
  
  .tab-header button {
    padding: 12px 16px;
    font-size: 13px;
  }
}
</style>


