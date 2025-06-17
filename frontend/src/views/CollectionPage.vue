<template>
  <div>
    <div class="product-header">
      <h2>Sản phẩm: {{ route.params.categoryName }}</h2>
    </div>

    <div
      class="product-container"
      v-for="(item, index) in jewelryList"
      :key="item.jewelry_id"
    >
        <div class="product-img">
            <img :src="getImageUrl(item.color_code[item.activeColorIndex].image)" alt="ảnh sản phẩm">
        </div>

        <div class="color-options">
            <span class="color-circle"
            v-for="(color_code,idx) in item.color_code"
            :key="idx"
            :style="{backgroundColor: color_code.color_name}"
            @click="item.activeColorIndex = idx"
            :class="{active:idx === item.activeColorIndex}">
            </span>
        </div>

        <div class="product-name">{{ item.jewelry_name }}</div>
        <div class="product-price"> {{ Number(item.color_code[item.activeColorIndex].jewelry_price).toLocaleString() }}₫</div>
    
    </div>
  </div>
</template>

<script setup>
import { ref, watch} from "vue";
import { useRoute } from "vue-router";

const getImageUrl = (path) => {
  return new URL(path, import.meta.url).href;
};


const jewelryList = ref([]);
const route = useRoute();

const fetchProduct = async () => {
  const categoryName = route.params.categoryName;
  const res = await fetch(
    `http://localhost:3000/api/v1/jew/collection/${categoryName}`);
  if (res.ok) {
    const data = await res.json();

    const productList = data.message;
    const groupProduct = {};

    productList.forEach(jewelry=>{
        const key = jewelry.jewelry_id
        if(!groupProduct[key]){
            groupProduct[key] = {
                jewelry_id: jewelry.jewelry_id,
                jewelry_name: jewelry.jewelry_name,
                activeColorIndex: 0,    //kieu mangs
                color_code: []
            }
        }
        groupProduct[key].color_code.push({
            color_name: jewelry.color_name,
            color_id: jewelry.color_id,
            image: jewelry.image,
            jewelry_price: jewelry.jewelry_price
        })
    })
    jewelryList.value = Object.values(groupProduct);
    console.log('jewelryList: ',productList)
  } else {
    console.error("Lỗi khi load sản phẩm");
  }
};
watch(()=>route.params.categoryName, fetchProduct,{immediate: true});
</script>

<style scoped>
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

</style>
