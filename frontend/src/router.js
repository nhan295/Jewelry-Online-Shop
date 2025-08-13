import {createRouter, createWebHistory} from 'vue-router'

import index from './views/index.vue';
import MainPage from './views/MainPage.vue';
import ProfilePage from './views/ProfilePage.vue';
import BrowsePage from './views/BrowsePage.vue';
import CartPage from './views/CartPage.vue';
import CollectionPage from './components/Collection.vue';

const routes = [
    {path: '/', component: index},
    // {path: '/', component: BrowsePage},
    {path: '/homepage', component: MainPage},
    {path: '/profile', component: ProfilePage},
    {path: '/cart',component: CartPage},
    {path: '/product/collection/:categoryName',component: CollectionPage}
   

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;