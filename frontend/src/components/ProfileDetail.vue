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
            <strong>{{ userName || "Tên người dùng" }} - {{ userMobile || "Số điện thoại" }}</strong>
            <div>{{ userAddress || "Địa chỉ" }}, Vietnam</div>
            <div class="label">Nhà riêng</div>
          </div>
          <span class="default-tag">Mặc định</span>
        </div>

        <!-- danh sách địa chỉ -->
        <div class="address-list-container">
          <div class="address-list-content" v-for="list in addressList"
          :key="list.record_id">
            <p><strong>Tên người dùng:</strong> {{ list.record_username }}</p>
            <p><strong>Số điện thoại:</strong> {{ list.record_mobile }}</p>
            <p><strong>Địa chỉ:</strong> {{ list.street_address }}, {{ list.ward_name }}, {{ list.province_name }}</p>
            <div class="label">{{ list.address_type }}</div>
          </div>

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
               <select v-model="selectedProvince" required @change="getWardByProvince">
                <option value="" disabled>Chọn tỉnh/thành phố</option>
                <option v-for="province in provinces" 
                :key="province.province_id" 
                :value="province.province_id">{{ province.province_name }}</option>
               </select>
              </div>

              <div class="form-group">
               <select v-model="selectedWard" required>
                <option value="" disabled>Chọn xã/phường</option>
                <option v-for="ward in wards"
                :key="ward.ward_id"
                :value="ward.ward_id">{{ ward.ward_name }}</option>
               </select>
                
              </div>

              <div class="form-group">
                
                <input
                  type="text"
                  v-model="editForm.streetAddress"
                  placeholder="Tên đường, số nhà"
                  required
                />
              </div>

              <div class="form-group">
                <label for="">Văn phòng</label>
                <input type="radio"
                v-model="editForm.addressType"
                value="Văn phòng">
              </div>

              <div class="form-group">
                <label for="">Nhà riêng</label>
                <input type="radio"
                v-model="editForm.addressType"
                value="Nhà riêng">
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

const provinces = ref([]);
const wards = ref([]);
//giá trị của province và ward được chọn
const selectedProvince = ref('');
const selectedWard = ref('');

//danh sách địa chỉ
const addressList = ref([]);

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
  addressType: ""
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
    if(res.ok){
      const data = await res.json()
      provinces.value = data
      console.log('Provinces list:',data)
    }else{
      console.error('Failed to fetch province')
    }
  } catch (err) {
      console.error("Error fetching provinces:", err);
  }
};

const getWardByProvince = async () => {
  try {
    
    const res = await fetch(
      `http://localhost:3000/api/v1/address/${selectedProvince.value}/wards`);
      if(res.ok){
        const data = await res.json()
        console.log('Ward list',data)
        wards.value = data
      }else{
        console.error('Failed to fetch ward')
      }
  } catch(err) {
    console.error("Error fetching ward:", err);
  }
};

// Thêm địa chỉ mới 
const handleNewAddress = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/address/add/${userId.value}`,
    {
        method: 'POST',
        headers: {"Content-Type":"application/json"},
        credentials: "include",
        body: JSON.stringify({
          record_username: editForm.value.recordUsername,
          record_mobile: editForm.value.recordMobile,
          province_id: selectedProvince.value,
          ward_id: selectedWard.value,
          street_address: editForm.value.streetAddress,
          address_type: editForm.value.addressType
        })
      });
      const data = await res.json()
      if(res.ok){
        message.value = 'Thêm địa chỉ mới thành công'
      }else{
         message.value = `Lỗi: ${data.message || "Không thể thêm địa chỉ"}`;
      }
  } catch (err) {
    console.log('Lỗi khi thêm địa chỉ',err)
  }
};

//lấy danh sách địa chỉ
const getAddressList = async()=>{
  try{
    const list = await fetch(`http://localhost:3000/api/v1/address/list/${userId.value}`)
    if(list){
      addressList.value = await list.json();
      console.log(`Danh sách địa chỉ của user ${userId.value}:`,addressList.value)
    }else{
      console.log('Không tải được danh sách địa chỉ')
    }
  }catch(err){
    console.log('Lỗi khi tải danh sách địa chỉ',err)
  }
}
// Xử lý phím ESC
const handleKeydown = (e) => {
  if (e.key === "Escape" && showEditForm.value) {
    closePopup();
  }
};

// Lifecycle hooks
onMounted(async() => {
  await getUserData();
  getProvince();
  getAddressList();
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
  transition: all 0.2s ease;
}

/* Message Alert */
.message-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 6px;
  background: #4caf50;
  color: white;
  font-weight: 500;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 10px;
}

.message-alert.error {
  background: #f44336;
}

.close-message {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-message:hover {
  opacity: 0.8;
}

/* Popup Overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Edit Form Popup */
.edit-user-form {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 480px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;
}

.close-popup {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 50%;
}

.close-popup:hover {
  background: #f0f0f0;
  color: #333;
}

.popup-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.form-group {
  margin-bottom: 16px;
}

.edit-user-form label {
  display: block;
  font-weight: 500;
  color: #555;
  font-size: 13px;
  margin-bottom: 6px;
}

.edit-user-form input, .edit-user-form select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  box-sizing: border-box;
}

.edit-user-form input:focus, .edit-user-form select:focus {
  outline: none;
  border-color: #007acc;
  box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.1);
}

.form-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.edit-user-form button[type="submit"] {
  background: #007acc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.edit-user-form button[type="submit"]:hover:not(:disabled) {
  background: #0056b3;
}

.edit-user-form button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #5a6268;
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
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Main Layout */
strong {
  font-size: 16px;
  font-family: Arial, sans-serif;
  font-weight: 600;
}

.user_bottom {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.show_hello {
  font-family: Arial, sans-serif;
  font-size: 18px;
  color: white;
  padding-top: 50px;
  padding-left: 48px;
}

.show_name {
  font-family: Arial, sans-serif;
  font-size: 18px;
  color: white;
  padding-left: 48px;
}

.hello {
  font-size: 24px;
  font-weight: 600;
}

.user_top {
  height: 200px;
  margin-top: 3px;
  background: linear-gradient(135deg, #6c757d, #495057);
  position: relative;
  border-radius: 8px;
}

.account-info {
  width: 35%;
  height: fit-content;
  padding: 20px;
  border: 1px solid #ddd;
  background-color: white;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.account-info:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

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

.address-box {
  border: 1px solid #ddd;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  font-family: Arial, sans-serif;
  margin-top: 20px;
  margin-right: 20px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.address-box:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 600;
}

.view-all {
  margin-left: auto;
  font-weight: 500;
  color: #007acc;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  background: #f8f9fa;
  font-size: 13px;
}

.view-all:hover {
  background: #e9ecef;
  text-decoration: none;
}

.address-item {
  border: 1px solid #eee;
  padding: 12px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  border-radius: 6px;
  background: #fff;
}

.address-item:hover {
  border-color: #007acc;
}

.default-tag {
  background: #e3f2fd;
  color: #007acc;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 12px;
  position: absolute;
  top: 12px;
  right: 12px;
}

.label {
  color: #d94f4f;
  font-weight: 500;
  margin-top: 4px;
  font-size: 12px;
}

.edit-btn {
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px;
  border-radius: 50%;
}

.edit-btn:hover {
  background: #e9ecef;
}

.add-new {
  border: 2px dashed #ccc;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-radius: 6px;
  background: #f8f9fa;
  font-size: 14px;
}

.add-new:hover {
  border-color: #007acc;
  background: #fff;
  color: #007acc;
}

.add-new i {
  margin-right: 8px;
}

.divider {
  border: none;
  height: 1px;
  background: #eee;
  margin: 16px 0;
}

p {
  font-size: 14px;
  font-family: Arial, sans-serif;
  font-weight: 400;
  margin: 6px 0;
}

/* Address Form Popup */
.address-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
  overflow-y: auto;
}

.address-form-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
}

.address-form-container h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.address-form-container input,
.address-form-container select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  box-sizing: border-box;
}

.address-form-container input:focus,
.address-form-container select:focus {
  border-color: #007acc;
  box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.1);
  outline: none;
}

button[type="submit"] {
  background: #007acc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
}

button[type="submit"]:hover:not(:disabled) {
  background: #0056b3;
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button.loading::after {
  content: "";
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: inline-block;
  margin-left: 8px;
  animation: spin 1s linear infinite;
}

/* Address List */
.address-list-container {
  margin-top: 16px;
}

.address-list-content {
  background: #f8f9fa;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.address-list-content p {
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  margin: 6px 0;
  color: #333;
}

.address-list-content p strong {
  font-family: Arial, sans-serif;
  font-weight: 600;
  color: #555;
}

/* Animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .user_bottom {
    flex-direction: column;
    gap: 16px;
  }

  .account-info {
    width: 100%;
    margin-right: 0;
  }

  .address-box {
    margin-right: 0;
    margin-top: 16px;
  }

  .edit-user-form {
    padding: 20px;
    margin: 16px;
    max-width: none;
    width: calc(100% - 32px);
  }

  .form-buttons {
    flex-direction: column;
  }

  .edit-user-form button[type="submit"],
  .cancel-btn {
    width: 100%;
  }

  .address-form-container {
    padding: 20px;
    margin: 16px;
    width: calc(100% - 32px);
    max-width: none;
  }

  .show_hello,
  .show_name {
    padding-left: 24px;
  }

  .user_top {
    height: 160px;
  }

  .account-grid {
    grid-template-columns: 1fr;
  }
}
</style>
