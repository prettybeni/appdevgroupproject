<template>
    <div class="manage-users">
      <nav class="navbar">
        <div class="hamburger-menu" @click="toggleMenu" aria-label="Toggle navigation">
          <i class="fas fa-bars"></i>
        </div>
        <div class="admin-dashboard-text">Manage Users</div>
        <div class="nav-links" :class="{ 'active': isMenuOpen }">
          <router-link to="/admin" class="nav-link" active-class="active-nav-link">Sales</router-link>
          
          <div class="nav-dropdown">
            <button @click="toggleDropdown('ingredients')" class="dropdown-btn">
              Ingredients
              <i :class="{'fas fa-chevron-down': activeDropdown === 'ingredients', 'fas fa-chevron-right': activeDropdown !== 'ingredients'}" class="dropdown-indicator"></i>
            </button>
            <div v-if="activeDropdown === 'ingredients'" class="dropdown-content">
              <router-link to="/admin/addIngredient">Add Ingredients</router-link>
              <router-link to="/admin/manageIngredients">Manage Ingredients</router-link>
              <router-link to="/admin/archived-ingredients">Archived Ingredients</router-link>
            </div>
          </div>
  
          <div class="nav-dropdown">
            <button @click="toggleDropdown('products')" class="dropdown-btn">
              Products
              <i :class="{'fas fa-chevron-down': activeDropdown === 'products', 'fas fa-chevron-right': activeDropdown !== 'products'}" class="dropdown-indicator"></i>
            </button>
            <div v-if="activeDropdown === 'products'" class="dropdown-content">
              <router-link to="/admin/addProd">Add Products</router-link>
              <router-link to="/admin/products">Manage Products</router-link>
              <router-link to="/admin/archived-products">Archived Products</router-link>
            </div>
          </div>
  
          <div class="nav-dropdown">
            <button @click="toggleDropdown('items')" class="dropdown-btn">
              Items
              <i :class="{'fas fa-chevron-down': activeDropdown === 'items', 'fas fa-chevron-right': activeDropdown !== 'items'}" class="dropdown-indicator"></i>
            </button>
            <div v-if="activeDropdown === 'items'" class="dropdown-content">
              <router-link to="/admin/addItem">Add Item</router-link>
              <router-link to="/admin/manageItem">Manage Items</router-link>
              <router-link to="/admin/deleteItem">Archived Items</router-link>
            </div>
          </div>
  
          <router-link to="/admin/viewUsers" class="nav-link">Users</router-link>
          <router-link to="/admin/viewOrders" class="nav-link">Order</router-link>
          <router-link to="/admin/viewLogs" class="nav-link">Log</router-link>
          <router-link to="/admin/demandPrediction" class="nav-link">Demand Forecasting</router-link>
          <router-link to="/admin/createCashier" class="nav-link">Create Cashier Account</router-link>
        </div>
      </nav>
  
      <h1>Manage Users</h1>
      
      <div>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by first name, last name, or username" 
        />
      </div>
  
      <table border="1">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in filteredUsers" :key="user.id">
            <td>{{ user.first_name }}</td>
            <td>{{ user.last_name }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        users: [],
        isMenuOpen: false,
        searchQuery: '', // New data property for search input
      };
    },
    computed: {
      filteredUsers() {
        if (!this.searchQuery) {
          return this.users; // Return all users if no search query
        }
        const query = this.searchQuery.toLowerCase();
        return this.users.filter(user => 
          user.first_name.toLowerCase().includes(query) || 
          user.last_name.toLowerCase().includes(query) || 
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      },
    },
    methods: {
      
      toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleDropdown(dropdown) {
      this.activeDropdown = this.activeDropdown === dropdown ? '' : dropdown;
    },
      async fetchUsers() {
        try {
          const response = await axios.get('http://localhost:5000/api/admin/manageUsers');
          this.users = response.data;
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      },
    },
    mounted() {
      this.fetchUsers();
    },
  };
  </script>
 
  
<style scoped>
.nav-dropdown {
  margin-bottom: 0;
  margin-left: -10px;
}

.dropdown-btn {
  background: transparent;
  color: #6b4226; /* Light brown color for text */
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
  background: #ffb7a1; /* Hover color matching the active tab */
}

/* Dropdown Content */
.dropdown-content {
  display: none;
  background-color: #fffaf0; /* Adjusted theme color */
  position: absolute;
  left: 0;
  top: 100%; /* Below the button */
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

/* Individual links for items like View Users */
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
  background-color: #f5a8a0; /* Darker pink */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

/* Hamburger Menu */
.hamburger-menu {
  display: block;
  cursor: pointer;
  font-size: 24px;
  color: #6b4226; /* Lighter pink for contrast */
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

.manage-ingredients {
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

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.modal-actions button {
  width: 45%;
}
</style>

