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
        Add Ingredient
      </div>

      <!-- Navigation Links -->
      <div class="nav-links" :class="{ 'active': isMenuOpen }">
        <!-- Sales Button -->
        <router-link to="/admin" class="nav-link" active-class="active-nav-link">Sales</router-link>

        <!-- Ingredients Group -->
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


        <!-- Other Links -->
        <router-link to="/admin/viewUsers" class="nav-link">Users</router-link>
        <router-link to="/admin/viewOrders" class="nav-link">Order</router-link>
        <router-link to="/admin/viewLogs" class="nav-link">Log</router-link>
        <router-link to="/admin/demandPrediction" class="nav-link">Demand Forecasting</router-link>
        <router-link to="/admin/createCashier" class="nav-link">Create Cashier Account</router-link>
      </div>
    </nav>

    <!-- Dashboard Content -->
    <div class="add-ingredient-container">
      <div class="card">
        <h1>Add Ingredient</h1><br><br>
        <form @submit.prevent="handleAddIngredient">
          <div class="form-group">
            <label for="ingredientName">Ingredient Name</label>
            <input type="text" id="ingredientName" v-model="ingredientName" required placeholder="Enter ingredient name" />
          </div>

          <div class="form-group">
            <label for="quantity">Quantity</label>
            <div class="quantity-container">
              <input type="number" id="quantity" v-model="quantity" required placeholder="Enter quantity" />
              <select v-model="unit" required>
                <option value="ml">ml</option>
                <option value="grams" selected>grams</option> <!-- Default value set to 'grams' -->
              </select>
            </div>
          </div>

          <button type="submit">Add Ingredient</button>
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

  
<script>
import axios from 'axios';

export default {
  name: 'AddIngredient',
  data() {
    return {
      ingredientName: '', // Ingredient name
      quantity: '', // Quantity input
      unit: '', // Default unit is grams
      errorMessage: '', // Error message
      successMessage: '', // Success message
      isMenuOpen: false, // To track the menu state
      activeDropdown: '', // To manage dropdowns
    };
  },
  methods: {
    toggleMenu() {
      // Toggle the state of the menu (open/close)
      this.isMenuOpen = !this.isMenuOpen;
    },

    toggleDropdown(dropdown) {
      // Toggle the specific dropdown
      this.activeDropdown = this.activeDropdown === dropdown ? '' : dropdown;
    },

    async handleAddIngredient() {
      this.errorMessage = '';
      this.successMessage = '';

      // Check for empty fields
      if (!this.ingredientName || !this.quantity || !this.unit) {
        this.errorMessage = 'All fields are required.';
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/admin/addIngredient', {
          name: this.ingredientName,
          quantity: this.quantity,
          unit: this.unit,
        });

        if (response.status === 200) {
          this.$router.push('/admin/manageIngredient');
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.errorMessage = 'Ingredient already exists.';
        } else {
          this.errorMessage = 'An error occurred while adding the ingredient.';
        }
        console.error(error);
      }
    }
  }
};
</script>

  
  <style scoped>
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
  background-color: #ffe3c5;
  transform: translateX(-100%);
  transition: transform 0.5s ease-in-out;
  z-index: 1;
  padding-top: 82px;
  margin-top: 8px;
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
  
  /* Card for the Login Form */
 /* Card for the Add Ingredient Form */
.add-ingredient-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 100px; /* Adjust to align the form vertically */
  width: 100%; /* Ensure the container takes the full width */
}

.card {
  padding: 20px;
  width: 100%; /* Make the card width responsive */
  max-width: 450px; /* Set a max-width for the card */
  background-color: #fffaf0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-sizing: border-box;
}

/* Form Group */
/* Form Group */
.form-group {
  display: flex;
  flex-direction: column; /* Align label and input vertically */
  margin-bottom: 15px; 
}

/* Label */
label {
  font-size: 16px; /* Make labels a bit larger */
  color: #6b4226; /* Same as the text color for consistency */
  margin-bottom: 8px; /* Add some space between label and input */
}

/* Input and Select */
input,
select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #d1d1d1; /* Light border color */
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #f5a8a0; /* Highlight border color when focused */
}


/* Quantity Container */
.quantity-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* Ensure the container takes up full width */
}

.quantity-container input {
  flex: 1; /* Allow the number input to take available space */
  margin-right: 10px; /* Add space between input and select */
}

.quantity-container select {
  flex: 0 0 auto; /* Make sure the select doesn't expand too much */
  width: 30%; /* Set a fixed width for the select dropdown */
}

/* Submit Button */
button {
  background-color: #f5a8a0; /* Match navbar color */
  color: #6b4226;
  font-size: 16px;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%; /* Make the button take full width */
  box-sizing: border-box;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #ffb7a1; /* Lighter color when hovered */}

/* Error Message */
.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

/* Success Message */
.success {
  color: green;
  font-size: 14px;
  margin-top: 10px;
}

footer {
  text-align: center;
}

/* General Body Style */
body {
  margin: 0;
  padding: 0;
}

.add-ingredient-container {
  margin-top: 40px; /* Adjusted top margin for better spacing */
  width: 100%;
}

.card {
  max-width: 450px;
  padding: 20px;
  background-color: #fffaf0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 100%;
}

@media (max-width: 600px) {
  /* For smaller screens, make the card width more responsive */
  .card {
    max-width: 90%;
  }
}



  </style>
  
