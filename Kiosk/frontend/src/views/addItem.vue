<template>
  <button @click="exitPage" class="exit-btn">&times;</button>
    <div class="admin-dashboard">
      <div class="add-item-container">
        <div class="card">
          <h1>Add Item</h1><br><br>
          <form @submit.prevent="handleAddItem">
            <div class="form-group">
              <label for="itemName">Item Name</label>
              <input type="text" id="itemName" v-model="itemName" required placeholder="Enter item name" />
            </div>
  
            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input type="number" id="quantity" v-model="quantity" required placeholder="Enter quantity" />
            </div>
  
            <div class="form-group">
              <label for="size">Size</label>
              <input type="text" id="size" v-model="size" required placeholder="Enter size" />
            </div>
  
            <button type="submit">Add Item</button>
            <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'AddItem',
    data() {
      return {
        itemName: '', // Item name
        quantity: '', // Quantity input
        size: '', // Size input
        errorMessage: '', // Error message
        successMessage: '', // Success message
        isMenuOpen: false, // To track the menu state
        activeDropdown: '', // To manage dropdowns
      };
    },
    methods: {
      exitPage() {
      window.history.back(); // Go back to the previous page
    },
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
  
      toggleDropdown(dropdown) {
        this.activeDropdown = this.activeDropdown === dropdown ? '' : dropdown;
      },
  
      async handleAddItem() {
        this.errorMessage = '';
        this.successMessage = '';
  
        // Check for empty fields
        if (!this.itemName || !this.quantity || !this.size) {
          this.errorMessage = 'All fields are required.';
          return;
        }
  
        try {
          const response = await axios.post('http://localhost:5000/api/admin/addItem', {
            name: this.itemName,
            quantity: this.quantity,
            size: this.size,
          });
  
          if (response.status === 200) {
            this.$router.push('/admin/manageItems');
          }
        } catch (error) {
          if (error.response && error.response.status === 409) {
            this.errorMessage = 'Item already exists.';
          } else {
            this.errorMessage = 'An error occurred while adding the item.';
          }
          console.error(error);
        }
      }
    }
  };
  </script>
  
  <style>
  body {
    background-color: #f6f6eb;
  }
  .exit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
  width: fit-content;
  margin-right: 20px;
  margin-top: -10px;
}

.exit-btn:hover {
  color: rgb(0, 0, 0); /* Retain the text color change */
  background: none; /* Remove the background on hover */
}
  .admin-dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
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
  
  /* Card for the Add Item Form */
  .add-item-container {
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
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-sizing: border-box;
  }
  
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
  
  /* Input */
  input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #d1d1d1; /* Light border color */
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  input:focus {
    outline: none;
    border-color: #f5a8a0; /* Highlight border color when focused */
  }
  
  /* Submit Button */
  button {
    background-color: #f5a8a0; /* Match navbar color */
    color: #6b4226;
    font-size: 16px;
    padding: 12px 20px;
    border: none;
    border-radius : 4px;
    cursor: pointer;
    width: 100%; /* Make the button take full width */
    box-sizing: border-box;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #ffb7a1; /* Lighter color when hovered */
  }
  
  /* Error Message */
  .error {
    color: red;
    font-size: 14px;
    margin-top: 10px;
  }
  
  /* General Body Style */
  body {
    margin: 0;
    padding: 0;
  }
  
  @media (max-width: 600px) {
    /* For smaller screens, make the card width more responsive */
    .card {
      max-width: 90%;
    }
  }
  </style>