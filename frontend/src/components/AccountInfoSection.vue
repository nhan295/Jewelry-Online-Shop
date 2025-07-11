<template>
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
      
      <!-- popup -->
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
</template>


<script setup>
import { ref, onMounted, onUnmounted, toRefs, watch } from "vue";

const props = defineProps({
    userId: Number,
    userName: String,
    userEmail: String,
    userMobile: String,
    userAddress: String,
    userCreated: String,
    getUserData: Function 
});
const {
  userId,
  userName,
  userEmail,
  userMobile,
  userAddress,
  userCreated
} = toRefs(props);
// Message và loading states
const message = ref("");
const isSubmitting = ref(false);

// Popup control
const showEditForm = ref(false);

// Edit form data - tách riêng để không ảnh hưởng đến display data
const editForm = ref({
  userName: "",
  userEmail: "",
  userMobile: "",
  userAddress: "",
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


// Mở popup edit
const openEditFormUser = () => {
  editForm.value = {
    userName: userName.value || "",
    userEmail: userEmail.value || "",
    userMobile: userMobile.value || "",
    userAddress: userAddress.value || "",
  };
  showEditForm.value = true;
  document.body.style.overflow = "hidden";
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
console.log('userId:',userId)
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
        
    console.log("Response:", response.status, data);
      message.value = "Cập nhật thông tin thành công!";
      console.log("✅ Gửi dữ liệu:", {
        user_name: editForm.value.userName,
        user_email: editForm.value.userEmail,
        user_mobile: editForm.value.userMobile,
        user_address: editForm.value.userAddress,
});
    
      // Đóng popup
      closePopup();
      if(props.getUserData){
        // Tải lại dữ liệu từ server để đảm bảo đồng bộ
      await props.getUserData();
      }
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

// Xử lý phím ESC
const handleKeydown = (e) => {
  if (e.key === "Escape" && showEditForm.value) {
    closePopup();
  }
};

// Lifecycle hooks
onMounted(async() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "auto";
});

watch(
  [userName, userEmail, userMobile, userAddress],
  ([newName, newEmail, newMobile, newAddress]) => {
    console.log("🟢 Props đã thay đổi!");
    editForm.value.userName = newName || "";
    editForm.value.userEmail = newEmail || "";
    editForm.value.userMobile = newMobile || "";
    editForm.value.userAddress = newAddress || "";
  }
);

</script>


<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

/* ============== GLOBAL STYLES ============== */
* {
  transition: all 0.2s ease;
}

/* ============== ACCOUNT INFO SECTION ============== */
.account-info {
  width: 35%;
  padding: 20px;
  border: 1px solid #ddd;
  background: white;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.account-info:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 2px;
}

.header strong {
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-bounce {
  color: #007acc;
  animation: bounce 2s infinite;
}

.view-all {
  color: #007acc;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.view-all:hover {
  background-color: #f0f8ff;
  color: #0056b3;
}

.divider {
  border: none;
  height: 1px;
  background-color: #e9ecef;
  margin: 15px 0;
}

/* Account Grid */
.account-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
  font-size: 14px;
  color: #333;
}

.account-item {
  padding: 12px;
  border-radius: 6px;
  background: #f8f9fa;
  border-left: 3px solid #e9ecef;
}

.account-item:hover {
  border-left-color: #007acc;
  background: #fff;
}

.account-grid strong {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
  color: #555;
  font-size: 12px;
}

/* ============== POPUP STYLES ============== */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.3s ease-out;
}

.edit-user-form {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

/* Popup Header */
.close-popup {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-popup:hover {
  background-color: #f0f0f0;
  color: #333;
}

.close-popup:active {
  transform: scale(0.95);
}

.popup-title {
  margin: 0;
  padding: 25px 25px 20px 25px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
  text-align: center;
}

/* ============== FORM STYLES ============== */
.edit-user-form form {
  padding: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background-color: #fff;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007acc;
  box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.1);
  background-color: #fafbfc;
}

.form-group input:hover {
  border-color: #c1c9d2;
}

.form-group input::placeholder {
  color: #999;
}

/* Form Buttons */
.form-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.form-buttons button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
}

.form-buttons button[type="submit"] {
  background-color: #007acc;
  color: white;
}

.form-buttons button[type="submit"]:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.form-buttons button[type="submit"]:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* Loading State */
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
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
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
    width: 100%;
  }
  
  .account-grid {
    grid-template-columns: 1fr;
  }
  
  .edit-user-form {
    width: 95%;
    margin: 20px;
  }
  
  .popup-title {
    font-size: 18px;
    padding: 20px 20px 15px 20px;
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
}
</style>