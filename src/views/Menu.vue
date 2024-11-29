<template>
  <nav class="navbar">
      <ul>
        <li >
          <a href="/dashboard">Home</a>
        </li>
        <li class="active">
          <a href="/menu">Menu</a>
        </li>
        <li>
          <a href="/about-us">About Us</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
      <!-- Logout Button -->
       <div>
        <a href="/" class="logout">Logout</a>
      </div>
    </nav>
  <div class="menu">
    
    <h1>Menu</h1>

    <!-- Loop through categories -->
    <div v-for="(products, category) in categories" :key="category" class="category">
      <h2>{{ category }}</h2>
      <div class="products">
        <!-- Loop through products for each category -->
        <div v-for="product in products" :key="product.id" class="product-card" @click="goToProductPage(product.id)">
          <!-- Dynamically set image source with full URL -->
          <img :src="`http://localhost:5000${product.image_url}`" :alt="product.name" class="product-image">
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>Price: P{{ product.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      categories: {}, // This will store products grouped by category
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        // Fetch products from your backend API
        const response = await axios.get('http://localhost:5000/api/menu');
        
        // Organize the products into categories
        const groupedCategories = this.groupProductsByCategory(response.data);
        this.categories = groupedCategories;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    groupProductsByCategory(products) {
      const categories = {};

      // Group products by category
      products.forEach(product => {
        if (!categories[product.category]) {
          categories[product.category] = [];
        }
        categories[product.category].push(product);
      });

      return categories;
    },
    goToProductPage(productId) {
      // Navigate to the product page or add to cart logic
      console.log('Product clicked:', productId);
      this.$router.push(`/product/${productId}`); 
    },
    
  },
};
</script>

<style scoped>
/* Menu styles */
.menu {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-family: 'elephant';
  font-weight: 900;
  font-size: 40px;
}

.category {
  margin-bottom: 40px;
}

.category h2 {
  font-size: 1.8em;
  margin-bottom: 20px;
}

.products {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.product-card {
  background-color: #ffb7a1;
  border-radius: 10px;
  overflow: hidden;
  width: 250px;
  padding: 10px;
  text-align: center;
  transition: transform 0.3s ease;
  cursor: pointer; /* Make the entire card clickable */
}

.product-card:hover {
  transform: scale(1.05);
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-info {
  margin-top: 10px;
}

.product-info h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.product-info p {
  font-size: 1em;
  margin-bottom: 20px;
}

.product-info button {
  background-color: #ffb7a1;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.product-info button:hover {
  background-color: #f28268;
}

/* Responsive design */
@media screen and (max-width: 768px) {
  .products {
    flex-direction: column;
    align-items: center;
  }
  
  .product-card {
    width: 80%;
    margin-bottom: 20px;
  }
}

.navbar {
  background-color: #e69182;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.navbar li {
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.navbar li.active {
  background-color: #ffb7a1;
  font-weight: bold;
}

.navbar li:hover {
  background-color: #ffb7a1;
  font-weight: bold;
}

.navbar li a {
  text-decoration: none;
  color: #6b4226;
  font-weight: 900;
  font-size: 18px;
  font-family: 'Arial Narrow Bold', sans-serif;
}

.logout {
  border: none;
  padding: 8px 16px;
  font-size: 1em;
  color: #6b4226;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  font-weight: 900;
  font-size: 18px;
  font-family: 'Arial Narrow Bold', sans-serif;
}

.logout:hover {
  background-color: #ffb7a1;
  font-weight: bold;
}

</style>
