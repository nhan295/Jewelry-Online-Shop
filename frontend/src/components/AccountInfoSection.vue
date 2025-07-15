<template>
  <div class="account-info">
    <div
      v-if="message"
      class="message-alert"
      :class="{ error: message.includes('Lỗi') || message.includes('Failed') }"
    >
      {{ message }}
      <button class="close-message" @click="message = ''">&times;</button>
    </div>

    <!-- Header -->
    <div class="header">
      <i class="fas fa-user-edit icon-bounce"></i>
      <strong>THÔNG TIN TÀI KHOẢN</strong>
      <a class="view-all" href="#" @click.prevent="openEditFormUser">Chỉnh sửa</a>
    </div>

    <hr class="divider" />

    <!-- Dữ liệu tài khoản -->
    <div class="account-grid">
      <div class="account-item"><strong>Username</strong><p>{{ userData.user_name || "Đang tải..." }}</p></div>
      <div class="account-item"><strong>Date Created</strong><p>{{ formatDate(userData.date_created) }}</p></div>
      <div class="account-item"><strong>Email</strong><p>{{ userData.user_email || "Đang tải..." }}</p></div>
      <div class="account-item"><strong>Mobile</strong><p>{{ userData.user_mobile || "Đang tải..." }}</p></div>
      <div class="account-item"><strong>Address</strong><p>{{ userData.user_address || "Đang tải..." }}</p></div>

    </div>
  </div>
  

  <!-- Popup edit -->
  <div v-if="showEditForm" class="popup-overlay" @click="closePopup">
    <div class="edit-user-form" @click.stop>
      <button class="close-popup" @click="closePopup">&times;</button>
      <h2 class="popup-title">Chỉnh sửa thông tin</h2>
      <form @submit.prevent="handleEditUser">
        <div class="form-group">
          <label for="username">Tên người dùng</label>
          <input id="username" v-model="editForm.user_name" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" v-model="editForm.user_email" required />
        </div>
        <div class="form-group">
          <label for="mobile">Số điện thoại</label>
          <input id="mobile" type="tel" v-model="editForm.user_mobile" required />
        </div>
        <div class="form-group">
          <label for="address">Địa chỉ</label>
          <input id="address" v-model="editForm.user_address"  required />
        </div>
        <div class="form-buttons">
          <button type="button" class="cancel-btn" @click="closePopup">Hủy</button>
          <button type="submit" :class="{ loading: isSubmitting }" :disabled="isSubmitting">
            {{ isSubmitting ? "Đang lưu..." : "Lưu thông tin" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const message = ref('');
const isSubmitting = ref(false);
const showEditForm = ref(false);

const userData = ref({
  user_id: null,
  user_name: '',
  user_email: '',
  user_mobile: '',
  user_address: '',
  date_created: ''
});

const editForm = ref({
  user_name: '',
  user_email: '',
  user_mobile: '',
  user_address: ''
});

const autoHideMessage = () => {
  if (message.value) {
    setTimeout(() => {
      message.value = '';
    }, 5000);
  }
};

const formatDate = (date) => {
  if (!date) return 'Đang tải...';
  return new Date(date).toLocaleDateString('vi-VN');
};

// Step 1: Lấy user_id từ session
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

// Mở form chỉnh sửa
const openEditFormUser = () => {
  editForm.value = {
    user_name: userData.value.user_name,
    user_email: userData.value.user_email,
    user_mobile: userData.value.user_mobile,
    user_address: userData.value.user_address
  };
  showEditForm.value = true;
  document.body.style.overflow = 'hidden';
};

// Đóng popup
const closePopup = () => {
  showEditForm.value = false;
  document.body.style.overflow = 'auto';
};

// Gửi cập nhật lên server
const handleEditUser = async () => {
  const id = userData.value.user_id;
  if (!id) {
    message.value = 'Không tìm thấy ID người dùng';
    autoHideMessage();
    return;
  }

  isSubmitting.value = true;
  try {
    const res = await fetch(`http://localhost:3000/api/v1/user/edit/profile/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...editForm.value })
    });
    const data = await res.json();
    if (res.ok) {
      message.value = 'Cập nhật thành công!';
      await fetchUserData(id);
      closePopup();
    } else {
      message.value = `Lỗi: ${data.message || 'Không thể cập nhật'}`;
    }
  } catch (err) {
    message.value = 'Lỗi kết nối. Vui lòng thử lại.';
  } finally {
    isSubmitting.value = false;
    autoHideMessage();
  }
};

// Thoát popup bằng ESC
const handleKeydown = (e) => {
  if (e.key === 'Escape' && showEditForm.value) closePopup();
};

// Mounted
onMounted(() => {
  fetchUserFromSession(); // gọi session trước để có user_id
  document.addEventListener('keydown', handleKeydown);
});

// Unmounted
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = 'auto';
});
</script>
<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ============== MAIN CONTAINER ============== */
.account-info {
  width: 100%;
  max-width: 700px;
  margin: 20px auto;
  padding: 25px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  position: relative;
}

.account-info:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* ============== MESSAGE ALERT ============== */
.message-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 400px;
  min-width: 300px;
  padding: 16px 20px;
  border-radius: 12px;
  z-index: 9999;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Success Message */
.message-alert:not(.error) {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border: 1px solid #b3d4be;
  color: #155724;
}

/* Error Message */
.message-alert.error {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border: 1px solid #f1b0b7;
  color: #721c24;
}

.message-content {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 30px;
}

.success-icon {
  color: #28a745;
  font-size: 16px;
}

.error-icon {
  color: #dc3545;
  font-size: 16px;
}

.close-message {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-message:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

/* ============== HEADER ============== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 5px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header strong {
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.icon-bounce {
  color: #3498db;
  font-size: 20px;
  animation: bounce 2s infinite;
}

.view-all {
  color: #3498db;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 25px;
  background: rgba(52, 152, 219, 0.1);
  border: 1px solid rgba(52, 152, 219, 0.2);
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.view-all:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.divider {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, #3498db, #2ecc71, #3498db);
  margin: 20px 0;
  border-radius: 2px;
}

/* ============== ACCOUNT GRID ============== */
.account-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  font-size: 14px;
}

.account-item {
  padding: 20px;
  border-radius: 12px;
  background: white;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.account-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.account-item:hover::before {
  transform: scaleY(1);
}

.account-item:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.account-item strong {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.account-item strong i {
  color: #3498db;
  width: 16px;
}

.account-item p {
  margin: 0;
  color: #555;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
}

/* ============== POPUP OVERLAY ============== */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(3px);
  animation: fadeIn 0.3s ease-out;
  padding: 20px;
}

.edit-user-form {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ============== POPUP HEADER ============== */
.popup-header {
  background: #f8f9fa;
  color: #2c3e50;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.popup-header i {
  font-size: 18px;
  color: #6c757d;
}

.popup-title {
  padding-top: 20px;
  padding-left: 22px;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.close-popup {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  color: #6c757d;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-popup:hover {
  background: #e9ecef;
  color: #495057;
}

/* ============== FORM STYLES ============== */
.edit-user-form form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
  font-size: 14px;
}

.form-group label i {
  color: #6c757d;
  width: 16px;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d3d4;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #fff;
  box-sizing: border-box;
  color: #495057;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-group input:hover {
  border-color: #adb5bd;
}

.form-group input::placeholder {
  color: #adb5bd;
}

/* ============== FORM BUTTONS ============== */
.form-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.form-buttons button {
  padding: 10px 20px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.cancel-btn {
  background: #fff;
  color: #6c757d;
  border-color: #d1d3d4;
}

.cancel-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
}

.form-buttons button[type="submit"] {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.form-buttons button[type="submit"]:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
}

.form-buttons button[type="submit"]:disabled {
  background: #e9ecef;
  color: #6c757d;
  border-color: #d1d3d4;
  cursor: not-allowed;
}

/* ============== LOADING STATE ============== */
.loading {
  position: relative;
  color: transparent !important;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  transform: translate(-50%, -50%);
}

/* ============== ANIMATIONS ============== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: translateY(-30px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

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

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
  60% { transform: translateY(-3px); }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* ============== RESPONSIVE DESIGN ============== */
@media (max-width: 768px) {
  .account-info {
    width: 95%;
    padding: 20px;
    margin: 10px auto;
  }
  
  .account-grid {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .popup-overlay {
    padding: 15px;
  }
  
  .edit-user-form {
    max-width: 100%;
  }
  
  .popup-header {
    padding: 16px 20px;
  }
  
  .popup-title {
    font-size: 16px;
  }
  
  .edit-user-form form {
    padding: 20px;
  }
  
  .form-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .form-buttons button {
    width: 100%;
  }
  
  .message-alert {
    position: fixed;
    top: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .account-info {
    width: 100%;
    border-radius: 0;
    margin: 0;
  }
  
  .account-item {
    padding: 15px;
  }
  
  .header strong {
    font-size: 16px;
  }
  
  .popup-overlay {
    padding: 10px;
  }
  
  .edit-user-form {
    border-radius: 8px;
  }
  
  .popup-header {
    padding: 14px 16px;
  }
  
  .edit-user-form form {
    padding: 16px;
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  .form-group input {
    padding: 10px 12px;
  }
}</style>