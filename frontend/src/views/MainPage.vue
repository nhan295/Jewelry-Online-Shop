<template>
    <UserHeader @select-category="handleCategorySelect"/>   <!--lang nghe su kien select-category--> 
    <MenuShow  @select-subcate = "handleSubcate" v-if="selectedCategory":category="selectedCategory"/>    <!--lưu trạng thái mục đã chọn--> 
    <ProductsList v-if="selectedSubcate":sub_id="selectedSubcate"/>
    <SearchResult/>

</template>

<script setup>

import MenuShow from '../components/MenuShow.vue';
import UserHeader from '../components/UserHeader.vue';
import ProductsList from '../components/ProductsList.vue';
import SearchResult from '../components/SearchResult.vue';

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

const search_input = ref(null);
const hanldeSearch = (jewelry_name) =>{
  selectProduct.value = jewelry_name
}
</script>

