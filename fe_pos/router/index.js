// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Products from '../views/Products.vue';
import AddProductPage from '../views/AddProductPage.vue';

const routes = [
    {
        path: '/',
        name: 'Products',
        component: Products,
    },
    {
        path: '/add-product',
        name: 'AddProductPage',
        component: AddProductPage,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
