<template>
    <div class="products-wrapper">
        <div class="product-card" v-for="(jewelry, index) in productList" :key="jewelry.jewelry_id">
            <div class="product-image">
                <img :src="jewelry.jewelry_img" alt="jewelry image">
            </div>

            <div class="color-options">
                <span class="color-circle" style="background-color: #d9a679;"></span>
                <span class="color-circle" style="background-color: #ccc;"></span>
            </div>

            <div class="product-name">
                <a href="#">{{ jewelry.jewelry_name }}</a>
            </div>

            <div class="product-price">
                {{ Number(jewelry.jewelry_price).toLocaleString() }}₫
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

    productList.value = productData.map(jewelry => ({
      jewelry_id: jewelry.jewelry_id,
      jewelry_name: jewelry.jewelry_name,
      jewelry_price: jewelry.jewelry_price,
      jewelry_img: jewelry.jewelry_img,
      jewelry_color: jewelry.color_id
    }));
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

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

.sale-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #d21f3c;
    color: white;
    font-weight: bold;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 3px;
}

.like-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 16px;
    color: #999;
    cursor: pointer;
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
