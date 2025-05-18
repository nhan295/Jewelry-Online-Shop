<template>
  <div class="product-name" v-if="productDetail">
    <img :src="productDetail.image" alt="">
   <!--chỉ hiển thị khi dữ liệu sản phẩm đã được tải xong -->
      <a href="#">{{ productDetail.jewelry_name }}</a>
      <div class="color-options">
        <span v-for="(color,index) in props.color_code"
        :key="index"
        class="color-circle"
        :style="{backgroundColor: color.color_name}"
        @click="emitColorChange(color.color_id)"
        :class="{active: color.color_id===props.color_id}"
        >
        </span>
      </div>
      <h3>{{ Number(productDetail.jewelry_price).toLocaleString() }}</h3>
   
  </div>
</template>

<script setup>
import {ref,onMounted,watch} from 'vue';

const loading = ref(true);
const error = ref(null);
const productDetail = ref(null);

const props =  defineProps({
    jewelry_id: Number,
    color_id: Number,
    color_code: Array
})

const fetchProductDetail = async()=>{
    loading.value = true;
    error.value = null;
    try{
        const response = await fetch(`http://localhost:3000/api/v1/jew/id/${props.jewelry_id}/color/${props.color_id}`);
        if(!response.ok){
            throw new Error('Failed to load product detail')
        }
        console.log('Props nhận được:', props.jewelry_id, props.color_id);

        const data = await response.json();
        const jewelry = data.message[0];   //??
        
        productDetail.value = {
                jewelry_name: jewelry.jewelry_name,
                image: jewelry.image,
                jewelry_price: jewelry.jewelry_price,
                color_name: jewelry.color_name
        }
       
    }
   
    catch(err){
        error.value = err.message
    }
    finally{
        loading.value = false
    }
}

const emitColorChange  = (color_id)=>{
  if(color_id !== props.color_id)   //neu mau bam vao khac mau hien tai
    emit('update:color_id',color_id)
}
onMounted(fetchProductDetail);
watch(()=> [props.jewelry_id,props.color_id], ()=>{
    console.log('Fetching with:', props.jewelry_id, props.color_id); 
    fetchProductDetail();
}
)

</script>

<style scoped>
.product-name {
  background-color: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 16px auto;
}

.product-name a {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: #6a1b9a;
  text-decoration: none;
  margin-bottom: 10px;
}

.product-name a:hover {
  text-decoration: underline;
}

.color-options {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-circle {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-circle:hover {
  transform: scale(1.1);
}

.color-circle.active {
  border: 2px solid #6a1b9a;
  box-shadow: 0 0 4px #6a1b9a;
}

h2 {
  font-size: 20px;
  color: #000;
  margin-top: 10px;
}
</style>
