import {createRouter, createWebHistory} from 'vue-router'

import index from './views/index.vue';
import MainPage from './views/MainPage.vue';
import ProfilePage from './views/ProfilePage.vue';
import BrowsePage from './views/BrowsePage.vue';
import CartPage from './views/CartPage.vue';


const routes = [
    {path: '/index', component: index},
    {path: '/', component: BrowsePage},
    {path: '/userpage', component: MainPage},
    {path: '/profile', component: ProfilePage},
    {path: '/cart/:user_id',component: CartPage, props: true},

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;