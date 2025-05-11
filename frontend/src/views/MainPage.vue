<template>
    <XiesxiesHeader @select-category="handleCategorySelect"/>   <!--lang nghe su kien select-category--> 
    <subcateShow v-if="selectedCategory":category="selectedCategory"/>   <!--lưu trạng thái mục đã chọn--> 
</template>

<script setup>
import XiesxiesHeader from '@/components/XiesxiesHeader.vue';
import subcateShow from '../components/subcateShow.vue';
import {ref} from 'vue';

const selectedCategory = ref(null);
const handleCategorySelect = (category) =>{
    selectedCategory.value = category         //cap nhat selectedCategory voi gia tri duoc chon tu event select-category
}
</script>

