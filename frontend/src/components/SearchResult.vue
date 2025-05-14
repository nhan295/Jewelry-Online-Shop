<template>
    <h1>{{ jewelry_name }}</h1>
</template>

<script setup> 
import {ref, onMounted} from 'vue'
const props = defineProps({
    jewelry_name: String
})

const loading = ref([true]);
const error = ref[(null)];
const searchList = ref([]);

const fetchProduct = async() =>{
    try{
        const response = await fetch(`http://localhost:3000/api/v1/jew/search/${props.jewelry_name}`);
        if (!response.ok){
            throw new Error('Faile to load search result');
        }
        const data = await response.json()
        const List = data.message; 

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
onMounted(fetchProduct)
</script>