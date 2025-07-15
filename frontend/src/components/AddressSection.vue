<template>
  <div class="address-box">
    <div class="header">
      <i class="fa fa-truck"></i>
      <strong>DANH SÁCH ĐỊA CHỈ</strong>
      <a class="view-all" href="#">Xem tất cả</a>
    </div>

    <hr class="divider" />

    <div class="address-item">
      <div>
        <strong>{{ userName }} - {{ userMobile }}</strong>
        <div>{{ userAddress }}, Vietnam</div>
        <div class="label">Nhà riêng</div>
      </div>
      <span class="default-tag">Mặc định</span>
    </div>

    <div class="address-list-container">
      <div class="address-list-content" v-for="list in addressList" :key="list.record_id">
        <div class="address-info">
          <p><strong>Tên người dùng:</strong> {{ list.record_username }}</p>
          <p><strong>Số điện thoại:</strong> {{ list.record_mobile }}</p>
          <p><strong>Địa chỉ:</strong> {{ list.street_address }}, {{ list.ward_name }}, {{ list.province_name }}</p>
          <div class="label">{{ list.address_type }}</div>
        </div>
        <div class="action-icons">
          <i class="fas fa-edit edit-icon" @click="openEditAddress(list)"></i>
          <i class="fas fa-trash delete-icon" @click="deleteAddress()"></i>
        </div>
      </div>
    </div>

    <div class="add-new" @click="openAddForm()">
      <i class="fa fa-plus"></i>
      <span>Thêm địa chỉ mới</span>
    </div>
  </div>

  <!-- popup -->
  <div v-if="showAddressForm" class="address-popup-overlay" @click="closeAddressForm">
    <div class="address-form-container" @click.stop>
      <button class="close-popup" @click="closeAddressForm">&times;</button>
      <h3>Địa chỉ</h3>
      <form @submit.prevent="submitAddressForm()">
        <div class="form-group">
          <input type="text" v-model="editForm.recordUsername" placeholder="Tên người dùng" required />
        </div>
        <div class="form-group">
          <input type="text" v-model="editForm.recordMobile" placeholder="Số điện thoại" required />
        </div>
        <div class="form-group">
          <select v-model="selectedProvince" required @change="getWardByProvince">
            <option value="" disabled>Chọn tỉnh/thành phố</option>
            <option v-for="province in provinces" :key="province.province_id" :value="province.province_id">
              {{ province.province_name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <select v-model="selectedWard" required>
            <option value="" disabled>Chọn xã/phường</option>
            <option v-for="ward in wards" :key="ward.ward_id" :value="ward.ward_id">
              {{ ward.ward_name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <input type="text" v-model="editForm.streetAddress" placeholder="Tên đường, số nhà" required />
        </div>
        <div class="form-group">
          <label><input type="radio" v-model="editForm.addressType" value="Văn phòng" /> Văn phòng</label>
          <label><input type="radio" v-model="editForm.addressType" value="Nhà riêng" /> Nhà riêng</label>
        </div>
        <div class="form-buttons">
          <button type="button" class="cancel-btn" @click="closeAddressForm">Huỷ</button>
          <button type="submit" :disabled="isSubmittingAddress">
            {{ isSubmittingAddress ? "Đang xử lý..." : (isEditMode ? "Cập nhật" : "Hoàn thành") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const message = ref("");
const provinces = ref([]);
const wards = ref([]);
const selectedProvince = ref("");
const selectedWard = ref("");

const addressList = ref([]);
const showAddressForm = ref(false);
const isSubmittingAddress = ref(false);

const userId = ref(null);
const userName = ref("");
const userMobile = ref("");
const userAddress = ref("");

// mode state
const isEditMode = ref(false); // false: thêm mới, true: sửa
const editingRecordId = ref(null); // lưu record_id đang chỉnh sửa

// Form
const editForm = ref({
  recordUsername: "",
  recordMobile: "",
  streetAddress: "",
  addressType: "",
});

//mở form thêm
const openAddForm = () => {
  isEditMode.value = false;
  editingRecordId.value = null;
  showAddressForm.value = true;
  document.body.style.overflow = "hidden";
};

const closeAddressForm = () => {
  showAddressForm.value = false;
  document.body.style.overflow = "auto";
  isEditMode.value = false;
  editingRecordId.value = null;
  // Reset form
  editForm.value = {
    recordUsername: "",
    recordMobile: "",
    streetAddress: "",
    addressType: "",
  };
  selectedProvince.value = "";
  selectedWard.value = "";
};
 //mở form sửa
const openEditAddress = (list)=>{
  isEditMode.value = true;
  editingRecordId.value = list.record_id;
  editForm.value = {
    recordUsername: list.record_username,
    recordMobile: list.record_mobile,
    streetAddress: list.street_address,
    addressType: list.address_type
  };
  selectedProvince.value = list.province_id,
  selectedWard.value = list.ward_id

  showAddressForm.value = true;
  document.body.style.overflow = "hidden";
  getWardByProvince()
}

const submitAddressForm = async () => {
  try {
    isSubmittingAddress.value = true;

    const url = isEditMode.value
      ? `http://localhost:3000/api/v1/address/edit/${addressList.value[0]?.record_id}`
      : `http://localhost:3000/api/v1/address/add/${userId.value}`;

    const method = isEditMode.value ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        record_username: editForm.value.recordUsername,
        record_mobile: editForm.value.recordMobile,
        province_id: selectedProvince.value,
        ward_id: selectedWard.value,
        street_address: editForm.value.streetAddress,
        address_type: editForm.value.addressType,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      message.value = isEditMode.value
        ? "Cập nhật địa chỉ thành công"
        : "Thêm địa chỉ mới thành công";
      await getAddressList();
      closeAddressForm();
    } else {
      message.value = `Lỗi: ${data.message || "Không thể xử lý địa chỉ"}`;
    }
  } catch (err) {
    console.error("Lỗi khi xử lý địa chỉ", err);
  } finally {
    isSubmittingAddress.value = false;
  }
};

const deleteAddress = async() => {
  try{
    const res = await fetch(`http://localhost:3000/api/v1/address/delete/${addressList.value[0]?.record_id}`,{
      method: 'DELETE'
    })
    const data = await res.json()
    if(res.ok){
      message.value = 'Đã xoá địa chỉ'
      await getAddressList()
    }else{
      console.error('Xoá thất bại:', data);
    }
  }catch(err){
    console.log(err)
  }
};

const getUserData = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/user/", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    const user = data.user || data.value || data;

    userId.value = user.user_id;
    userName.value = user.user_name;
    userMobile.value = user.user_mobile;
    userAddress.value = user.user_address;
  } catch (err) {
    console.error("Lỗi lấy thông tin người dùng", err);
  }
};

const getProvince = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/v1/address/provinces");
    if (res.ok) {
      provinces.value = await res.json();
    }
  } catch (err) {
    console.error("Lỗi lấy danh sách tỉnh/thành", err);
  }
};

const getWardByProvince = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/address/${selectedProvince.value}/wards`);
    if (res.ok) {
      wards.value = await res.json();
    }
  } catch (err) {
    console.error("Lỗi lấy danh sách xã/phường", err);
  }
};


const getAddressList = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/address/list/${userId.value}`);
    if (res.ok) {
      addressList.value = await res.json();
    }
  } catch (err) {
    console.error("Lỗi khi tải danh sách địa chỉ", err);
  }
};

onMounted(async () => {
  await getUserData();
  await getProvince();
  await getAddressList();
});

onUnmounted(() => {
  document.body.style.overflow = "auto";
});
</script>

<style scoped>
.address-box {
  border: 1px solid #e5e7eb;
  padding: 20px;
  width: 100%;
  max-width: 640px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 20px auto;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 600;
  color: #1f2937;
}

.header i {
  font-size: 18px;
  color: #3b82f6;
}

.view-all {
  margin-left: auto;
  font-weight: 500;
  color: #3b82f6;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  background: #eff6ff;
  font-size: 14px;
}

.view-all:hover {
  background: #dbeafe;
}

/* Divider */
.divider {
  border: none;
  height: 1px;
  background: #e5e7eb;
  margin: 16px 0;
}

/* Address Items */
.address-item {
  border: 1px solid #f3f4f6;
  padding: 16px;
  margin: 12px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 8px;
  background: #f9fafb;
}

.address-item strong {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.address-item div {
  color: #6b7280;
  font-size: 13px;
  margin: 2px 0;
}

.default-tag {
  background: #dbeafe;
  color: #1e40af;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

/* Address List */
.address-list-container {
  margin-top: 16px;
}

.address-list-content {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.address-info {
  flex: 1;
}

.address-info p {
  font-size: 14px;
  line-height: 1.4;
  margin: 4px 0;
  color: #374151;
}

.address-info p strong {
  font-weight: 600;
  color: #111827;
}

/* Action Icons */
.action-icons {
  display: flex;
  gap: 12px;
  margin-left: 16px;
  flex-shrink: 0;
}

.edit-icon, .delete-icon {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  color: #3b82f6;
  background: #eff6ff;
}

.edit-icon:hover {
  background: #dbeafe;
  color: #1d4ed8;
}

.delete-icon {
  color: #ef4444;
  background: #fef2f2;
}

.delete-icon:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* Labels */
.label {
  color: #f59e0b;
  font-weight: 500;
  margin-top: 4px;
  font-size: 12px;
  padding: 2px 6px;
  background: #fef3c7;
  border-radius: 4px;
  display: inline-block;
}

/* Add New Button */
.add-new {
  border: 2px dashed #d1d5db;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  border-radius: 8px;
  background: #f9fafb;
  font-size: 14px;
  margin-top: 16px;
}

.add-new:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.add-new i {
  margin-right: 8px;
}

/* Popup */
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
  padding: 20px;
}

.address-form-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  position: relative;
}

.close-popup {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f3f4f6;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  color: #6b7280;
}

.close-popup:hover {
  background: #e5e7eb;
}

.address-form-container h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #111827;
  text-align: center;
}

/* Form */
.form-group {
  margin-bottom: 16px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3b82f6;
  outline: none;
}

.form-group label {
  display: inline-flex;
  align-items: center;
  margin-right: 16px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.form-group input[type="radio"] {
  width: auto;
  margin-right: 6px;
}

.form-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.form-buttons button {
  flex: 1;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.cancel-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.form-buttons button[type="submit"] {
  background: #3b82f6;
  color: white;
}

.form-buttons button[type="submit"]:hover:not(:disabled) {
  background: #1d4ed8;
}

.form-buttons button[type="submit"]:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .address-box {
    margin: 10px;
    padding: 16px;
  }
  
  .address-form-container {
    padding: 20px;
    margin: 10px;
  }
  
  .form-buttons {
    flex-direction: column;
  }
}
</style>