<template>
    <UserHeader @select-category="handleCategorySelect"/>   <!--lang nghe su kien select-category--> 
    <SubcateShow v-if="selectedCategory":category="selectedCategory"/>   <!--lưu trạng thái mục đã chọn--> 
    <ProfileDetail/>
    
</template>

<script setup>

import ProfileDetail from '../components/ProfileDetail.vue';
import SubcateShow from '../components/MenuShow.vue';
import UserHeader from '../components/UserHeader.vue';

import {ref} from 'vue';

const selectedCategory = ref(null);
// Toggle: nếu người dùng chọn lại cùng category thì ẩn đi
const handleCategorySelect = (category) => {
  selectedCategory.value = 
    selectedCategory.value === category ? null : category;   //cap nhat selectedCategory voi gia tri duoc chon tu event select-category
};
</script>

