<template>
  <MainProduct
    @show-product="handleProductDetail"
    v-if="!selectedSubcate && !searchProduct && !selectedProduct"
  />
  <ProductDetail
    v-if="selectedProduct"
    :jewelry_id="selectedProduct.jewelry_id"
    v-model:color_id="selectedProduct.color_id"
    :color_code="selectedProduct.color_code"
  />
</template>

<script setup>
import MainProduct from "../components/MainProduct.vue";
import ProductDetail from "../components/ProductDetail.vue";
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedProduct = ref(null);

const handleProductDetail = ({jewelry_id, color_id, color_code}) => {
  selectedProduct.value = {
    jewelry_id,
    color_id,
    color_code
  };
  
  // Nếu muốn thay đổi URL, thêm vào đây
  router.push('/product/detail');
};
</script>
