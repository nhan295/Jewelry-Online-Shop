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

  <div class="product-highlight">
    <div class="left-highlight">
      <h2>LẤP LÁNH TỪNG KHOẢNH KHẮC</h2>
    </div>

    <div class="right-highlight">
      <div class="left-col">
        <div class="left-item">
          <img :src="block3" alt="Block 1" />
          <a href="#"></a>
        </div>
        <div class="left-item">
          <img :src="block1" alt="Block 3" />
          <a href="#"></a>
        </div>
      </div>
      <div class="right-col">
        <div class="right-item">
          <img :src="block2" alt="Block 2" />
          <a href="#"></a>
        </div>
        <div class="right-item">
          <img :src="block4" alt="Block 4" />
          <a href="#"></a>
        </div>
      </div>
    </div>
  </div>

  <div class="suggest-product">
    <h2>GỢI Ý CHO BẠN</h2>
    <div class="product-list">
      <div class="product-card" v-for="(jewelry,index) in products" :key="index">
        <div class=product-img>
          <img :src="jewelry.color_code[jewelry.ActiveColorIndex].image" alt="">  
        </div>
        <div class="color-options">
          <span
          class="color-circle"
          v-for="(color_code,idx) in jewelry.color_code"
          :key="idx"
          :style="{ backgroundColor: color_code.color_name }"
          @click="jewelry.ActiveColorIndex = idx"
          :class="{acitive: idx === jewelry.ActiveColorIndex}"
          >
          </span>
        </div>

        <div class="product-name">
          
          <!-- <a href="#"
            @click.prevent="selectedProduct(jewelry.jewelry_id, jewelry.color_code[jewelry.ActiveColorIndex].color_id, jewelry.color_code)">
            {{ jewelry.jewelry_name }}
        </a> -->
          <router-link to="/product/detail"
            @click.prevent="selectedProduct(jewelry.jewelry_id, jewelry.color_code[jewelry.ActiveColorIndex].color_id, jewelry.color_code)">{{ jewelry.jewelry_name }}
          </router-link>
        </div>

        <div class="product-price">
          {{ Number(jewelry.color_code[jewelry.ActiveColorIndex].jewelry_price).toLocaleString() }}₫
        </div>
      </div>
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
import block1 from '../assets/banner/block1.webp'
import block2 from '../assets/banner/block2.webp'   
import block3 from '../assets/banner/block3.webp'
import block4 from '../assets/banner/block4.webp'

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
    }, 2000),
    getAllJew();
    console.log('Fetching all jewelry data...');
})

onBeforeMount(()=>{
    clearInterval(intervalId)
})
const products = ref([]);
const getAllJew = async()=>{
  try{
    const response = await fetch('http://localhost:3000/api/v1/jew/all');
    if(!response.ok){
      throw new Error('Failed to fetch jewelry data');
    }
    const data = await response.json();
    const jewelryData = data.message;

    const groupJewelry = {};

    jewelryData.forEach(jewelry=>{
      const key = jewelry.jewelry_id;
      if(!groupJewelry[key]){
        groupJewelry[key] = {
          jewelry_id: jewelry.jewelry_id,
          jewelry_name: jewelry.jewelry_name,
          ActiveColorIndex: 0, // Initialize active color index
          color_code: []
        }
      }
      groupJewelry[key].color_code.push({
        color_id: jewelry.color_id,
        color_name: jewelry.color_name,
        image: jewelry.image,
        jewelry_price: jewelry.jewelry_price
      })
    });
    products.value = Object.values(groupJewelry)

  }catch(err){
    return console.error('Error fetching all jewelry:', err);
  }

}
const emits = defineEmits(['show-product']);
const selectedProduct = (jewelry_id,color_id,color_code)=>{
  emits('show-product', {jewelry_id, color_id, color_code});
  console.log('Selected product:', { jewelry_id, color_id, color_code });
}
</script>

<style scoped>
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

/* CSS Variables cho màu sắc hài hòa */
:root {
  --primary-gold: #D4AF37;
  --secondary-gold: #F4E4BC;
  --warm-beige: #F8F5F0;
  --soft-brown: #8B7355;
  --dark-brown: #5D4E37;
  --cream-white: #FEFCF8;
  --soft-gray: #F0F0F0;
  --accent-rose: #E8C5C5;
  --text-primary: #3C3C3C;
  --text-secondary: #6B6B6B;
  --shadow-soft: rgba(0, 0, 0, 0.08);
  --shadow-medium: rgba(0, 0, 0, 0.12);
}

/* Global styles */
* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
  color: var(--text-primary);
}

.banner-img {
  width: 100%;
  border-radius: 0 0 24px 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px var(--shadow-soft);
}

.banner-img img {
  width: 100%;
  height: auto;
  transition: transform 0.6s ease;
}

.banner-img:hover img {
  transform: scale(1.02);
}

.chain-jewelry {
  display: flex;
  justify-content: center;
  gap: 114px;
  margin: auto;
  padding: 60px 20px 40px;
  width: 100%;
  flex-wrap: wrap;
  background: linear-gradient(135deg, var(--cream-white) 0%, var(--warm-beige) 100%);
}

.chain-jewelry .item {
  text-align: center;
  flex-basis: 150px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}

.chain-jewelry .item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px var(--shadow-medium);
  background: rgba(255, 255, 255, 0.9);
}

.chain-jewelry img {
  width: 100%;
  max-width: 160px;
  height: auto;
  border-radius: 12px;
  filter: brightness(1.05) contrast(1.1);
  transition: filter 0.3s ease;
}

.chain-jewelry img:hover {
  filter: brightness(1.1) contrast(1.15);
}

.chain-jewelry a {
  display: block;
  margin-top: 16px;
  color: var(--text-primary);
  font-weight: 500;
  text-decoration: none;
  font-size: 15px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  transition: color 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.chain-jewelry a:hover {
  color: var(--primary-gold);
}

.product-highlight {
  display: flex;
  justify-content: center;
  margin-top: 60px;
  padding: 40px 20px;
  background: var(--cream-white);
}

.left-highlight h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-right: 60px;
  text-align: center;
  align-self: center;
  line-height: 1.2;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--primary-gold) 0%, var(--soft-brown) 100%);
  background-clip: text;
}

.right-highlight {
  display: flex;
  gap: 20px;
}

.left-col, .right-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.left-item, .right-item {
  border-radius: 20px;
  padding: 0;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 8px 32px var(--shadow-soft);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: white;
}

.left-item:hover, .right-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px var(--shadow-medium);
}

.left-item img, .right-item img {
  width: 300px;
  height: auto;
  transition: transform 0.4s ease;
}

.left-item:hover img, .right-item:hover img {
  transform: scale(1.05);
}

.suggest-product {
  padding: 80px 20px;
  background: linear-gradient(135deg, var(--warm-beige) 0%, var(--secondary-gold) 100%);
}

.suggest-product h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 50px;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.product-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 20px var(--shadow-soft);
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px var(--shadow-medium);
}

.product-img {
  margin-bottom: 20px;
  border-radius: 16px;
  overflow: hidden;
  background: var(--soft-gray);
}

.product-img img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-img img {
  transform: scale(1.08);
}

.color-options {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 0 10px;
}

.color-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--soft-gray);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 8px var(--shadow-soft);
}

.color-circle:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 16px var(--shadow-medium);
}

.color-circle.active {
  border: 3px solid var(--primary-gold);
  box-shadow: 0 0 16px rgba(212, 175, 55, 0.4);
  transform: scale(1.1);
}

.color-circle.active::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: var(--primary-gold);
  border-radius: 50%;
  opacity: 0.8;
}

.product-name {
  margin-bottom: 12px;
}

.product-name a,
.product-name router-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  transition: color 0.3s ease;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
}

.product-name a:hover,
.product-name router-link:hover {
  color: var(--primary-gold);
}

.product-price {
  color: var(--primary-gold);
  font-size: 18px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 900px) {
  .chain-jewelry {
    gap: 40px;
    padding: 40px 15px 30px;
  }
  
  .left-highlight h2 {
    font-size: 2rem;
    margin-right: 30px;
    margin-bottom: 30px;
  }
  
  .right-highlight {
    flex-direction: column;
    gap: 15px;
  }
  
  .left-col, .right-col {
    flex-direction: row;
    gap: 15px;
    justify-content: center;
  }
  
  .left-item img, .right-item img {
    width: 250px;
  }
  
  .suggest-product {
    padding: 60px 15px;
  }
  
  .suggest-product h2 {
    font-size: 1.8rem;
  }
  
  .product-list {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .chain-jewelry {
    gap: 30px;
  }
  
  .chain-jewelry .item {
    flex-basis: 120px;
    padding: 15px;
  }
  
  .chain-jewelry img {
    max-width: 120px;
  }
  
  .chain-jewelry a {
    font-size: 13px;
    margin-top: 12px;
  }
  
  .left-highlight h2 {
    font-size: 1.6rem;
    margin-right: 0;
    margin-bottom: 25px;
  }
  
  .left-col, .right-col {
    flex-direction: column;
    gap: 15px;
  }
  
  .left-item img, .right-item img {
    width: 200px;
  }
  
  .product-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>