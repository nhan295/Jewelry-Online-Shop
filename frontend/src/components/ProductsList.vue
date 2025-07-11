<template>
  <div class="products-wrapper">
    <div
      class="product-card"
      v-for="(jewelry, index) in productList"       
      :key="index"
    >  <!--sản phẩm đã gộp theo màu -->
      <div class="product-image">
        <img :src="jewelry.color_code[jewelry.activeColorIndex].image"
        alt="jewelry image" />
      </div> <!--hiển thị ảnh của màu hiện tại-->

      <div class="color-options">
        <span
          class="color-circle"
          v-for="(color_code, idx) in jewelry.color_code"
          :key="idx"
          :style="{ backgroundColor: color_code.color_name }"    
          @click="jewelry.activeColorIndex = idx"
          :class="{ active:idx === jewelry.activeColorIndex }"
        ></span>  <!--lấy màu theo index cập nhật vào activeColorIndex-->
      </div>

      <div class="product-name">
       <a href="" @click.prevent="selectedProduct(jewelry.jewelry_id, jewelry.color_code[jewelry.activeColorIndex].color_id, jewelry.color_code)">
        {{ jewelry.jewelry_name }}
       </a>
      </div>

      <div class="product-price">
        {{ Number(jewelry.color_code[jewelry.activeColorIndex].jewelry_price).toLocaleString() }}₫
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  sub_id: Number,
});
const productList = ref([]);
const error = ref(null);
const loading = ref(true);

const fetchProduct = async () => {
  if (!props.sub_id) return;

  loading.value = true;
  try {
    console.log('Fetching for sub_id:', props.sub_id);
    const response = await fetch(`http://localhost:3000/api/v1/jew/sub_category/${props.sub_id}`);
    if (!response.ok) {
      throw new Error('Failed to load product');
    }
    const data = await response.json();
    const productData = data.message;

    const groupProduct = {};
    
    productData.forEach(jewelry=>{
        const key = jewelry.jewelry_id   
        if(!groupProduct[key]){
            groupProduct[key] = {
                jewelry_id: jewelry.jewelry_id,
                jewelry_name: jewelry.jewelry_name,
                activeColorIndex: 0,    //kieu mangs
                color_code: []
            }
        }
        groupProduct[key].color_code.push({   //tách sp theo từng mã màu mỗi mã theo thứ tự activeColorIndex
            color_name: jewelry.color_name,
            color_id: jewelry.color_id,
            image: jewelry.image,
            jewelry_price: jewelry.jewelry_price
        });
    });
    productList.value = Object.values(groupProduct);
    console.log('productData:', productData);

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const emits = defineEmits(['select-product'])

const selectedProduct = (jewelry_id,color_id,color_code)=>{   
  emits('select-product',{jewelry_id,color_id,color_code})   

  console.log('Clicked:', { jewelry_id, color_id,color_code});
}

watch(() => props.sub_id, fetchProduct, { immediate: true });
</script>

<style scoped>
.products-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: flex-start;
    margin-top: 20px;
}

.product-card {
    width: calc((100% - 48px) / 4);
    border: 1px solid #eee;
    padding: 12px;
    border-radius: 8px;
    position: relative;
    background: #fff;
}

.product-image {
    position: relative;
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
}

.product-name {
    font-weight: bold;
    margin-top: 10px;
    font-size: 14px;
}
.product-name a{
    text-decoration: none;
}

.product-price {
    font-size: 16px;
    color: #d21f3c;
    font-weight: bold;
    margin-top: 4px;
}
</style>