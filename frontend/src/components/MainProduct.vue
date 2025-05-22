<template>
  <div class="banner-img">
    <img :src="bannerImg[currentBanner]" alt="banner" class="banner-img" />
  </div>

  <div class="chain-jewelry">
    <div class="item">
      <img :src="vongtay" alt="Vòng tay" />
      <a href="">VÒNG TAY</a>
    </div>
    <div class="item">
      <img :src="nhan" alt="Nhẫn" />
      <a href="">NHẪN</a>
    </div>
    <div class="item">
      <img :src="hoatai" alt="Hoa tai" />
      <a href="">HOA TAI</a>
    </div>
    <div class="item">
      <img :src="daychuyen" alt="Dây chuyền" />
      <a href="">DÂY CHUYỀN</a>
    </div>
  </div>
</template>


<script setup>
import { onBeforeMount } from 'vue';
import {ref, onMounted} from 'vue';
import vongtay from '../assets/banner/vongtay.webp'
import nhan from '../assets/banner/nhan.webp'
import hoatai from '../assets/banner/hoatai.webp'
import daychuyen from '../assets/banner/daychuyen.webp'
const bannerImg = [
    '../src/assets/banner/banner1.webp',
    '../src/assets/banner/banner2.webp',
    '../src/assets/banner/banner3.webp'

]
const currentBanner = ref(0)  // Track which image is currently being displayed (the position in the array)
let intervalId = null;
onMounted(()=>{
    intervalId = setInterval(() => {
        currentBanner.value = (currentBanner.value + 1)% bannerImg.length
    }, 2000);
})

onBeforeMount(()=>{
    clearInterval(intervalId)
})


</script>

<style scoped>
.banner-img{
    width: 100%;
}
.chain-jewelry {
  display: flex;
  justify-content: center;
  gap: 40px; /* khoảng cách giữa các item */
  margin: auto;
  padding-top: 40px;
  width: 100%;
  flex-wrap: wrap; /* cho responsive nếu màn nhỏ */
}

.chain-jewelry .item {
  text-align: center;
  flex-basis: 150px; /* chiều rộng mỗi item */
}

.chain-jewelry img {
  width: 100%;       /* ảnh chiếm toàn bộ chiều rộng item */
  max-width: 160px;  /* ảnh không to quá */
  height: auto;
}

.chain-jewelry a {
  display: block;
  margin-top: 12px;
  color: #222;
  font-weight: 600;
  text-decoration: none;
  font-size: 16px;
  letter-spacing: 1px;
}

</style>