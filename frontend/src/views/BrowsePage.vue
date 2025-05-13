<!-- Người dùng chưa đăng nhập -->

<template>
    <XiesxiesHeader @select-category="handleCategorySelect"/>   <!--lang nghe su kien select-category--> 
    <MenuShow  @select-subcate = "handleSubcate" v-if="selectedCategory":category="selectedCategory"/>   <!--lưu trạng thái mục đã chọn--> 
    
    <ProductsList v-if="selectedSubcate":sub_id="selectedSubcate"/>
</template>

<script setup>
import XiesxiesHeader from '@/components/XiesxiesHeader.vue';
import MenuShow from '../components/MenuShow.vue';
import ProductsList from '../components/ProductsList.vue';
import {ref} from 'vue';
const selectedCategory = ref(null);
// Toggle: nếu người dùng chọn lại cùng category thì ẩn đi
const handleCategorySelect = (category) => {
  selectedCategory.value = 
    selectedCategory.value === category ? null : category;   //cap nhat selectedCategory voi gia tri duoc chon tu event select-category
};
const selectedSubcate = ref(null);
const handleSubcate = (sub_id) =>{
  selectedSubcate.value = sub_id
}
</script>

