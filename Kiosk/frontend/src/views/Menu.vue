<template>
  <nav class="navbar">
    <ul>
      <li>
        <a :href="`/`">Home</a>
      </li>
      <li class="active">
        <a :href="`/menu`">Menu</a>
      </li>
    </ul>
    <div class="nav-icons">
      <a :href="`/cart`" class="cart-icon">
        <i class="fas fa-shopping-cart"></i>
      </a>
      <a :href="`/user-profile`">{{ username }}</a>
      <a href="/" class="logout">Logout</a>
    </div>
  </nav>

  <div class="menu">
    <div v-for="(products, category) in categories" :key="category" class="category">
      <h2>{{ category }}</h2>
      <div class="product-slider-container">
        <div class="products">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
            @click="goToProductPage(product.id)"
          >
            <img :src="`http://localhost:5000${product.image_url}`" :alt="product.name" class="product-image">
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p>Price: ₱ {{ product.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      categories: {},
      username: "",
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:5000/api/menu");
        this.categories = this.groupProductsByCategory(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    groupProductsByCategory(products) {
      return products.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
      }, {});
    },
    goToProductPage(productId) {
      this.$router.push(`/product/${productId}`);
    },
  },
};
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 20px;
}

.navbar a {
  color: #fff;
  text-decoration: none;
}

.navbar .active a {
  font-weight: bold;
  color: #00f;
}

.nav-icons {
  display: flex;
  gap: 15px;
}

.menu {
  padding: 20px;
  overflow-y: auto; /* Enable vertical scrolling */
}

.category h2 {
  margin-top: 20px;
}

.menu {
  padding: 20px;
  overflow-y: auto; /* Enable vertical scrolling */
  max-height: 100vh; /* Prevents overflow beyond the viewport */
}

.product-slider-container {
  position: relative;
  /* Removed overflow: hidden */
}

.products {
  display: flex;
  gap: 20px;
  overflow-x: scroll; /* Horizontal scrolling for products */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* Enhance touch scrolling */
}

.products::-webkit-scrollbar {
  display: none; /* Hide scrollbar */
}

.products::-webkit-scrollbar {
  display: none; /* Hide scrollbar */
}

.product-card {
  flex: 0 0 auto;
  width: 220px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-info {
  text-align: center;
}

@media (max-width: 768px) {
  .product-card {
    width: 180px;
  }
}
</style>


