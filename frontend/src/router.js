import {createRouter, createWebHistory} from 'vue-router'

import index from './views/index.vue';
import MainPage from './views/MainPage.vue';


const routes = [
    {path: '/index', component: index},
    {path: '/', component: MainPage}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;