<template>
  <div class="cart-container">
    <div class="cart-header">
      <h2>🛒 Giỏ hàng của bạn ({{ totalCartItem }}) sản phẩm</h2>
    </div>

    <div v-if="cart.length" class="main-layout">
      <!-- Cột trái: Danh sách sản phẩm -->
      <div class="left-column">
        <div class="cart-items-container">
          <div v-for="(item, index) in cart" :key="index" class="cart-item">
            <!-- Ảnh sản phẩm -->
            <div class="product-image-wrapper">
              <img :src="item.image" alt="product" class="product-img" />
            </div>

            <!-- Thông tin sản phẩm -->
            <div class="product-info">
              <h3 class="product-name">{{ item.jewelry_name }}</h3>
              <div class="product-specs">
                <span class="spec-item">
                  Color: {{ item.color_name }}
                </span>
                <span class="spec-item">
                  Size: {{ item.size_number }}
                </span>
              </div>
            </div>

            <!-- Giá và điều khiển -->
            <div class="product-controls">
              <div class="price-section">
                <div class="current-price">
                  {{ Number(item.jewelry_price).toLocaleString() }}₫
                </div>
                <div v-if="item.old_price" class="old-price">
                  {{ Number(item.old_price).toLocaleString() }}₫
                </div>
              </div>

              <div class="quantity-section">
                <div class="quantity-controls">
                  <button 
                    @click="decreaseQty(index)" 
                    class="qty-btn"
                    :disabled="item.quantity <= 1"
                  >
                    −
                  </button>
                  <span class="qty-display">{{ item.quantity }}</span>
                  <button @click="increaseQty(index)" class="qty-btn">+</button>
                </div>
              </div>

              <button @click="delCartItem(item)" class="delete-btn">
                <i class="delete-icon">🗑️</i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột phải: Tóm tắt đơn hàng -->
      <div class="right-column">
        <div class="order-summary">
          <h3 class="summary-title">Đơn hàng</h3>

          <!-- Mã giảm giá -->
          <div class="discount-section">
            <label class="section-label">Mã giảm giá</label>
            <div class="discount-input-group">
              <input 
                type="text" 
                placeholder="Nhập mã giảm giá" 
                class="discount-input"
              />
              <button class="apply-btn">Áp dụng</button>
            </div>
          </div>

          <!-- Chi tiết giá -->
          <div class="price-breakdown">
            <div class="price-row">
              <span>Sản phẩm ({{ totalCartItem }} món)</span>
              <span>{{ Number(totalCartPrice).toLocaleString() }}₫</span>
            </div>
            <div class="price-row">
              <span>Khuyến mãi</span>
              <span class="discount-amount">-0₫</span>
            </div>
          </div>

          <!-- Tùy chọn -->
          <div class="options-section">
            <label class="checkbox-wrapper">
              <input type="checkbox" class="checkbox" />
              <span class="checkmark"></span>
              <span class="checkbox-label">Xuất hóa đơn</span>
            </label>

            <textarea 
              placeholder="Ghi chú đơn hàng (tùy chọn)" 
              class="order-note"
              rows="3"
            ></textarea>
          </div>

          <!-- Tổng cộng -->
          <div class="total-section">
            <div class="total-row">
              <span class="total-label">Tổng cộng:</span>
              <span class="total-amount">{{ Number(totalCartPrice).toLocaleString() }}₫</span>
            </div>
          </div>

          <!-- Điều khoản -->
          <div class="terms-section">
            <label class="checkbox-wrapper small">
              <input type="checkbox" class="checkbox" />
              <span class="checkmark"></span>
              <span class="checkbox-label">
                Tôi đồng ý với 
                <a href="#" class="terms-link">Điều khoản dịch vụ</a>
                của Pandora Việt Nam
              </span>
            </label>
          </div>

          <!-- Nút thanh toán -->
          <button class="checkout-btn">
            <span class="btn-text">Thanh toán</span>
            <span class="btn-icon">→</span>
          </button>

          <router-link to="/userpage" class="continue-shopping">
            ← Tiếp tục mua sắm
          </router-link>
        </div>
      </div>
    </div>

    <!-- Giỏ hàng trống -->
    <div v-else class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h3>Giỏ hàng đang trống</h3>
      <p>Hãy thêm một số sản phẩm tuyệt vời vào giỏ hàng của bạn!</p>
      <router-link to="/userpage" class="shop-now-btn">
        Mua sắm ngay
      </router-link>
    </div>

    <div v-if="message" class="error-message">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";

const error = ref(null);
const loading = ref(false);
const message = ref(null);
const cart = ref([]);

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
      cart.value = data.item || [];
      console.log("Cart items fetched:", cart.value);
    } else {
      cart.value = [];
      message.value = data.message || "Không thể tải giỏ hàng";
    }
  } catch (err) {
    cart.value = [];
    message.value = "Không thể kết nối đến máy chủ.";
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
      window.alert("Đã xoá khỏi giỏ hàng");
      await getCartItem();
    } else {
      alert(data.message);
    }
  } catch (err) {
    error.value = err.message;
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

const totalCartPrice = computed(() => {
  return cart.value.reduce(
    (total, item) => total + item.jewelry_price * item.quantity,
    0
  );
});

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
* {
  box-sizing: border-box;
}

.cart-container {
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.cart-header {
  text-align: center;
  margin-bottom: 32px;
}

.cart-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;
}

/* Cột trái - Danh sách sản phẩm */
.left-column {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  overflow: hidden;
}

.cart-items-container {
  padding: 24px;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  padding: 24px 0;
  border-bottom: 1px solid #e2e8f0;
  align-items: center;
  transition: all 0.3s ease;
}

.cart-item:hover {
  background: #f7fafc;
  margin: 0 -24px;
  padding: 24px;
  border-radius: 12px;
}

.cart-item:last-child {
  border-bottom: none;
}

.product-image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cart-item:hover .product-img {
  transform: scale(1.05);
}

.product-info {
  min-width: 0;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.product-specs {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #718096;
}

.product-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
  min-width: 140px;
}

.price-section {
  text-align: right;
}

.current-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
}

.old-price {
  font-size: 0.9rem;
  color: #a0aec0;
  text-decoration: line-through;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  background: #f7fafc;
  border-radius: 25px;
  padding: 4px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.qty-btn:hover:not(:disabled) {
  background: #4299e1;
  color: white;
  transform: scale(1.1);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-display {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.delete-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #fed7d7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #feb2b2;
  transform: scale(1.1);
}

.delete-icon {
  font-size: 1.1rem;
}

/* Cột phải - Tóm tắt đơn hàng */
.right-column {
  position: sticky;
  top: 20px;
}

.order-summary {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.summary-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.section-label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.discount-section {
  margin-bottom: 24px;
}

.discount-input-group {
  display: flex;
  gap: 8px;
}

.discount-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.discount-input:focus {
  outline: none;
  border-color: #4299e1;
}

.apply-btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.apply-btn:hover {
  transform: translateY(-2px);
}

.price-breakdown {
  padding: 20px 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.price-row:last-child {
  margin-bottom: 0;
}

.discount-amount {
  color: #48bb78;
  font-weight: 600;
}

.options-section {
  margin-bottom: 24px;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  font-size: 0.9rem;
}

.checkbox-wrapper.small {
  font-size: 0.8rem;
  margin-bottom: 0;
}

.checkbox {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e0;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 1px;
}

.checkbox:checked + .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkbox:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  line-height: 1.4;
}

.order-note {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.order-note:focus {
  outline: none;
  border-color: #4299e1;
}

.total-section {
  padding: 20px 0;
  border-top: 2px solid #e2e8f0;
  margin-bottom: 20px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
}

.total-amount {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d3748;
}

.terms-section {
  margin-bottom: 24px;
}

.terms-link {
  color: #4299e1;
  text-decoration: none;
  font-weight: 600;
}

.terms-link:hover {
  text-decoration: underline;
}

.checkout-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.checkout-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.checkout-btn:hover .btn-icon {
  transform: translateX(4px);
}

.continue-shopping {
  display: block;
  text-align: center;
  color: #718096;
  text-decoration: none;
  font-weight: 500;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.continue-shopping:hover {
  background: #f7fafc;
  color: #4299e1;
}

/* Giỏ hàng trống */
.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}


.empty-cart h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 12px;
}

.empty-cart p {
  color: #718096;
  margin-bottom: 32px;
  font-size: 1.1rem;
}

.shop-now-btn {
  display: inline-block;
  padding: 14px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.shop-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .cart-item {
    grid-template-columns: 1fr;
    gap: 16px;
    text-align: center;
  }
  
  .product-controls {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .cart-container {
    padding: 16px;
  }
  
  .cart-header h2 {
    font-size: 2rem;
  }
}
</style>