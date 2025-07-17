<template>
  <div>
    <div class="product-header">
      <h2>Sản phẩm: {{ route.params.categoryName }}</h2>
    </div>

    <div class="main-container">
      <!-- Left Filter Panel -->
      <div class="filter-panel">
        <h3>Bộ lọc sản phẩm</h3>
        
        <!-- Price Filter -->
        <div class="filter-section">
          <h4>Lọc theo giá</h4>
          <div class="price-filter">
            <input 
              type="number" 
              v-model="filters.minPrice" 
              placeholder="Giá từ"
              class="price-input"
            >
            <span>-</span>
            <input 
              type="number" 
              v-model="filters.maxPrice" 
              placeholder="Giá đến"
              class="price-input"
            >
          </div>
        </div>

        <!-- Color Filter -->
        <div class="filter-section">
          <h4>Lọc theo màu</h4>
          <div class="color-filter">
            <label v-for="color in availableColors" :key="color" class="color-label">
              <input 
                type="checkbox" 
                :value="color" 
                v-model="filters.selectedColors"
              >
              <span 
                class="color-preview" 
                :style="{backgroundColor: color}"
              ></span>
              {{ color }}
            </label>
          </div>
        </div>

        <!-- Clear Filters Button -->
        <button @click="clearFilters" class="clear-btn">Xóa bộ lọc</button>
      </div>

      <!-- Right Product Grid -->
      <div class="product-section">
        <div class="product-grid">
          <div
            class="product-card"
            v-for="(item, index) in filteredJewelryList"
            :key="item.jewelry_id"
          >
            <div class="product-img">
              <img :src="getImageUrl(item.color_code[item.activeColorIndex].image)" alt="ảnh sản phẩm">
            </div>

            <div class="color-options">
              <span 
                class="color-circle"
                v-for="(color_code, idx) in item.color_code"
                :key="idx"
                :style="{backgroundColor: color_code.color_name}"
                @click="item.activeColorIndex = idx"
                :class="{active: idx === item.activeColorIndex}"
              >
              </span>
            </div>

            <div class="product-name">{{ item.jewelry_name }}</div>
            <div class="product-price">
              {{ Number(item.color_code[item.activeColorIndex].jewelry_price).toLocaleString() }}₫
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

const getImageUrl = (path) => {
  return new URL(path, import.meta.url).href;
};

const jewelryList = ref([]);
const route = useRoute();

// Filter state
const filters = ref({
  minPrice: null,
  maxPrice: null,
  selectedColors: []
});

// Get available colors for filter
const availableColors = computed(() => {
  const colors = new Set(); 
  jewelryList.value.forEach(item =>{
    item.color_code.forEach(color=>{
      colors.add(color.color_name)
    })
  })
  return Array.from(colors)

});

// Filtered jewelry list
const filteredJewelryList = computed(() => {
  return jewelryList.value.filter(item=>{
    const currentPrice = Number(item.color_code[item.activeColorIndex].jewelry_price)

    // lọc theo giá
    if(filters.value.minPrice && currentPrice < filters.value.minPrice)  // loại bỏ giá thấp hơn
      return false;
    if(filters.value.maxPrice && currentPrice > filters.value.maxPrice)  // loại bỏ giá cao hơn
      return false;

    // lọc theo màu
    if(filters.value.selectedColors.length > 0){
      const hasSelectedColor = item.color_code.some(color=>{
        return filters.value.selectedColors.includes(color.color_name)
      })
      if (!hasSelectedColor){
        return false;
      }
    }
    return true;
  })
});

// Clear all filters
const clearFilters = () => {
  filters.value = {
    minPrice: null,
    maxPrice: null,
    selectedColors: []
  };
};

const fetchProduct = async () => {
  const categoryName = route.params.categoryName;
  const res = await fetch(
    `http://localhost:3000/api/v1/jew/collection/${categoryName}`);
  if (res.ok) {
    const data = await res.json();

    const productList = data.message;
    const groupProduct = {};

    productList.forEach(jewelry => {
      const key = jewelry.jewelry_id
      if(!groupProduct[key]) {
        groupProduct[key] = {
          jewelry_id: jewelry.jewelry_id,
          jewelry_name: jewelry.jewelry_name,
          activeColorIndex: 0,
          color_code: []
        }
      }
      groupProduct[key].color_code.push({
        color_name: jewelry.color_name,
        color_id: jewelry.color_id,
        image: jewelry.image,
        jewelry_price: jewelry.jewelry_price
      })
    })
    jewelryList.value = Object.values(groupProduct);
    console.log('jewelryList: ', productList)
  } else {
    console.error("Lỗi khi load sản phẩm");
  }
};

watch(() => route.params.categoryName, fetchProduct, { immediate: true });
</script>

<style scoped>
.product-header {
  background-color: #f5f5f5;
  width: 100%;
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.main-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

/* Filter Panel Styles */
.filter-panel {
  width: 280px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  height: fit-content;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-panel h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.filter-section {
  margin-bottom: 25px;
}

.filter-section h4 {
  margin-bottom: 15px;
  color: #555;
  font-size: 16px;
}

.price-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.price-input {
  width: 90px;
  max-width: 90px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  box-sizing: border-box;
}

.price-input:focus {
  outline: none;
  border-color: #007bff;
}

.price-filter span {
  color: #666;
  font-weight: 500;
  flex-shrink: 0;
}

.color-filter {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.color-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.color-label:hover {
  background-color: #f8f9fa;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.clear-btn {
  width: 100%;
  padding: 10px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.clear-btn:hover {
  background-color: #5a6268;
}

/* Product Section Styles */
.product-section {
  flex: 1;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.product-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.product-img {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 6px;
  margin-bottom: 15px;
  background-color: #f8f9fa;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.color-options {
  margin: 15px 0;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.color-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
}

.color-circle:hover {
  transform: scale(1.1);
}

.color-circle.active {
  border-color: #007bff;
  border-width: 3px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.4;
}

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #e74c3c;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  
  .filter-panel {
    width: 100%;
  }
  
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
  
  .price-filter {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .price-input {
    width: 100%;
    max-width: 100%;
  }
}
</style>