<template>
    <div class="managed-products">
      <nav class="navbar">
        <div class="hamburger-menu" @click="toggleMenu">
          <i class="fas fa-bars"></i>
        </div>
        <div class="admin-dashboard-text">Managed Products</div>
        <div class="nav-links" :class="{ 'active': isMenuOpen }">
          <router-link to="/admin" class="nav-link" active-class="active-nav-link">Sales</router-link>
          
          <!-- Ingredients Dropdown -->
          <div class="nav-dropdown">
            <button @click="toggleDropdown('ingredients')" class="dropdown-btn">
              Ingredients
              <i :class="{
                'fas fa-chevron-down': activeDropdown === 'ingredients',
                'fas fa-chevron-right': activeDropdown !== 'ingredients'
              }" class="dropdown-indicator"></i>
            </button>
            <div v-if="activeDropdown === 'ingredients'" class="dropdown-content">
              <router-link to="/admin/addIngredient" exact-active-class="active-nav-link">Add Ingredients</router-link>
              <router-link to="/admin/manageIngredients">Manage Ingredients</router-link>
              <router-link to="/admin/archivedIngredients">Archived Ingredients</router-link>
            </div>
          </div>
          
          <!-- Products Dropdown -->
          <div class="nav-dropdown">
            <button @click="toggleDropdown('products')" class="dropdown-btn">
              Products
              <i :class="{
                'fas fa-chevron-down': activeDropdown === 'products',
                'fas fa-chevron-right': activeDropdown !== 'products'
              }" class="dropdown-indicator"></i>
            </button>
            <div v-if="activeDropdown === 'products'" class="dropdown-content">
              <router-link to="/admin/addProd" exact-active-class="active-nav-link">Add Products</router-link>
              <router-link to="/admin/products" class="active-nav-link">Manage Products</router-link>
            </div>
          </div>
          
          <!-- Other Dropdowns -->
          <div class="nav-dropdown">
            <button @click="toggleDropdown('items')" class="dropdown-btn">
              Items
              <i :class="{
                'fas fa-chevron-down': activeDropdown === 'items',
                'fas fa-chevron-right': activeDropdown !== 'items'
              }" class="dropdown-indicator"></i>
            </button>
            <div v-if="activeDropdown === 'items'" class="dropdown-content">
              <router-link to="/admin/addItem">Add Item</router-link>
              <router-link to="/admin/manageItems">Manage Items</router-link>
            </div>
          </div>
            
          <router-link to="/admin/viewUsers" class="nav-link">Users</router-link>
          <router-link to="/admin/viewOrders" class="nav-link">Order</router-link>
          <router-link to="/admin/viewLogs" class="nav-link">Log</router-link>
          <router-link to="/admin/demandPrediction" class="nav-link">Demand Forecasting</router-link>
          <router-link to="/admin/createCashier" class="nav-link">Create Cashier Account</router-link>
        </div>
      </nav>
      <h1>Managed Products</h1>
      <table border="1" v-if="products.length > 0">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.id">
            <td>
              <img :src="getImageUrl(product.image_url)" alt="Product Image" style="width: 100px; height: auto;" />
            </td>
            <td>{{ product.name }}</td>
            <td>P{{ product.price }}</td>
            <td>
              <button @click="recoverProduct(product.id)">Recover</button>
              <button @click="deleteProduct(product.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No products available.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        products: [],
        isMenuOpen: false,
        activeDropdown: '',
        baseUrl: 'http://localhost:5000', // Ensure this is set to your API's base URL
      };
    },
    methods: {
      getImageUrl(imagePath) {
        return `${this.baseUrl}${imagePath}`; // Construct the full image URL
      },
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
      toggleDropdown(dropdown) {
        this.activeDropdown = this.activeDropdown === dropdown ? '' : dropdown;
      },
      async fetchArchived() {
        try {
          const response = await axios.get(`${this.baseUrl}/api/admin/archived-products`); // Use baseUrl
          this.products = response.data;
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      },
      async recoverProduct(id) {
        if (confirm("Are you sure you want to recover this product?")) {
          try {
            await axios.put(`${this.baseUrl}/api/admin/products/${id}/recover`);
            alert("Product recovered successfully!");
            this.fetchArchived(); // Refresh the list of products
          } catch (error) {
            console.error("Error recovering product:", error);
            alert("Failed to recover the product. Please try again.");
          }
        }
      },
      async deleteProduct(id) {
        if (confirm("Are you sure you want to permanently delete this product?")) {
          try {
            await axios.delete(`${this.baseUrl}/api/admin/products/${id}/delete`);
            alert("Product deleted successfully!");
            this.fetchArchived(); // Refresh the list
          } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete the product. Please try again.");
          }
        }
      },
    },
    mounted() {
      this.fetchArchived(); // Fetch products when the component is mounted
    },
  };
  </script>
  
  <style scoped>
  .managed-products {
    padding: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  .product-image {
    width: 50px; /* Set a fixed width for the images */
    height: auto; /* Maintain aspect ratio */
  }
  
  button {
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 3px;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  /* Navbar and dropdown styles can be reused from the original page */
  .nav-dropdown {
    margin-bottom: 0;
    margin-left: -10px;
  }
  
  .dropdown-btn {
    background: transparent;
    color: #6b4226;
    font-size: 16px;
    font-weight: 600;
    padding: 18px 30px;
    width: 100%;
    text-align: left;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .dropdown-btn:hover {
    background: #ffb7a1;
  }
  
  .dropdown-content {
    display: none;
    background-color: #fffaf0;
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 10;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .nav-dropdown:hover .dropdown-content,
  .dropdown-btn:focus + .dropdown-content {
    display: block;
  }
  
  .dropdown-content a {
    color: #6b4226;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 20px;
    display: block;
    text-decoration: none;
    width: 100%;
    box-sizing: border-box;
    transition: background-color 0.3s ease, padding 0.3s ease;
  }
  
  .dropdown-content a:hover {
    background-color: #ffb7a1;
  }
  
  .nav-link {
    background-color: #ffe3c5;
    color: #6b4226;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 20px;
    width: 100%;
    text-align: left;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: block;
    box-sizing: border-box;
  }
  
  .nav-link:hover {
    background-color: #ffb7a1;
  }
  
  .admin-dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  
  .admin-dashboard-text {
    font-size: 20px;
    font-weight: bold;
    color: #6b4226;
    flex-grow: 1;
    text-align: center;
    z-index: 2;
  }
  
  .navbar {
    width: 100%;
    padding: 22px 0;
    background-color: #f5a8a0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  
  .hamburger-menu {
    display: block;
    cursor: pointer;
    font-size: 24px;
    color: #6b4226;
    position: absolute;
    left: 20px;
    z-index: 3;
  }
  
  .nav-links {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100%;
    background-color: #ffe3c5;
    transform: translateX(-100%);
    transition: transform 0.5s ease-in-out;
    z-index: 1;
    padding-top: 82px;
  }
  
  .nav-links.active {
    transform: translateX(0);
  }
  </style>