<template>
    <div class="manage-items">
      <nav class="navbar">
        <div class="hamburger-menu" @click="toggleMenu">
          <i class="fas fa-bars"></i>
        </div>
        <div class="admin-dashboard-text">Manage Items</div>
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
              <router-link to="/admin/addProd">Add Products</router-link>
              <router-link to="/admin/products">Manage Products</router-link>
            </div>
          </div>
          
          <!-- Items Dropdown -->
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
  
      <h1>Manage Items</h1>
      
      <!-- Search Bar -->
      <div>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by name or size" 
        />
      </div>
  
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredItems" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.size }}</td>
            <td>
              <button @click="openEditModal(index)">Edit</button>
              <button @click="openAddStockModal(index)">Add Stock</button>
              <button @click="deleteItem(item.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div v-if="showEditModal" class="modal">
        <div class="modal-content">
          <h2>Edit Item Name</h2>
          <input type="text" v-model="modalName" placeholder="Enter new name" />
          <div class="modal-actions">
            <button @click="saveNameEdit">Save</button>
            <button @click="closeEditModal">Cancel</button>
          </div>
        </div>
      </div>
  
      <div v-if="showAddStockModal" class="modal">
        <div class="modal-content">
          <h2>Add Stock for {{ selectedItem.name }}</h2>
          <input type="number" v-model="modalQuantity" min="1" placeholder="Enter quantity to add"/>
          <div class="modal-actions">
            <button @click="addQuantity">Confirm</button>
            <button @click="closeAddStockModal">Cancel</button>
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
      items: [],
      showEditModal: false,
      showAddStockModal: false,
      selectedItem: null,
      modalName: '',
      modalQuantity: 1,
      isMenuOpen: false,
      activeDropdown: '',
      searchQuery: '', // New data property for search input
    };
  },
  computed: {
    filteredItems() {
      if (!this.searchQuery) {
        return this.items; // Return all items if no search query
      }
      const query = this.searchQuery.toLowerCase();
      return this.items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.size.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    deleteItem(id) {
      if (confirm("Are you sure you want to delete this item?")) {
        axios.put(`http://localhost:5000/api/admin/manage-items/${id}`)
          .then(() => {
            alert("Item deleted successfully!");
            this.fetchItems();  // Refresh the list of items
          })
          .catch((error) => {
            console.error("Error deleting item:", error);
            alert("Failed to delete the item. Please try again.");
          });
      }
    },

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleDropdown(dropdown) {
      this.activeDropdown = this.activeDropdown === dropdown ? '' : dropdown;
    },
    async fetchItems() {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/manageItems');
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },
    openEditModal(index) {
      this.selectedItem = this.items[index];
      this.modalName = this.selectedItem.name;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedItem = null;
      this.modalName = '';
    },
    async saveNameEdit() {
      if (this.modalName.trim() === '') {
        alert('Name cannot be empty.');
        return;
      }
      try {
        await axios.put(`http://localhost:5000/api/admin/manageItems/${this.selectedItem.id}`, { name: this.modalName });
        this.selectedItem.name = this.modalName;
        alert('Item name updated successfully!');
      } catch (error) {
        console.error('Error updating item name:', error);
      } finally {
        this.closeEditModal();
      }
    },
    openAddStockModal(index) {
      this.selectedItem = this.items[index];
      this.modalQuantity = 0;
      this.showAddStockModal = true;
    },
    closeAddStockModal() {
      this.showAddStockModal = false;
      this.selectedItem = null;
      this.modalQuantity = 0;
    },
    async addQuantity() {
      if (this.modalQuantity > 0) {
        try {
          await axios.put(`http://localhost:5000/api/admin/manageItems/${this.selectedItem.id}/add-quantity`, {
            quantity: this.modalQuantity,
          });
          this.selectedItem.quantity += this.modalQuantity;
          alert('Stock added successfully!');
        } catch (error) {
          console.error('Error adding stock:', error);
        } finally {
          this.closeAddStockModal();
        }
      } else {
        alert('Please enter a valid stock quantity.');
      }
    },
    handleClickOutside(event) {
      const dropdowns = document.querySelectorAll('.nav-dropdown');
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
          this.activeDropdown = '';
        }
      });
    },
  },

  mounted() {
    this.fetchItems();
    this.activeDropdown = this.$route.path.includes('item') ? 'items' : ''; 
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>
  
  <style scoped>
/* General Styles */
.manage-items {
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

/* Button Styles */
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

/* Navbar Styles */
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

/* Admin Dashboard Text */
.admin-dashboard-text {
  font-size: 20px;
  font-weight: bold;
  color: #6b4226;
  flex-grow: 1;
  text-align: center;
  z-index: 2;
}

/* Navigation Links */
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

/* Dropdown Styles */
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