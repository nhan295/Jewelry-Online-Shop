<template>
    <!-- mục địa chỉ -->
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

        <!-- danh sách địa chỉ mới-->
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

    <!-- popup -->
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
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch, toRefs, defineProps} from "vue";

// Message và loading states
const message = ref("");
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

const props = defineProps({
    userId: Number,
    userName: String,
    userEmail: String,
    userMobile: String,
    userAddress: String,
});
const { userId } = toRefs(props)
// Edit form data - tách riêng để không ảnh hưởng đến display data
const editForm = ref({
  recordUsername: "",
  recordMobile: "",
  recordProvince: "",
  recordWard: "",
  streetAddress: "",
  addressType: ""
});

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
        getAddressList();
      }else{
         message.value = `Lỗi: ${data.message || "Không thể thêm địa chỉ"}`;
      }
  } catch (err) {
    console.log('Lỗi khi thêm địa chỉ',err)
  }
};

//lấy danh sách địa chỉ
const getAddressList = async()=>{
    if (!userId) {
        console.warn("userId chưa được truyền vào component");
        return;
    }
  try{
    const list = await fetch(`http://localhost:3000/api/v1/address/list/${userId.value}`)
    if(list){
      addressList.value = await list.json();
      console.log(`Danh sách địa chỉ của user ${userId}:`,addressList.value)
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
  getProvince();
  getAddressList();
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "auto";
});

watch(()=>userId,(newVal)=>{
    if(newVal){
        getAddressList();
    }
})
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

/* Global smooth transitions */
* {
  transition: all 0.2s ease;
}
/* address.css */

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

/* Address Items */
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

/* Divider */
.divider {
  border: none;
  height: 1px;
  background: #eee;
  margin: 16px 0;
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

/* Label */
.label {
  color: #d94f4f;
  font-weight: 500;
  margin-top: 4px;
  font-size: 12px;
}

</style>