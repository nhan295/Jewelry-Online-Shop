<template>
  <div class="show-result">
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="error">Lỗi: {{ error }}</div>
    <div v-else>
      <h1> Search result for word "{{ jewelry_name }}"</h1>
      <div v-if="searchList.length" class="grid-container">
        <div v-for="(jewelry, item) in searchList" :key="item" class="product-card">
          <div class="product-image">
            <img :src="jewelry.color_code[jewelry.activeColorIndex].jewelry_img" alt="ảnh"/>
          </div>

          <div class="color-options">
            <span 
              class="color-circle"
              v-for="(color_code, index) in jewelry.color_code" 
              :key="index"
              :style="{backgroundColor: color_code.color_name}"
              @click="jewelry.activeColorIndex = index"
              :class="{active: index === jewelry.activeColorIndex }"
            ></span>
          </div>
           
          <div class="product-name">
            <a href="#">{{ jewelry.jewelry_name }}</a>
          </div>

          <div class="product-price">
            {{ Number(jewelry.color_code[jewelry.activeColorIndex].jewelry_price).toLocaleString() }}₫
          </div>    
        </div>
      </div>
      <div v-else>Không tìm thấy sản phẩm nào.</div>
    </div>
  </div>
</template> 

<script setup> 
import {ref, onMounted,watch} from 'vue'
const props = defineProps({
    jewelry_name: String
})

const loading = ref(true);
const error = ref(null);
const searchList = ref([]);

const fetchProduct = async() =>{

    try{
        const response = await fetch(`http://localhost:3000/api/v1/jew/search/${props.jewelry_name}`);
        if (!response.ok){
            throw new Error('Faile to load search result');
        }
        const data = await response.json();
        const List = data.jewelry;
        const groupSearchProduct = {};

        List.forEach(jewelry =>{
          const key = jewelry.jewelry_name
          if(!groupSearchProduct[key]){
            groupSearchProduct[key] = {
              jewelry_name: jewelry.jewelry_name,
              jewelry_price: jewelry.jewelry_price,
              activeColorIndex: 0,
              color_code: []
            }
          }
          groupSearchProduct[key].color_code.push({
            color_name: jewelry.color_name,
            jewelry_img: jewelry.jewelry_img,
            jewelry_price: jewelry.jewelry_price
          })
        })
        searchList.value = Object.values(groupSearchProduct)
      }
    catch(err){
        error.value = err.message;
    }
    finally{
        loading.value = false;
    }
}
onMounted(fetchProduct);
watch(() => props.jewelry_name, fetchProduct);
</script>

<style scoped>
.show-result {
  margin-top: 20px;
}

/* Grid để hiển thị 4 sản phẩm mỗi dòng */
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.product-card {
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
}

.product-image {
  text-align: center;
}

.product-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.color-options {
  margin-top: 10px;
}

.color-circle {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-right: 6px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.color-circle.active {
  border: 2px solid #000;
}

.product-name {
  font-weight: bold;
  margin-top: 10px;
  font-size: 14px;
}

.product-name a {
  text-decoration: none;
  color: #333;
}

.product-price {
  font-size: 16px;
  color: #d21f3c;
  font-weight: bold;
  margin-top: 4px;
}
</style>