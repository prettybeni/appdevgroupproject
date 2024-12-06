import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: () => import( '../views/Register.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import( '../views/Home.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import( '../views/Admin.vue')
  },
  {
    path: '/admin/addProd',
    name: 'addProd',
    component: () => import( '../views/addProd.vue')
  },
  {
    path: '/admin/products',
    name: 'manage',
    component: () => import( '../views/Manage.vue')
  },
  {
    path: '/verify',
    name: 'verify',
    component: () => import( '../views/Verify.vue')
  },
  {
    path: '/cashier',
    name: 'cashier',
    component: () => import( '../views/Cashier.vue')
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import( '../views/Reset.vue')
  },
  {
    path: '/new-password/:token',
    name: 'new-password',
    component: () => import( '../views/NewPassword.vue')
  },
  {
    path: '/password-changed',
    name: 'changed',
    component: () => import( '../views/Success.vue')
  },
  {
    path: '/admin/addIngredient',
    name: 'addIngredient',
    component: () => import( '../views/addIngredient.vue')
  },
  {
    path: '/admin/manageIngredients',
    name: 'manageIngredient',
    component: () => import( '../views/manageIngredient.vue')
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => import( '../views/Menu.vue')
  },
  {
    path: '/product/:productId',
    name: 'product',
    component: () => import( '../views/product.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import( '../views/cart.vue')
  },
  {
    path: '/user-profile',
    name: 'user-profile',
    component: () => import( '../views/userProfile.vue')
  },
  {
    path: '/admin/archived-ingredients',
    name: 'delete-ingredient',
    component: () => import( '../views/deleteIngredient.vue')
  },
  {
    path: '/admin/archived-products',
    name: 'delete-product',
    component: () => import( '../views/deleteProduct.vue')
  },
  {
    path: '/admin/addItem',
    name: 'addItem',
    component: () => import( '../views/addItem.vue')
  },
  {
    path: '/admin/manageItem',
    name: 'manageItem',
    component: () => import( '../views/manageItem.vue')
  },
  {
    path: '/admin/deleteItem',
    name: 'deleteItem',
    component: () => import( '../views/deleteItem.vue')
  },
  {
    path: '/admin/viewUsers',
    name: 'users',
    component: () => import( '../views/users.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
