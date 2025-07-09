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
        <h1>{{ userName || "Chưa tải được tên" }}</h1>
      </div>
    </div>

    <div class="user_bottom">
      <div class="account-info">
        <div class="header">
          <i class="fas fa-user-edit icon-bounce"></i>
          <strong>THÔNG TIN TÀI KHOẢN</strong>
          <a class="view-all" href="#" @click.prevent="openEditFormUser"
            >Chỉnh sửa</a
          >
        </div>
        <hr class="divider" />
        <div class="account-grid">
          <div class="account-item">
            <strong>Username</strong>
            <p>{{ userName || "Đang tải..." }}</p>
          </div>

          <div class="account-item">
            <strong>Date Created</strong>
            <p>{{ formatDate(userCreated) || "Đang tải..." }}</p>
          </div>

          <div class="account-item">
            <strong>Email</strong>
            <p>{{ userEmail || "Đang tải..." }}</p>
          </div>

          <div class="account-item">
            <strong>Mobile</strong>
            <p>{{ userMobile || "Đang tải..." }}</p>
          </div>

          <div class="account-item">
            <strong>Address</strong>
            <p>{{ userAddress || "Đang tải..." }}</p>
          </div>
        </div>
      </div>

      <!-- Popup Edit Form -->
      <div v-if="showEditForm" class="popup-overlay" @click="closePopup">
        <div class="edit-user-form" @click.stop>
          <!-- Nút đóng -->
          <button class="close-popup" @click="closePopup">&times;</button>

          <!-- Tiêu đề -->
          <h2 class="popup-title">Chỉnh sửa thông tin</h2>

          <!-- Form -->
          <form @submit.prevent="handleEditUser">
            <div class="form-group">
              <label for="username">Tên người dùng</label>
              <input
                id="username"
                type="text"
                v-model="editForm.userName"
                required
                placeholder="Nhập tên người dùng"
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                v-model="editForm.userEmail"
                required
                placeholder="Nhập email"
              />
            </div>

            <div class="form-group">
              <label for="mobile">Số điện thoại</label>
              <input
                id="mobile"
                type="tel"
                v-model="editForm.userMobile"
                required
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div class="form-group">
              <label for="address">Địa chỉ</label>
              <input
                id="address"
                type="text"
                v-model="editForm.userAddress"
                required
                placeholder="Nhập địa chỉ"
              />
            </div>

            <!-- Buttons -->
            <div class="form-buttons">
              <button type="button" class="cancel-btn" @click="closePopup">
                Hủy
              </button>
              <button
                type="submit"
                :class="{ loading: isSubmitting }"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? "Đang lưu..." : "Lưu thông tin" }}
              </button>
            </div>
          </form>
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
            <strong
              >{{ userName || "Tên người dùng" }} -
              {{ userMobile || "Số điện thoại" }}</strong
            >
            <div>{{ userAddress || "Địa chỉ" }}, Vietnam</div>
            <div class="label">Nhà riêng</div>
          </div>
          <span class="default-tag">Mặc định</span>
        </div>

        <!-- Thêm địa chỉ mới -->
        <div class="add-new" @click="OpenAddressForm">
          <i class="fa fa-plus"></i>
          <span>Thêm địa chỉ mới</span>
        </div>
      </div>

      <!-- popup thêm địa chỉ -->
      <div
          class="address-popup-overlay"
          v-if="showAddressForm"
          @click="closeAddressForm"
        >
          <div class="address-form-container" @click.stop>
            <!-- Nút đóng -->
            <button class="close-popup" @click="closeAddressForm">
              &times;
            </button>
         
            <h3>Địa chỉ</h3>
            <form @submit.prevent="handleNewAddress">
              <div class="form-group">
                
                <input
                  type="text"
                  v-model="editForm.recordUsername"
                  placeholder="Tên người dùng"
                  required
                />
              </div>

              <div class="form-group">
               
                <input
                  type="text"
                  v-model="editForm.recordMobile"
                  placeholder="Số điện thoại"
                  required
                />
              </div>

              <div class="form-group">
               
                <input
                  type="text"
                  v-model="editForm.recordProvince"
                  placeholder="Tỉnh/Thành phố"
                  required
                />
              </div>

              <div class="form-group">
               
                <input
                  type="text"
                  v-model="editForm.recordWard"
                  placeholder="Phường/Xã"
                  required
                />
              </div>

              <div class="form-group">
                
                <input
                  type="text"
                  v-model="editForm.streetAddress"
                  placeholder="Tên đường, số nhà"
                  required
                />
              </div>

              <div class="form-buttons">
                <button
                  type="button"
                  class="cancel-btn"
                  @click="closeAddressForm"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  :disabled="isSubmittingAddress"
                  :class="{ loading: isSubmittingAddress }"
                >
                  {{ isSubmittingAddress ? "Đang xử lý..." : "Hoàn thành" }}
                </button>
              </div>
            </form>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Message và loading states
const message = ref("");
const isSubmitting = ref(false);

// User data refs
const userId = ref(null);
const userName = ref(null);
const userEmail = ref(null);
const userAddress = ref(null);
const userMobile = ref(null);
const userCreated = ref(null);

// Popup control
const showEditForm = ref(false);
const showAddressForm = ref(false);

// Edit form data - tách riêng để không ảnh hưởng đến display data
const editForm = ref({
  userName: "",
  userEmail: "",
  userMobile: "",
  userAddress: "",
  recordUsername: "",
  recordMobile: "",
  recordProvince: "",
  recordWard: "",
  streetAddress: "",
});

// Tự động ẩn message sau 5 giây
const autoHideMessage = () => {
  if (message.value) {
    setTimeout(() => {
      message.value = "";
    }, 5000);
  }
};

const formatDate = (date) => {
  if (!date) return "Đang tải...";
  return new Date(date).toLocaleDateString("vi-VN");
};
// Lấy dữ liệu user
const getUserData = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/user/", {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401) {
      message.value = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      autoHideMessage();
      // Có thể chuyển hướng đến trang đăng nhập
      // window.location.href = '/login';
      return;
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (response.ok) {
      // Xử lý nhiều format response khác nhau
      const user = data.user || data.value || data;

      if (user) {
        userId.value = user.user_id;
        userName.value = user.user_name;
        userEmail.value = user.user_email;
        userAddress.value = user.user_address;
        userMobile.value = user.user_mobile;
        userCreated.value = user.date_created;
      } else {
        message.value = "Không thể tải thông tin người dùng";
        autoHideMessage();
      }
    } else {
      message.value = `Lỗi: ${data.message || "Không thể tải thông tin người dùng"}`;
      autoHideMessage();
    }
  } catch (err) {
    message.value = "Lỗi kết nối đến server";
    console.error("Error fetching user data:", err);
    autoHideMessage();
  }
};

// Mở popup edit
const openEditFormUser = () => {
  // Copy dữ liệu hiện tại vào form edit
  editForm.value = {
    userName: userName.value || "",
    userEmail: userEmail.value || "",
    userMobile: userMobile.value || "",
    userAddress: userAddress.value || "",
  };

  showEditForm.value = true;
  document.body.style.overflow = "hidden";
};

// mở form thêm địa chỉ
const OpenAddressForm = () => {
  showAddressForm.value = true;
  document.body.style.overflow = "hidden";
};
//đóng form địa chỉ
const closeAddressForm = () => {
  showAddressForm.value = false;
  document.body.style.overflow = "auto";
};
// Đóng popup
const closePopup = () => {
  showEditForm.value = false;
  document.body.style.overflow = "auto";

  // Reset form
  editForm.value = {
    userName: "",
    userEmail: "",
    userMobile: "",
    userAddress: "",
  };
};

// Xử lý submit form edit
const handleEditUser = async () => {
  if (!userId.value) {
    message.value = "Không tìm thấy ID người dùng";
    autoHideMessage();
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/user/edit/profile/${userId.value}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user_name: editForm.value.userName,
          user_email: editForm.value.userEmail,
          user_mobile: editForm.value.userMobile,
          user_address: editForm.value.userAddress,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      message.value = "Cập nhật thông tin thành công!";

      // Cập nhật dữ liệu display
      userName.value = editForm.value.userName;
      userEmail.value = editForm.value.userEmail;
      userMobile.value = editForm.value.userMobile;
      userAddress.value = editForm.value.userAddress;

      // Đóng popup
      closePopup();

      // Tải lại dữ liệu từ server để đảm bảo đồng bộ
      await getUserData();
    } else {
      message.value = `Lỗi: ${data.message || "Không thể cập nhật thông tin"}`;
    }
  } catch (err) {
    message.value = "Lỗi kết nối. Vui lòng thử lại.";
    console.error("Error updating user:", err);
  } finally {
    isSubmitting.value = false;
    autoHideMessage();
  }
};

const getProvince = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/address/provinces");
  } catch (err) {}
};

const getWardByProvince = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/address/${province_id}/ward`
    );
  } catch {}
};

// Thêm địa chỉ mới (placeholder)
const handleNewAddress = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/address/add/${userId}`
    );
  } catch (err) {}
};

// Xử lý phím ESC
const handleKeydown = (e) => {
  if (e.key === "Escape" && showEditForm.value) {
    closePopup();
  }
};

// Lifecycle hooks
onMounted(() => {
  getUserData();
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "auto";
});
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

/* Global smooth transitions */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Message Alert */
.message-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
  z-index: 1001;
  animation: slideInRight 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: 10px;
}

.message-alert.error {
  background: linear-gradient(135deg, #f44336, #d32f2f);
  box-shadow: 0 4px 16px rgba(244, 67, 54, 0.3);
}

.close-message {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-message:hover {
  opacity: 0.7;
}

/* Popup Overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

/* Edit Form Popup */
.edit-user-form {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: slideInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
  max-height: 90vh;
  overflow-y: auto;
}

.close-popup {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-popup:hover {
  background: #f0f0f0;
  color: #333;
  transform: rotate(90deg);
}

.popup-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #333;
  text-align: center;
  border-bottom: 2px solid #007acc;
  padding-bottom: 12px;
}

.form-group {
  margin-bottom: 20px;
}

.edit-user-form label {
  display: block;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.edit-user-form input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f9f9f9;
  box-sizing: border-box;
}

.edit-user-form input:focus {
  outline: none;
  border-color: #007acc;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.1);
  transform: translateY(-2px);
}

.edit-user-form input:hover {
  border-color: #007acc;
  background: white;
}

.form-buttons {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 24px;
}

.edit-user-form button[type="submit"] {
  background: linear-gradient(135deg, #007acc, #0056b3);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.edit-user-form button[type="submit"]:hover:not(:disabled) {
  background: linear-gradient(135deg, #0056b3, #003d82);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 122, 204, 0.3);
}

.edit-user-form button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background: linear-gradient(135deg, #6c757d, #5a6268);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #5a6268, #495057);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.3);
}

/* Loading state */
.edit-user-form button[type="submit"].loading {
  position: relative;
  color: transparent;
}

.edit-user-form button[type="submit"].loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Original styles */
strong {
  font-size: 20px;
  font-family: Arial, sans-serif;
}

.user_bottom {
  display: flex;
  animation: slideUp 0.8s ease-out;
}

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
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
}

.account-info {
  width: 35%;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #c6c6c6;
  background-color: white;
  margin-top: 5%;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  animation: slideInLeft 0.8s ease-out;
}

.account-info:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
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
  box-shadow: 0 4px 12px rgba(0, 122, 204, 0.15);
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
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: slideInRight 0.8s ease-out;
}

.address-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
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
  right: 12px;
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

.icon-bounce {
  animation: bounce 2s infinite;
}

.icon-pulse {
  animation: iconPulse 2s infinite;
}

/* Keyframe animations */
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInScale {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

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
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
  to {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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

  .edit-user-form {
    padding: 24px;
    margin: 20px;
    max-width: none;
    width: calc(100% - 40px);
  }

  .form-buttons {
    flex-direction: column;
  }

  .edit-user-form button[type="submit"],
  .cancel-btn {
    width: 100%;
  }
}

/* Overlay toàn màn hình, nền mờ */
.address-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
  overflow-y: auto;
  animation: fadeIn 0.3s ease;
}

/* Container form popup */
.address-form-container {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  transform-origin: center;
  animation: slideInScale 0.4s ease-out;
}

/* Nút đóng */
.close-popup {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #555;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.close-popup:hover {
  transform: rotate(90deg);
  color: #000;
}

/* Nhóm input */
.form-group {
  margin-bottom: 20px;
}

.address-form-container label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.address-form-container input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: #f9f9f9;
  transition: all 0.3s ease;
}

.address-form-container input:focus {
  border-color: #007acc;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.15);
  outline: none;
}

/* Buttons */
.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}

.cancel-btn {
  background: linear-gradient(135deg, #6c757d, #5a6268);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #5a6268, #495057);
  transform: translateY(-2px);
}

button[type="submit"] {
  background: linear-gradient(135deg, #007acc, #0056b3);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
}

button[type="submit"]:hover:not(:disabled) {
  background: linear-gradient(135deg, #0056b3, #003d82);
  transform: translateY(-2px);
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading effect (nếu có) */
button.loading::after {
  content: "";
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-left: 10px;
  animation: spin 1s linear infinite;
}

/* Animation */
@keyframes slideInScale {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .address-form-container {
    padding: 24px;
  }

  .form-buttons {
    flex-direction: column;
  }

  .form-buttons button {
    width: 100%;
  }
}



</style>
