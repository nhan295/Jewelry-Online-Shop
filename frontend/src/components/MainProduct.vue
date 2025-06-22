<template>
  <div class="banner-img">
    <img :src="bannerImg[currentBanner]" alt="banner" class="banner-img" />
  </div>

  <div class="chain-jewelry">
    <div class="item">
      <img src="/assets/banner/vongtay.webp" alt="Vòng tay" />
      <router-link :to="`/product/collection/vong`">VÒNG TAY</router-link>
    </div>
    <div class="item">
      <img src="/assets/banner/nhan.webp" alt="Nhẫn" />
      <router-link :to="`/product/collection/nhan`">NHẪN</router-link>
    </div>
    <div class="item">
      <img src="/assets/banner/hoatai.webp" alt="Hoa tai" />
      <router-link :to="`/product/collection/hoatai`">HOA TAI</router-link>
    </div>
    <div class="item">
      <img src="/assets/banner/daychuyen.webp" alt="Dây chuyền" />
    <router-link :to="`/product/collection/daychuyen`">DÂY CHUYỀN</router-link>
    </div>
  </div>

  <div class="product-highlight">
    <div class="left-highlight">
      <h2>LẤP LÁNH TỪNG KHOẢNH KHẮC</h2>
    </div>

    <div class="right-highlight">
      <div class="left-col">
        <div class="left-item">
          <img src="/assets/banner/block1.webp" alt="Block 1" />
          <a href="#"></a>
        </div>
        <div class="left-item">
          <img src="/assets/banner/block3.webp" alt="Block 3" />
          <a href="#"></a>
        </div>
      </div>
      <div class="right-col">
        <div class="right-item">
          <img src="/assets/banner/block4.webp" alt="Block 2" />
          <a href="#"></a>
        </div>
        <div class="right-item">
          <img src="/assets/banner/block2.webp" alt="Block 4" />
          <a href="#"></a>
        </div>
      </div>
    </div>
  </div>

  <div class="suggest-product">
    <h2>GỢI Ý CHO BẠN</h2>
    <div class="suggest-nav">
      <button class="arrow-btn left" @click="scrollLeft" :disabled="currentIndex === 0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      
      <div class="product-list-wrapper" ref="productWrapper">
        <div class="product-list" 
             :style="{ transform: `translateX(-${currentIndex * slideWidth}px)` }">
          <div class="product-card" v-for="(jewelry, index) in products" :key="jewelry.jewelry_id">
            <div class="product-img">
              <img :src="jewelry.color_code[jewelry.ActiveColorIndex].image" alt="">  
            </div>
            <div class="color-options">
              <span
                class="color-circle"
                v-for="(color_code,idx) in jewelry.color_code"
                :key="idx"
                :style="{ backgroundColor: color_code.color_name }"
                @click="jewelry.ActiveColorIndex = idx"
                :class="{active: idx === jewelry.ActiveColorIndex}"
              >
              </span>
            </div>

            <div class="product-name">
              <a href="#"
                @click.prevent="selectedProduct(jewelry.jewelry_id, jewelry.color_code[jewelry.ActiveColorIndex].color_id, jewelry.color_code)">
                {{ jewelry.jewelry_name }}
              </a>
            </div>

            <div class="product-price">
              {{ Number(jewelry.color_code[jewelry.ActiveColorIndex].jewelry_price).toLocaleString() }}₫
            </div>
          </div>
        </div>
      </div>
      
      <button class="arrow-btn right" @click="scrollRight" :disabled="currentIndex >= maxIndex">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
        </svg>
      </button>
    </div>
    
    <!-- Dots indicator -->
    <div class="dots-container">
      <span v-for="(dot, index) in totalDots" 
            :key="index"
            class="dot"
            :class="{ active: index === Math.floor(currentIndex / itemsPerSlide) }"
            @click="goToSlide(index)">
      </span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, nextTick } from 'vue';
import {ref, onMounted, computed} from 'vue';


import { useRouter } from 'vue-router';



const bannerImg = [
    '/assets/banner/banner1.webp',
    '/assets/banner/banner2.webp',
    '/assets/banner/banner3.webp'
]

const currentBanner = ref(0)
const products = ref([]);
const currentIndex = ref(0);
const productWrapper = ref(null);

// Slider configuration
const itemsPerSlide = ref(4); // Số sản phẩm hiển thị mỗi lần
const slideWidth = computed(() => {
  // Tính toán độ rộng mỗi slide dựa trên kích thước màn hình
  if (typeof window !== 'undefined') {
    if (window.innerWidth <= 640) return 280; // Mobile: 1 item
    if (window.innerWidth <= 900) return 320; // Tablet: 2-3 items  
    if (window.innerWidth <= 1200) return 350; // Desktop small: 3 items
    return 380; // Desktop large: 4 items
  }
  return 380;
});

const maxIndex = computed(() => {
  return Math.max(0, products.value.length - itemsPerSlide.value);
});

const totalDots = computed(() => {
  return Math.ceil(products.value.length / itemsPerSlide.value);
});

let intervalId = null;

onMounted(async () => {
    // Banner rotation
    intervalId = setInterval(() => {
        currentBanner.value = (currentBanner.value + 1) % bannerImg.length
    }, 2000);
    
    // Get jewelry data
    await getAllJew();
    console.log('Fetching all jewelry data...');
    
    // Update items per slide based on window size
    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
});

onBeforeMount(() => {
    clearInterval(intervalId);
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateItemsPerSlide);
    }
});

const updateItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
        if (window.innerWidth <= 640) {
            itemsPerSlide.value = 1;
        } else if (window.innerWidth <= 900) {
            itemsPerSlide.value = 2;
        } else if (window.innerWidth <= 1200) {
            itemsPerSlide.value = 3;
        } else {
            itemsPerSlide.value = 4;
        }
    }
};

const getAllJew = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/jew/all');
    if (!response.ok) {
      throw new Error('Failed to fetch jewelry data');
    }
    const data = await response.json();
    const jewelryData = data.message;

    const groupJewelry = {};

    jewelryData.forEach(jewelry => {
      const key = jewelry.jewelry_id;
      if (!groupJewelry[key]) {
        groupJewelry[key] = {
          jewelry_id: jewelry.jewelry_id,
          jewelry_name: jewelry.jewelry_name,
          ActiveColorIndex: 0,
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
    
    products.value = Object.values(groupJewelry);
  } catch (err) {
    console.error('Error fetching all jewelry:', err);
  }
}

const emits = defineEmits(['show-product']);
const selectedProduct = (jewelry_id, color_id, color_code) => {   // hiển thị chi tiết sản phẩm
  emits('show-product', {jewelry_id, color_id, color_code});
  console.log('Selected product:', { jewelry_id, color_id, color_code });

}

// Slider functions
function scrollLeft() {
  if (currentIndex.value > 0) {
    currentIndex.value = Math.max(0, currentIndex.value - itemsPerSlide.value);
  }
}

function scrollRight() {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value = Math.min(maxIndex.value, currentIndex.value + itemsPerSlide.value);
  }
}

function goToSlide(dotIndex) {
  currentIndex.value = Math.min(dotIndex * itemsPerSlide.value, maxIndex.value);
}

// Auto scroll (optional)
const startAutoScroll = () => {
  return setInterval(() => {
    if (currentIndex.value >= maxIndex.value) {
      currentIndex.value = 0;
    } else {
      scrollRight();
    }
  }, 4000);
};

// Uncomment below if you want auto scroll
let autoScrollInterval = null;
onMounted(() => {
  autoScrollInterval = startAutoScroll();
});
onBeforeMount(() => {
  if (autoScrollInterval) clearInterval(autoScrollInterval);
});
</script>

<style scoped>
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

body {
  margin: 0;
}
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

/* SUGGEST PRODUCT SECTION - IMPROVED SLIDER */
.suggest-product {
  padding: 80px 20px 60px;
  background: linear-gradient(135deg, var(--warm-beige) 0%, var(--secondary-gold) 100%);
  text-align: center;
}

.suggest-product h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 40px;
  letter-spacing: -0.02em;
}

.suggest-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.product-list-wrapper {
  overflow: hidden;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.product-list {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  gap: 30px;
}

.product-card {
  flex: 0 0 auto;
  width: 280px;
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px var(--shadow-soft);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px var(--shadow-medium);
}

.product-img {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  background: var(--soft-gray);
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img img {
  transform: scale(1.05);
}

.color-options {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.color-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.color-circle:hover {
  transform: scale(1.1);
  border-color: var(--primary-gold);
}

.color-circle.active {
  border-color: var(--primary-gold);
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.3);
}

.product-name {
  margin-bottom: 12px;
}

.product-name a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  transition: color 0.3s ease;
  display: block;
}

.product-name a:hover {
  color: var(--primary-gold);
}

.product-price {
  color: var(--primary-gold);
  font-weight: 600;
  font-size: 18px;
}

.arrow-btn {
  background: var(--primary-gold);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px var(--shadow-soft);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.arrow-btn:disabled {
  background: #e0e0e0;
  color: #aaa;
  cursor: not-allowed;
  transform: none;
}

.arrow-btn:hover:not(:disabled) {
  background: var(--soft-brown);
  transform: scale(1.1);
  box-shadow: 0 6px 20px var(--shadow-medium);
}

.arrow-btn svg {
  transition: transform 0.2s ease;
}

.arrow-btn:hover:not(:disabled) svg {
  transform: translateX(2px);
}

.arrow-btn.left:hover:not(:disabled) svg {
  transform: translateX(-2px);
}

/* Dots indicator */
.dots-container {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 30px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--primary-gold);
  transform: scale(1.2);
}

.dot:hover {
  background: var(--primary-gold);
}

/* Responsive Design */
@media (max-width: 1400px) {
  .product-list {
    gap: 25px;
  }
  .product-card {
    width: 260px;
  }
}

@media (max-width: 1200px) {
  .product-list {
    gap: 20px;
  }
  .product-card {
    width: 240px;
  }
  .suggest-nav {
    gap: 15px;
  }
}

@media (max-width: 900px) {
  .product-card {
    width: 280px;
  }
  .product-list {
    gap: 15px;
  }
  .chain-jewelry {
    gap: 60px;
  }
  .left-highlight h2 {
    font-size: 2rem;
    margin-right: 30px;
  }
}

@media (max-width: 640px) {
  .suggest-product {
    padding: 60px 10px 40px;
  }
  
  .suggest-product h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
  }
  
  .product-card {
    width: 260px;
  }
  
  .product-list {
    gap: 10px;
  }
  
  .arrow-btn {
    width: 40px;
    height: 40px;
  }
  
  .chain-jewelry {
    gap: 30px;
    padding: 40px 10px 30px;
  }
  
  .chain-jewelry .item {
    flex-basis: 120px;
    padding: 15px;
  }
  
  .product-highlight {
    flex-direction: column;
    text-align: center;
  }
  
  .left-highlight h2 {
    font-size: 1.8rem;
    margin-right: 0;
    margin-bottom: 30px;
  }
  
  .right-highlight {
    justify-content: center;
  }
  
  .left-item img, .right-item img {
    width: 250px;
  }
}

@media (max-width: 480px) {
  .product-card {
    width: 240px;
    padding: 15px;
  }
  
  .product-img {
    height: 160px;
  }
  
  .chain-jewelry {
    gap: 20px;
  }
  
  .left-item img, .right-item img {
    width: 200px;
  }
}
</style>