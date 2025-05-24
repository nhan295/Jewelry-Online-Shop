<template>
    
    
</template>

<script setup>
import {ref,onMounted} from 'vue';

const error = ref(null);
const loading = ref(false);
const message = ref(null);
const jewelry_name = ref(null);
const color_name = ref(null);
const size_number = ref(null);
const quanntity = ref(null);
const jewelry_img = ref(null);

const props = defineProps({
    user_id: Number
})

const getCartItem = async()=>{
    try{
        const response = await fetch(`http://localhost:3000/api/v1/cart/user/${props.user_id}`)
        const data = response.json();
        if(response.ok){
            jewelry_name.value = data.jewelry_name;
            color_name.value  = data.color_name;
            size_number.value = data.size_number;
            quanntity.value = data.quanntity;
            jewelry_img.value = data.jewelry_img  
        }
    }
    catch(err){
        message.value = "Failed to load cart item";
        console.error(err);
    }
}
onMounted(()=>{
    getCartItem();
})

</script>