<template>
  <button @click="exitPage" class="exit-btn">&times;</button>
  <b><br><br></b><div class="admin-dashboard">
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
    exitPage() {
      window.history.back(); // Go back to the previous page
    },
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
          this.$router.push('/admin/manageIngredients');
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

<style>
body {
  background-color: #f4f3ee;
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
  color: rgb(0, 0, 0);
}
  .admin-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  background-color: #ffffff;
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
  