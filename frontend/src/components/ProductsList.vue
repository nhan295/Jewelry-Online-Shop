<template>
  <div class="sub_cate">

    <p>Total products: {{ productList.length }}</p>
    <div v-if="loading">Loading...</div>
    <div v-if="error">Lỗi: {{ error }}</div>
    <div v-for="(jewelry, index) in productList" :key="jewelry.jewelry_id">
      <a href="#">{{ jewelry.jewelry_name }}</a>
    </div>
  </div>
</template>

<script setup> 
import {ref,onMounted, watch} from 'vue';

const props = defineProps({
    sub_id: Number
});
const productList = ref([]);
const error = ref(null);
const loading = ref([true]);
const fetchProduct = async()=>{
    try{
         console.log('Fetching for sub_id:', props.sub_id); 
        const response = await fetch(`http://localhost:3000/api/v1/jew/sub_category/${props.sub_id}`);
        if(!response.ok){
        throw new Error('Failed to load product');
    }
    const data = await response.json()
    const productData = data.message;
    const newProduct = productData.map((jewelry)=>{
        return {
            jewelry_id: jewelry.jewelry_id,
            jewelry_name: jewelry.jewelry_name,
            jewelry_price: jewelry.jewelry_price,
            jewelry_img: jewelry.jewelry_img,
            jewelry_color: jewelry.color_id

        }
    })
    console.log(productData);
    productList.value = newProduct;
    }   
    catch(err){
        error.value = err.message;
    }
    finally{
        loading.value = false

    }
}
onMounted(fetchProduct)
watch(() => props.sub_id, fetchProduct);



</script>

<style scoped>
.sub_cate a{
    color: black;
}
</style>