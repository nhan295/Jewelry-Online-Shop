<template>

</template>

<script setup>
import {ref,onMounted,watch} from 'vue';


const loading = ref(true);
const error = ref(null);
const props = defineProps({
    jewelry_id: Number,
    color_id: Number,
    size_id: Number

})

const addCart = async() =>{
    try{
        const response = await fetch('http://localhost:3000/api/v1/cart/add',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                jewelry_id: props.jewelry_id,
                color_id: props.color_id,
                size_id: props.size_id
            })
    
        })
        if (response.ok){
            const data = await response.json();
            console.log('Added to cart',data)
        }
        throw new Error('Failed to add to cart')
    }

    catch(err){
        error.value = err.message
    }
}
onMounted(addCart);
watch(()=>[props.jewelry_id,props.color_id,props.size_id])

</script>