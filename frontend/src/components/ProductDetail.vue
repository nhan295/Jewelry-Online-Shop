<template>
        <div class="product-image">
    
      </div> 
      <div class="product-name">
         <div v-for="(jewelry, index) in productDetail" :key="jewelry.jewelry_id">
      <a href="#" >{{ jewelry.jewelry_name }}</a>
      <div class="color-options">
        <span
          class="color-circle"
          :style="{ backgroundColor: jewelry.color_name }"    
        ></span>  <!--lấy màu theo index cập nhật vào activeColorIndex-->
      </div>
      <h2>{{ jewelry.jewelry_price }}</h2>
      
    </div>
      </div>
</template>


<script setup>
import {ref,onMounted,watch} from 'vue';
const loading = ref([true]);
const error = ref([null]);
const productDetail = ref([]);

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
        const newDetail = data.message;
        
        const newDetailList = newDetail.map((jewelry)=>{
            return{
                jewelry_name: jewelry.jewelry_name,
                jewelry_img: jewelry.jewelry_img,
                jewelry_price: jewelry.jewelry_price,
                color_name: jewelry.color_name
            }
        })
        console.log(newDetail)
        productDetail.value = newDetailList
    }
   
    catch(err){
        error.value = err.message
    }
    finally{
        loading.value = false
    }
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
}

h2 {
  font-size: 20px;
  color: #000;
  margin-top: 10px;
}



</style>