<template>
  <div class="sub_cate" v-if="showSubCate">
    <div v-for="(categories, index) in cateLists" :key="categories.sub_id">
      <a href="#" @click.prevent="selectedSubId(categories.sub_id)">{{ categories.sub_name }}</a>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  //nhan gia tri tu component cha qua category
  category: String,
});

const cateLists = ref([]);
const loading = ref([true]);
const error = ref([null]);
const showSubCate = ref(true);
const fetchSubCate = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/jew/category/${props.category}`
    );
    if (!response.ok) {
      throw new Error("Failed to load sub_categories");
    }
    const data = await response.json();
    const cateList = data.message;

    const newcateList = cateList.map((categories) => {
      //error
      return {
        sub_id: categories.sub_id,
        sub_name: categories.sub_name,
      };
    });
    console.log(cateList);
    cateLists.value = newcateList; //gán dữ liệu đã lọc vào cateList
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const emit = defineEmits(['select-subcate']);  
const selectedSubId = (sub_id) => {
  emit('select-subcate',sub_id) 
  showSubCate.value = false;
}


onMounted(fetchSubCate);
watch(() => props.category, fetchSubCate); //Theo dõi sự thay đổi của props.category, và mỗi khi nó thay đổi thì gọi hàm fetchSubCate để cập nhật dữ liệu
</script>

<style scoped>
a {
  color: #3e3e3e;
  padding-left: 35px;
  text-decoration: none;
  font-size: larger;
  font-family: 'Roboto';
  font-weight: bold;
}
.sub_cate {
  position: absolute;
  width: 100vw;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 999;
}
</style>
