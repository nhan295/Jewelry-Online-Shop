<template>
    <div>
      <UserHeader @search-input="handleSearch"
      @get-user="handleAddCart"
      @select-category="handleCategory"/>   <!--lang nghe su kien select-category-->
      
      <MenuShow  @select-subcate = "handleSubcate" v-if="selectedCategory":category="selectedCategory"/>    <!--lưu trạng thái mục đã chọn-->
      <!-- <MainProduct v-if="!selectedSubcate && !searchProduct && !selectedProduct && showMainProduct"/> -->
      <ProductsList @select-product="handleProductDetail" v-if="selectedSubcate":sub_id="selectedSubcate"/>   <!--selectSub=5 <=> props.sub_id=5-->
      <SearchResult v-if="searchProduct":jewelry_name="searchProduct"/>
      <ProductDetail   v-if="selectedProduct"
        :jewelry_id="selectedProduct.jewelry_id"
        v-model:color_id="selectedProduct.color_id"
        :color_code="selectedProduct.color_code"/>
       <!-- v-model để nhận ra sự thay đổi của props(color_id) -->
      <ShowCart v-if="addCart" :key="addCart" :user_id="addCart"  />

    </div>

</template>

<script setup>

import MenuShow from '../components/MenuShow.vue';
import UserHeader from '../components/UserHeader.vue';
import ProductsList from '../components/ProductsList.vue';
import SearchResult from '../components/SearchResult.vue';
import ProductDetail from '../components/ProductDetail.vue';
import MainProduct from '../components/MainProduct.vue';
import ShowCart from '../components/ShowCart.vue';
import {ref,watch,onMounted} from 'vue';

const showMainProduct = ref(true);

const selectedCategory = ref(null);
// Toggle: nếu người dùng chọn lại cùng category thì ẩn đi
const handleCategory = (category) => {
  selectedCategory.value = 
    selectedCategory.value === category ? null : category;   //cap nhat selectedCategory voi gia tri duoc chon tu event select-category
};

const selectedSubcate = ref(null);
const handleSubcate = (sub_id) =>{
  selectedSubcate.value = sub_id
  selectedProduct.value = null;
  searchProduct.value = null;
  addCart.value = null;
};

const searchProduct = ref(null);
const handleSearch = (jewelry_name) =>{
  searchProduct.value = jewelry_name;
  selectedCategory.value = null;
  selectedSubcate.value = null;
  selectedProduct.value = null
};

const selectedProduct = ref(null);
const handleProductDetail = ({jewelry_id, color_id,color_code})=>{  //nhận 1 object rồi destructure
  selectedProduct.value = {
    jewelry_id,
    color_id,
    color_code
  }
  selectedCategory.value = null;
  selectedSubcate.value = null;
};

const addCart = ref(null);

const handleAddCart = (user_id)=>{
  console.log('User ID for cart:', user_id);
    addCart.value = user_id
    showMainProduct.value = false
}
watch(addCart, (val) => {
  console.log('addCart changed to:', val)
})

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    if (parsed.user_id) {
      addCart.value = parsed.user_id; // ✅ gán user_id ngay khi mount
      console.log('Khởi tạo addCart với user_id:', parsed.user_id);
    }
  }
});

</script>

