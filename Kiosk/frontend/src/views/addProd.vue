<template>
  <div class="page-container">
    <button @click="exitPage" class="exit-btn">&times;</button>
    <div class="container">
      <div class="add-product">
        <div class="header">
          <h1>Add New Product</h1>
        </div>
        <form @submit.prevent="addProduct">
          <div class="form-group">
            <label for="productName">Product Name</label>
            <input type="text" id="productName" v-model="product.name" required />
          </div>

          <div class="form-group">
            <label for="productPrice">Price</label>
            <input type="number" id="productPrice" v-model="product.price" required />
          </div>

          <div class="form-group">
            <label for="productCategory">Category</label>
            <input type="text" id="productCategory" v-model="product.category" required />
          </div>

          <div class="form-group">
            <label for="productImage">Product Image</label>
            <input type="file" id="productImage" @change="handleFileUpload" accept="image/jpeg" required />
          </div>

          <button type="submit" class="submit-btn">Add Product</button>

          <!-- Success and error messages -->
          <p v-if="successMessage" class="success">{{ successMessage }}</p>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      product: {
        name: '',
        price: '',
        category: '',
        image: null // Store the file object here
      },
      successMessage: '', // Success message for feedback
      errorMessage: '', // Error message for feedback
    };
  },
  methods: {
    // Reset the form fields and messages
    resetPage() {
      this.product = {
        name: '',
        price: '',
        category: '',
        image: null
      };
      this.successMessage = '';
      this.errorMessage = '';
    },
    // Handle file input change for image upload
    handleFileUpload(event) {
      this.product.image = event.target.files[0];
    },

    // Exit page handler (you can customize this as needed)
    exitPage() {
      window.history.back(); // Go back to the previous page
    },

    async addProduct() {
      // Basic validation
      if (!this.product.name || !this.product.price || !this.product.category || !this.product.image) {
        this.errorMessage = 'Please fill in all fields and select an image';
        return;
      }

      // Prepare FormData for submission
      const formData = new FormData();
      formData.append('name', this.product.name);
      formData.append('price', this.product.price);
      formData.append('category', this.product.category);
      formData.append('image', this.product.image); // Append the image file

      try {
        const response = await axios.post('http://localhost:5000/api/admin/addProd', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Set the correct content type for form data
          },
        });

        console.log('Response received:', response);
        if (response.status === 201) {
          this.successMessage = 'Product added successfully';
          this.resetPage(); // Reset the form fields and messages
        } else if (response.status === 400) {
          this.errorMessage = 'Product already exists';
        }
      } catch (error) {
        console.error('Error adding product:', error.response?.data || error);
        this.errorMessage = 'An error occurred while adding the product';
      }
    }
  }
};
</script>

<style>
.page-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7f4e2;
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


.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 700px;
  background-color: #fbfbf700;
  border-color: black;
  border-width: 1cap;
}

.add-product {
  padding: 20px;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  margin-bottom: 6px;
  color: #555;
}

input {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fafafa;
  transition: border 0.3s;
}

input:focus {
  border: 1px solid #4CAF50;
  outline: none;
}

button.submit-btn {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.submit-btn:hover {
  background-color: #45a049;
}

.success {
  color: green;
  text-align: center;
  font-weight: 600;
}

.error {
  color: red;
  text-align: center;
  font-weight: 600;
}
</style>
