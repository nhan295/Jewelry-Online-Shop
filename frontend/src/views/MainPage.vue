<template>
    <XiesxiesHeader @select-category="handleCategorySelect"/>   <!--lang nghe su kien select-category--> 
    <subcateShow v-if="selectedCategory":category="selectedCategory"/>   <!--lưu trạng thái mục đã chọn--> 
</template>

<script setup>
import XiesxiesHeader from '@/components/XiesxiesHeader.vue';
import subcateShow from '../components/subcateShow.vue';
import {ref} from 'vue';

const selectedCategory = ref(null);
// Toggle: nếu người dùng chọn lại cùng category thì ẩn đi
const handleCategorySelect = (category) => {
  selectedCategory.value = 
    selectedCategory.value === category ? null : category;
};
</script>

//cap nhat selectedCategory voi gia tri duoc chon tu event select-category