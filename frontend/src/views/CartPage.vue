<template>
   
    <UserHeader/>
    <ProductDetail @add-cart="handleAddCart"/>
    <Cart v-if="addCart"
    :user_id="addCart.user_id"
    :jewelry_id="addCart.jewelry_id"
    :color_id="addCart.color_id"
    :size_id="addCart.size_id"
    :quantity="addCart.quantity"/>
</template>

<script setup>

import {ref} from 'vue';

import ProductDetail from '../components/ProductDetail.vue';
import Cart from '../components/Cart.vue';
import UserHeader from '../components/UserHeader.vue';

const addCart = ref(null);
const handleAddCart = ({user_id,jewelry_id,color_id,size_id,quantity})=>{
  addCart.value = {
    user_id,
    jewelry_id,
    color_id,
    size_id,
    quantity
  }
  console.log('Gửi vào Cart:', addCart.value);
}


</script>