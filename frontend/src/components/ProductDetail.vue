<template>
  <div class="product-container" v-if="productDetail">
    <!-- LEFT: IMAGE -->
    <div class="product-image">
      <img :src="productDetail.image" alt="Product Image" />
    </div>

    <!-- RIGHT: PRODUCT INFO -->
      <div class="product-info">
      <h1 class="product-name">{{ productDetail.jewelry_name }}</h1>

      <h3 class="product-price">{{ Number(productDetail.jewelry_price).toLocaleString() }}₫</h3>

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
        <button class="add-to-cart">Thêm vào giỏ hàng</button>
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
                sizes: jewelry.sizes   //mang cac size
        }
    }
   
    catch(err){
        error.value = err.message
    }
    finally{
        loading.value = false
    }
}
const emit = defineEmits(['update:color_id']) 
const emitColorChange  = (color_id)=>{
  if(color_id !== props.color_id)   //neu mau bam vao khac mau hien tai
    emit('update:color_id',color_id)
}
onMounted(fetchProductDetail);
watch(()=> [props.jewelry_id,props.color_id], ()=>{
    console.log('Fetching with:', props.jewelry_id, props.color_id); 
    fetchProductDetail();
}
)

</script>

<style scoped>
.product-container {
  display: flex;
  max-width: 80%;
  margin: 30px auto;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  gap: 24px;
}

.product-image img {
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {

  font-weight: 600;
  color: #6a1b9a;
  margin-bottom: 8px;
}

.product-price {
  font-size: 20px;
  font-weight: 500;
  color: #000;
  margin-bottom: 16px;
  display: inline-flex;
}

.color-options {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-circle:hover {
  transform: scale(1.1);
}

.color-circle.active {
  border: 2px solid #6a1b9a;
  box-shadow: 0 0 4px #6a1b9a;
}

.size-options {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.size-button button {
  padding: 6px 12px;
  border: 1px solid #999;
  border-radius: 6px;
  cursor: pointer;
  background: white;
  transition: background 0.2s;
}

.size-button button.active {
  background: #6a1b9a;
  color: white;
}

.size-button p {
  margin-top: 4px;
  font-size: 14px;
  color: #555;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.buy-now {
  background-color: black;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.add-to-cart {
  background-color: white;
  color: black;
  padding: 10px 20px;
  border: 2px solid black;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
</style>
