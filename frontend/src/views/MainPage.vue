<template>
    <UserHeader @search-input="handleSearch" @select-category="handleCategorySelect"/>   <!--lang nghe su kien select-category--> 
    <MenuShow  @select-subcate = "handleSubcate" v-if="selectedCategory":category="selectedCategory"/>    <!--lưu trạng thái mục đã chọn--> 
    <ProductsList v-if="selectedSubcate":sub_id="selectedSubcate"/>
    <SearchResult v-if="selectProduct":jewelry_name="selectProduct"/>

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

const selectProduct = ref(null);
const handleSearch = (jewelry_name) =>{
  selectProduct.value = jewelry_name;
  selectedCategory.value = null;
  selectedSubcate.value = null;
}
</script>

