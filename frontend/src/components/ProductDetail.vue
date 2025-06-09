<template>
  <div class="product-container" v-if="productDetail">
    <!-- LEFT: IMAGE -->
    <div class="product-image">
      <img :src="productDetail.image" alt="Product Image" />
    </div>

    <!-- RIGHT: PRODUCT INFO -->
      <div class="product-info">
      <h1 class="product-name">{{ productDetail.jewelry_name }}</h1>

      <span class="product-price">{{ Number(productDetail.jewelry_price).toLocaleString() }}₫</span>

      <!-- COLORS --> 
      <div class="color-options">
        <span v-for="(color, index) in props.color_code"
              :key="index"
              class="color-circle"
              :style="{ backgroundColor: color.color_name }"
              @click="emitColorChange(color.color_id)"
              :class="{ active: color.color_id === props.color_id }">
        </span>
      </div>

      <!-- SIZES -->
      <div class="size-options" v-if="productDetail.sizes && productDetail.sizes.length > 0">
        <div class="size-button"
             v-for="(size, idx) in productDetail.sizes"
             :key="idx">
          <button @click="selectedSize = idx"
                  :class="{ active: selectedSize === idx }">
            Size {{ size.size_number }}
          </button>
          <div v-if="selectedSize === idx">
            <p>Còn lại: {{ size.quantity }}</p>
          </div>
        </div>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="action-buttons">
        <button class="buy-now">Mua ngay</button>
        <button @click.prevent="handleAddToCart" 
        class="add-to-cart"
        :disabled="selectedSize === null">Thêm vào giỏ hàng</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import {ref,onMounted,watch} from 'vue';

const loading = ref(true);
const error = ref(null);
const productDetail = ref(null);
const selectedSize = ref(null);
const user_id = ref(null);
const cartItem = ref(null);
const props =  defineProps({
    jewelry_id: Number,
    color_id: Number,
    color_code: Array
})

const fetchProductDetail = async()=>{
    loading.value = true;
    error.value = null;
    try{
        const response = await fetch(`http://localhost:3000/api/v1/jew/id/${props.jewelry_id}/color/${props.color_id}`);
        if(!response.ok){
            throw new Error('Failed to load product detail')
        }
        console.log('Props nhận được:', props.jewelry_id, props.color_id);

        const data = await response.json();
        const jewelry = data.message;   // result là object k phai mang
        
        productDetail.value = {
                jewelry_name: jewelry.jewelry_name,
                image: jewelry.image,
                jewelry_price: jewelry.jewelry_price,
                color_name: jewelry.color_name,
                sizes: jewelry.sizes,   //mang cac size
                
              }
    }
    catch(err){
        error.value = err.message
    }
    finally{
        loading.value = false
    }
}


const addCart = async() =>{
    try{
        const response = await fetch('http://localhost:3000/api/v1/cart/add',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                user_id: user_id.value,
                jewelry_id: props.jewelry_id,
                color_id: props.color_id,
                size_id: productDetail.value.sizes[selectedSize.value].size_id, //Lấy ra object size được chọn từ mảng
                quantity: 1
            })
    
        })
        if (response.ok){
            const data = await response.json();
            cartItem.value = data
            
            window.alert('Added product to cart!')
        }else{
             throw new Error('Failed to add to cart')
        }
       
    }

    catch(err){
        error.value = err.message
    }
}
function handleAddToCart(){
  addCart();
}
const emit = defineEmits(['update:color_id','get-user']) 
const emitColorChange  = (color_id)=>{
  if(color_id !== props.color_id)   //neu mau bam vao khac mau hien tai
    emit('update:color_id',color_id)
}



onMounted(() => {
  if (props.jewelry_id && props.color_id) {
    fetchProductDetail();
  }
});

watch(()=> [props.jewelry_id,props.color_id], ()=>{
    console.log('Fetching with:', props.jewelry_id, props.color_id); 
    fetchProductDetail();
})

onMounted(() => {
  const storeUser = localStorage.getItem('user');

  if (storeUser) {
    const parsedUser = JSON.parse(storeUser);
    user_id.value = parsedUser.user_id;
  
  }
});
</script>

<style scoped>
.product-container {
  display: flex;
  max-width: 1000px;
  margin: 40px auto;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  gap: 40px;
}

.product-image {
  flex: 1;
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-name {
  font-size: 28px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  line-height: 1.3;
}

.product-price {
  font-size: 24px;
  font-weight: 700;
  color: #e53e3e;
  margin: 0;
}

.color-options {
  display: flex;
  gap: 12px;
  align-items: center;
}

.color-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-circle:hover {
  transform: scale(1.05);
  border-color: #cbd5e0;
}

.color-circle.active {
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
  transform: scale(1.1);
}

.size-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.size-button {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.size-button button {
  padding: 12px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #4a5568;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-button button:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
}

.size-button button.active {
  background: #4299e1;
  border-color: #4299e1;
  color: white;
}

.size-button p {
  font-size: 12px;
  color: #718096;
  margin: 0;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.buy-now,
.add-to-cart {
  flex: 1;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.buy-now {
  background: #4299e1;
  color: white;
}

.buy-now:hover {
  background: #3182ce;
  transform: translateY(-1px);
}

.add-to-cart {
  background: white;
  color: #4299e1;
  border: 2px solid #4299e1;
}

.add-to-cart:hover {
  background: #4299e1;
  color: white;
}

.add-to-cart:disabled {
  background: #f7fafc;
  color: #a0aec0;
  border-color: #e2e8f0;
  cursor: not-allowed;
}

.add-to-cart:disabled:hover {
  background: #f7fafc;
  color: #a0aec0;
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  .product-container {
    flex-direction: column;
    max-width: 95%;
    padding: 24px;
    gap: 24px;
  }
  
  .product-name {
    font-size: 24px;
  }
  
  .product-price {
    font-size: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>