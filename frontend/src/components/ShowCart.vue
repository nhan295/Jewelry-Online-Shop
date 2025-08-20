<template>
  <div class="cart-container">
    <div class="cart-header">
      <h2>🛒 Giỏ hàng ({{ totalCartItem }}) sản phẩm</h2>
    </div>

    <div v-if="cart.length" class="main-layout">
      <!-- Danh sách sản phẩm trái-->
      <div class="cart-items">
        <div class="select-all">
          <input 
          type="checkbox"
          v-model="selectAll"
          @change="toggleSelectAll" > <!-- khi thay đổi gọi hàm toggleSelectAll-->
          <label for="select-all">Chọn tất cả</label>
        </div>

        <div v-for="(item, index) in cart" :key="index" class="cart-item">
          <input 
            type="checkbox"
            v-model="item.selected"
            @change="updateSelectAll"
           class="item-checkbox">
          
          <img :src="item.image" alt="product" class="product-img">
          
          <div class="product-info">
            <h3>{{ item.jewelry_name }}</h3>
            <p>Color: {{ item.color_name }} | Size: {{ item.size_number }}</p>
            <div class="price">{{ Number(item.jewelry_price).toLocaleString() }}₫</div>
          </div>

          <div class="quantity-controls">
            <button @click="decreaseQty(index)" :disabled="item.quantity <= 1">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQty(index)">+</button>
          </div>

          <button @click="delCartItem(item)" class="delete-btn">🗑️</button>
        </div>
      </div>

      <!-- Tóm tắt đơn hàng phải-->
      <div class="order-summary">
        <h3>Tóm tắt đơn hàng</h3>
        
        <div class="discount">
          <input type="text" placeholder="Mã giảm giá">
          <button>Áp dụng</button>
        </div>

        <div class="price-details">
          <div class="price-row">
            <span>Tổng sản phẩm ({{ selectedItemCount }})</span>
            <span>{{ Number(selectedItemPrice).toLocaleString() }}₫</span>
          </div>
          <div class="price-row">
            <span>Khuyến mãi</span>
            <span>-0₫</span>
          </div>
          <div class="total-row">
            <span>Tổng cộng</span>
            <span>{{ Number(selectedItemPrice).toLocaleString() }}₫</span>
          </div>
        </div>

        <div class="options">
          <label>
            <input type="checkbox"> Xuất hóa đơn
          </label>
          <textarea placeholder="Ghi chú đơn hàng"></textarea>
        </div>

        <div class="terms">
          <label>
            <input type="checkbox"> Tôi đồng ý với điều khoản dịch vụ
          </label>
        </div>

        <button class="checkout-btn">Thanh toán</button>
        <a href="/homepage" class="continue-shopping">← Tiếp tục mua sắm</a>
      </div>
    </div>

    <!-- Giỏ hàng trống -->
    <div v-else class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h3>Giỏ hàng trống</h3>
      <p>Thêm sản phẩm vào giỏ hàng để tiếp tục</p>
      <a href="/homepage" class="shop-btn">Mua sắm ngay</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";

const cart = ref([]);
const selectAll = ref(false);

const props = defineProps({
  user_id: [String, Number],
});

const getCartItem = async () => {
  if (!props.user_id) return;
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/cart/user/${props.user_id}`
    );
    const data = await response.json();
    if (response.ok) {
      cart.value = (data.item || []).map(item=>({
        ...item,
        selected:false, // Thêm thuộc tính selected cho mỗi item
      }));
    } else {
      cart.value = [];
    }
  } catch (err) {
    cart.value = [];
    console.error(err);
  }
};

const delCartItem = async (item) => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/cart/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: props.user_id,
        jewelry_id: item.jewelry_id,
        color_id: item.color_id,
        size_id: item.size_id,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Đã xoá khỏi giỏ hàng");
      await getCartItem();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
};

const increaseQty = (index) => {
  cart.value[index].quantity++;
};

const decreaseQty = (index) => {
  if (cart.value[index].quantity > 1) {
    cart.value[index].quantity--;
  }
};

const toggleSelectAll = ()=>{
  cart.value.forEach(item =>{
    item.selected = selectAll.value // click vào checkbox "Chọn tất cả" sẽ chọn (item.selected = true) hoặc bỏ chọn tất cả các sản phẩm
 })
}

const updateSelectAll = ()=>{
  const allSelected = cart.value.every(item => item.selected); // tất cả sản phẩm được chọn => auto check "Chọn tất cả"
  const nonSelected = cart.value.some(item => !item.selected);

  if(allSelected){
    selectAll.value = true;
  }else if(nonSelected){
    selectAll.value = false;
  }else{
    selectAll.value = false
  }
}
 // tính tổng giá của sản phẩm được chọn
const selectedItemPrice = computed(()=>{
  return cart.value
  .filter(item =>item.selected)
  .reduce ((total,item)=> total + item.jewelry_price * item.quantity,0)
})

 // đếm số lượng sản phẩm được chọn
const selectedItemCount = computed(()=>{
  return cart.value
  .filter(item => item.selected)
  .reduce((total,item)=> total + item.quantity,0)
})

const totalCartItem = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0);
});

onMounted(() => {
  getCartItem();
});

watch(
  () => props.user_id,
  (newVal) => {
    if (newVal) {
      getCartItem();
    }
  }
);
</script>

<style scoped>
.cart-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

.cart-header {
  text-align: center;
  margin-bottom: 30px;
}

.cart-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.main-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

/* Danh sách sản phẩm */
.cart-items {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.select-all {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.select-all input {
  margin-right: 10px;
}

.select-all label {
  font-weight: 500;
  color: #333;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 80px 1fr auto auto;
  gap: 15px;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-checkbox {
  width: 18px;
  height: 18px;
}

.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.product-info h3 {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px 0;
}

.product-info p {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 5px;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  border: none;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.quantity-controls button:hover:not(:disabled) {
  background: #e0e0e0;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-controls span {
  min-width: 30px;
  text-align: center;
  font-weight: 500;
}

.delete-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.delete-btn:hover {
  background: #ffebee;
  color: #d32f2f;
}

/* Tóm tắt đơn hàng */
.order-summary {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.order-summary h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.discount {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.discount input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.discount button {
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.discount button:hover {
  background: #0056b3;
}

.price-details {
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.options {
  margin-bottom: 20px;
}

.options label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
}

.options input[type="checkbox"] {
  margin-right: 8px;
}

.options textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
}

.terms {
  margin-bottom: 20px;
}

.terms label {
  display: flex;
  align-items: flex-start;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.terms input {
  margin-right: 8px;
  margin-top: 2px;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 15px;
}

.checkout-btn:hover {
  background: #218838;
}

.continue-shopping {
  display: block;
  text-align: center;
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.continue-shopping:hover {
  text-decoration: underline;
}

/* Giỏ hàng trống */
.empty-cart {
  text-align: center;
  background: white;
  border-radius: 8px;
  padding: 60px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-cart h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.empty-cart p {
  color: #666;
  margin-bottom: 30px;
}

.shop-btn {
  display: inline-block;
  padding: 12px 24px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
}

.shop-btn:hover {
  background: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .cart-item {
    grid-template-columns: auto 60px 1fr;
    gap: 10px;
  }
  
  .quantity-controls {
    grid-column: 1 / -1;
    justify-self: start;
    margin-top: 10px;
  }
  
  .delete-btn {
    grid-column: 1 / -1;
    justify-self: end;
    margin-top: 10px;
  }
  
  .cart-container {
    padding: 15px;
  }
}
</style>