<template>
  <nav class="navbar">
      <ul>
        <li >
          <a :href="`/dashboard?token=${token}`">Home</a>
        </li>
        <li class="active">
          <a :href="`/menu?token=${token}`">Menu</a>
        </li>
        <li>
          <a :href="`/aboout-us?token=${token}`">About Us</a>
        </li>
        <li>
          <a :href="`/contact?token=${token}`">Contacts</a>
        </li>
      </ul>
      <div class="nav-icons">
        <a :href="`/cart?token=${token}`" class="cart-icon">
          <i class="fas fa-shopping-cart"></i> <!-- FontAwesome cart icon -->
        </a>
      <!-- Logout Button -->
        <a href="/" class="logout">Logout</a>
      </div>
    </nav>
  <div class="menu">

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
            <p>Price: ₱ {{ product.price }}</p>
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
      token: '', // Store token here
    };
  },
  mounted() {
  this.getTokenFromUrl(); // Populate the token from the URL
  this.fetchProducts();
  
},

  methods: {
    

    getTokenFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      this.token = urlParams.get('token');
      console.log('Received token:', this.token);
    },

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
  console.log('Product clicked:', productId);
  this.$router.push(`/product/${productId}/?token=${this.token}`);
},

    
  },
};
</script>

<style>
/* General styles */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  font-family: Arial, sans-serif;
}

#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* Navbar styles */
.navbar {
  background-color: rgba(228, 213, 188, 0.9);
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap; /* Prevent items from wrapping */
}

.nav-icons {
  display: flex;
  align-items: center;
}

.cart-icon {
  margin-right: 20px;
  font-size: 1.5em;
  color: #000;
  text-decoration: none;
}

.cart-icon:hover {
  color: #422e05;
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
  background-color: #ffffff82;
  font-weight: bold;
}

.navbar li:hover {
  background-color: #ffffff82;
  font-weight: bold;
}

.navbar li a {
  text-decoration: none;
  color: #000000;
}

/* Logout Button */
.logout {
  border: none;
  padding: 8px 16px;
  font-size: 1em;
  color: #000000;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
}

.logout:hover {
  background-color: #ffffff8e;
  font-weight: bold;
}
/* Menu section */
.menu {
  padding: 20px;
  flex: 1;
  background-color: rgb(255, 255, 255);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-family: 'Arial', sans-serif;
  font-weight: 900;
  font-size: 40px;
}

.category {
  margin-bottom: 40px;
}

.category h2 {
  font-size: 1.8em;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
}

/* Product grid styles */
.products {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.product-card {
  background-color: #eeede07d;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  width: 220px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 10px;
}

.product-info h3 {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.product-info p {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 10px;
}

.price-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.price {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
}

/* Responsive design */

/* For tablets (max-width: 1024px) */
@media screen and (max-width: 1024px) {
  h1 {
    font-size: 32px;
  }

  .category h2 {
    font-size: 1.5em;
  }

  .products {
    gap: 15px;
  }

  .product-card {
    width: 180px;
    padding: 10px;
  }

  .product-info h3 {
    font-size: 1.1em;
  }

  .product-info p {
    font-size: 0.85em;
  }

  .price {
    font-size: 1em;
  }
}

/* For mobile phones (max-width: 768px) */
@media screen and (max-width: 768px) {
  h1 {
    font-size: 28px;
  }

  .category h2 {
    font-size: 1.3em;
  }

  .products {
    display: grid; /* Use grid layout for better control */
    grid-template-columns: repeat(3, 1fr); /* 3 columns with equal width */
    gap: 10px; /* Space between cards */
  }

  .product-card {
    width: 100%; /* Take full width of the grid cell */
    padding: 10px;
    font-size: 0.9em; /* Adjust text size for compact display */
  }

  .product-image {
    width: 100%; /* Ensure the image fits within the reduced card size */
    height: auto;
  }

  .product-info h3 {
    font-size: 1em; /* Reduce title size */
  }

  .product-info p {
    font-size: 0.8em; /* Reduce description size */
  }

  .price {
    font-size: 0.9em; /* Adjust price text size */
  }
  .navbar ul {
    gap: 10px;
    font-size: 0.8em; /* Smaller font size for mobile */
  }

  .navbar li {
    padding: 5px 10px; /* Reduced padding for better fit */
  }

  .logout {
    font-size: 0.9em; /* Resize logout button text */
  }
}

/* For very small devices (max-width: 576px) */
@media screen and (max-width: 576px) {
  .navbar {
    padding: 6px 8px; /* Smaller padding */
    gap: 5px; /* Minimize gaps further */
  }

  .navbar ul {
    gap: 5px; /* Compact spacing for menu items */
  }

  .navbar li {
    font-size: 14px; /* Further reduce font size */
    padding: 3px 5px; /* Compact padding */
  }

  .nav-icons {
    gap: 5px; /* Compact space between icons */
  }

  .cart-icon i {
    font-size: 16px; /* Smaller icon size */
  }

  .logout {
    font-size: 14px; /* Smaller logout text */
    padding: 3px 5px; /* Compact padding */
  }

  h1 {
    font-size: 20px;
  }

  .category h2 {
    font-size: 1.3em;
  }

  .products {
    grid-template-columns: repeat(3, 1fr); /* Still maintain 3 columns */
    gap: 8px; /* Reduce gap for smaller screens */
  }

  .product-card {
    padding: 8px; /* Reduce padding */
  }

  .product-info h3 {
    font-size: 0.9em; /* Further reduce title size */
  }

  .product-info p {
    font-size: 0.7em; /* Further reduce description size */
  }

  .price {
    font-size: 0.8em; /* Further adjust price text size */
  }
}
</style>
