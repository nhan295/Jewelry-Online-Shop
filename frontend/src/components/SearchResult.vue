<template>
  <div class="show_result">
    <h1 style="color: black;">Kết quả tìm kiếm cho: "{{ jewelry_name }}"</h1>

    <div v-if="loading">Đang tải...</div>
    <div v-else-if="error">Lỗi: {{ error }}</div>
    <div v-else>
      <div v-if="searchList.length">
        <div v-for="item in searchList" :key="item.jewelry_name" class="item">
          <img :src="item.jewelry_img" alt="ảnh" width="100" />
          <p>{{ item.jewelry_name }} - {{ item.jewelry_price }} VND</p>
        </div>
      </div>
      <div v-else>Không tìm thấy sản phẩm nào.</div>
    </div>
  </div>
</template> 

<script setup> 
import {ref, onMounted,watch} from 'vue'
const props = defineProps({
    jewelry_name: String
})

const loading = ref(true);
const error = ref(null);
const searchList = ref([]);


const fetchProduct = async() =>{

    try{
        const response = await fetch(`http://localhost:3000/api/v1/jew/search/${props.jewelry_name}`);
        if (!response.ok){
            throw new Error('Faile to load search result');
        }
        const data = await response.json();
        const List = data.jewelry; 

        const newSearchList = List.map((jewelry)=>{
            return{
                jewelry_name: jewelry.jewelry_name,
                jewelry_img: jewelry.jewelry_img,
                jewelry_price: jewelry.jewelry_price,
            }
        });
        searchList.value = newSearchList
    }
    catch(err){
        error.value = err.message;
    }
    finally{
        loading.value = false;
    }
}
onMounted(fetchProduct);
watch(() => props.jewelry_name, fetchProduct);
</script>