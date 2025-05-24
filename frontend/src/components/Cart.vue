
<template>
  <div v-if="cartItem" class="cart-item">
    <h3>Đã thêm vào giỏ hàng:</h3>
    <pre>{{ cartItem }}</pre> <!-- Debug xem chứa gì -->

    <p><strong>Sản phẩm:</strong> {{ cartItem.jewelry_name }}</p>
    <p><strong>Màu sắc:</strong> {{ cartItem.color_name }}</p>
    <p><strong>Kích cỡ:</strong> {{ cartItem.size_number }}</p>
    <p><strong>Số lượng:</strong> {{ cartItem.quantity }}</p>
    <img :src="cartItem.image" alt="">
  </div>

  <div v-else-if="loading">Đang thêm vào giỏ hàng...</div>
  <div v-else-if="error" class="error">Lỗi: {{ error }}</div>
</template>



<script setup>
import {ref,onMounted,watchEffect} from 'vue';

const cartItem = ref(null);
const loading = ref(false);
const error = ref(null);
const props = defineProps({
    user_id: Number,
    jewelry_id: Number,
    color_id: Number,
    size_id: Number,
    quantity: Number

})

const addCart = async() =>{
    try{
        const response = await fetch('http://localhost:3000/api/v1/cart/add',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                user_id: props.user_id,
                jewelry_id: props.jewelry_id,
                color_id: props.color_id,
                size_id: props.size_id,
                quantity: props.quantity
            })
    
        })
        if (response.ok){
            const data = await response.json();
            cartItem.value = data
            console.log('Added to cart',data)
        }else{
             throw new Error('Failed to add to cart')
        }
       
    }

    catch(err){
        error.value = err.message
    }
}
onMounted(() => {
  console.log('Cart nhận:', props.user_id,props.jewelry_id, props.color_id, props.size_id, props.quantity);
});

import { watch } from 'vue';

watchEffect(() => {
  if (props.jewelry_id && props.color_id && props.size_id && props.quantity) {
    console.log('Calling addCart() from watchEffect');
    addCart();
  }
});




</script>