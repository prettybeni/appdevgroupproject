<template>
  <div class="add-product">
    <h1>Add New Product</h1>
    <form @submit.prevent="addProduct">
      <div>
        <label for="productName">Product Name</label>
        <input type="text" id="productName" v-model="product.name" required />
      </div>

      <div>
        <label for="productPrice">Price</label>
        <input type="number" id="productPrice" v-model="product.price" required />
      </div>

      <div>
        <label for="productCategory">Category</label>
        <input type="text" id="productCategory" v-model="product.category" required />
      </div>

      <div>
        <label for="productImage">Product Image</label>
        <input type="file" id="productImage" @change="handleFileUpload" accept="image/jpeg" required />
      </div>

      <button type="submit">Add Product</button>

      <!-- Success and error messages -->
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
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
    // Handle file input change for image upload
    handleFileUpload(event) {
      this.product.image = event.target.files[0];
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

  axios.post('http://localhost:5000/api/admin/addProd', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the correct content type for form data
      },
    })
    .then(response => {
  console.log('Response received:', response);
  if (response.status === 201) {
    this.$router.push('/admin');
  } else if (response.status === 400) {
    this.errorMessage = 'Product already exists';
  }
})
.catch(error => {
  console.error('Error adding product:', error.response?.data || error);
  this.errorMessage = 'An error occurred while adding the product';
});
}
  }
};
</script>

<style scoped>
  .add-product {
    padding: 20px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  input, textarea {
    padding: 10px;
    margin-top: 5px;
    width: 100%;
  }
  
  button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }

  .success {
    color: green;
    margin-top: 10px;
  }

  .error {
    color: red;
    margin-top: 10px;
  }
</style>
