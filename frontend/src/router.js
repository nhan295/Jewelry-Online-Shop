import {createRouter, createWebHistory} from 'vue-router'

import index from './views/index.vue';
import MainPage from './views/MainPage.vue';
import UserHeader from './components/UserHeader.vue';
import XiesxiesHeader from './components/XiesxiesHeader.vue';
import BrowsePage from './views/BrowsePage.vue';


const routes = [
    {path: '/index', component: index},
    {path: '/', component: BrowsePage},
    {path: '/userpage', component: MainPage}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;