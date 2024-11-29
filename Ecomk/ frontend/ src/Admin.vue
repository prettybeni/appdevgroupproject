<template>
  <div class="admin-dashboard">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <!-- Hamburger Menu (on the left) -->
      <div class="hamburger-menu" @click="toggleMenu">
        <i class="fas fa-bars"></i> <!-- Font Awesome Hamburger Icon -->
      </div>

      <!-- Admin Dashboard Text -->
      <div class="admin-dashboard-text">
        Sales
      </div>

      <!-- Navigation Links -->
      <div class="nav-links" :class="{ 'active': isMenuOpen }">
        <!-- Sales Button (added at the top of the dropdown) -->
        <router-link to="/admin" class="nav-link" active-class="active-nav-link">Sales</router-link>

        <!-- Ingredients Group -->
        <div class="nav-dropdown">
          <button @click="toggleDropdown('ingredients')" class="dropdown-btn">
            Ingredients
            <i :class="{'fas fa-chevron-down': activeDropdown === 'ingredients', 'fas fa-chevron-right': activeDropdown !== 'ingredients'}" class="dropdown-indicator"></i>
          </button>
          <div v-if="activeDropdown === 'ingredients'" class="dropdown-content">
            <router-link to="/admin/addIngredient">Add Ingredients</router-link>
            <router-link to="/admin/manageIngredients">Manage Ingredients</router-link>
          </div>
        </div>

        <!-- Products Group -->
        <div class="nav-dropdown">
          <button @click="toggleDropdown('products')" class="dropdown-btn">
            Products
            <i :class="{'fas fa-chevron-down': activeDropdown === 'products', 'fas fa-chevron-right': activeDropdown !== 'products'}" class="dropdown-indicator"></i>
          </button>
          <div v-if="activeDropdown === 'products'" class="dropdown-content">
            <router-link to="/admin/addProd">Add Products</router-link>
            <router-link to="/admin/products">Manage Products</router-link>
          </div>
        </div>

        <!-- Items Group -->
        <div class="nav-dropdown">
          <button @click="toggleDropdown('items')" class="dropdown-btn">
            Items
            <i :class="{'fas fa-chevron-down': activeDropdown === 'items', 'fas fa-chevron-right': activeDropdown !== 'items'}" class="dropdown-indicator"></i>
          </button>
          <div v-if="activeDropdown === 'items'" class="dropdown-content">
            <router-link to="/admin/addItem">Add Item</router-link>
            <router-link to="/admin/manageItems">Manage Items</router-link>
          </div>
        </div>

        <!-- Individual View Links -->
        <router-link to="/admin/viewUsers" class="nav-link">Users</router-link>
        <router-link to="/admin/viewOrders" class="nav-link">Order</router-link>
        <router-link to="/admin/viewLogs" class="nav-link">Log</router-link>
        <router-link to="/admin/demandPrediction" class="nav-link">Demand Forecasting</router-link>

        <!-- Users Group (with single link, no dropdown) -->
        <router-link to="/admin/createCashier" class="nav-link">Create Cashier Account</router-link>
      </div>
    </nav>

    <!-- Dashboard Content -->
    <div class="dashboard-content">
      <!-- Additional content can go here -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      isMenuOpen: false, // Track menu open/close state
      activeDropdown: null, // Track active dropdown
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen; // Toggle menu visibility
    },
    toggleDropdown(dropdown) {
      // Toggle the visibility of the dropdown
      this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
    }
  }
};
</script>

<style scoped>
/* Root container */
.admin-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Navigation Bar */
.navbar {
  width: 100%;
  padding: 22px 0;
  background-color: #f5a8a0; /* Darker pink background */
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
  color: #6b4226; /* Lighter pink that complements the darker navbar */
  position: absolute;
  left: 20px; /* Position it on the left side */
  z-index: 3;
}

/* Admin Dashboard Text */
.admin-dashboard-text {
  font-size: 20px; /* Reduced font size */
  font-weight: bold;
  color: #6b4226; /* Lighter color for text */
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
  background-color: #ffe3c5; /* Same as the navbar background */
  transform: translateX(-100%); /* Initially hide the menu off-screen */
  transition: transform 0.5s ease-in-out; /* Animation for sliding in */
  z-index: 1;
  padding-top: 82px; /* Space for the navbar */
  margin-top: 8px; /* Remove any extra margin */
}

.nav-links.active {
  transform: translateX(0); /* Slide in when active */
}

/* Sales Button */
.sales-btn {
  background-color: #f5a8a0; /* Matching navbar color */
  color: #6b4226; /* Lighter color for text */
  font-size: 16px;
  font-weight: bold;
  padding: 12px 20px;
  width: 100%;
  text-align: left;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sales-btn:hover {
  background-color: #ffb7a1; /* Hover color matching the active tab */
}

/* Dropdown Menu */
.nav-dropdown {
  margin-bottom: 0; /* Remove margin to avoid extra space */
  margin-left: -10px;
}

.dropdown-btn {
  background: transparent;
  color: #6b4226; /* Matching the light brown color for text */
  font-size: 16px;
  font-weight: 600;
  padding: 18px 30px; /* Adjusted padding for consistent sizing */
  width: 100%;
  text-align: left;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-btn:hover {
  background: #ffb7a1; /* Hover color matching the active tab */
  padding: 18px 30px; /* Maintain same padding on hover */
}

/* Dropdown Content */
.dropdown-content {
  display: none;
  background: #fffaf0; /* Light background for dropdown */
  padding-left: 0; /* Remove extra padding to ensure full width */
  width: 100%; /* Ensure the dropdown content takes up the full width */
  box-sizing: border-box; /* Ensure padding is inside */
}

.dropdown-content a {
  color: #6b4226; /* Matching the light brown color for text */
  font-size: 16px;
  font-weight: 600;
  padding: 12px 20px; /* Ensure consistent padding for the links */
  display: block;
  text-decoration: none;
  width: 100%; /* Ensure the link takes up the full width */
  box-sizing: border-box; /* Ensure padding is inside the link */
  transition: background-color 0.3s ease, padding 0.3s ease; /* Ensure smooth transition */
}

.dropdown-content a:hover {
  background-color: #ffb7a1; /* Hover color matching the active tab */
  padding: 12px 20px; /* Keep the same padding on hover */
}

/* Display the dropdown content when active */
.nav-dropdown .dropdown-content {
  display: block;
}

/* Individual links (for single items like View Users, etc.) */
/* Individual links (for single items like View Users, etc.) */
.nav-link {
  background-color: #ffe3c5; /* Same as the navbar background */
  color: #6b4226; /* Matching the light brown color for text */
  font-size: 16px;
  font-weight: 600;
  padding: 12px 20px; /* Adjusted padding for better uniformity */
  width: 100%; /* Ensure full width */
  text-align: left;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: block;
  box-sizing: border-box; /* Ensure padding is inside the element */
  transition: background-color 0.3s ease, padding 0.3s ease; /* Ensure smooth transition */
  margin-bottom: 0; /* Removed any bottom margin to avoid extra space */
}

/* Ensure uniform hover behavior for all links */
.nav-link:hover {
  background-color: #ffb7a1; /* Hover color matching the active tab */
  padding: 12px 20px; /* Keep the same padding on hover */
}


/* Styling for main dashboard content */
.dashboard-content {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* Active state for Sales link */
.active-nav-link {
  background-color: #ffb7a1; /* Example: matching the hover color */
  padding: 12px 20px;
}

</style>
