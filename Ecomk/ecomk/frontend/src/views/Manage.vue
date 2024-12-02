<template>
  <div>
    <h1>Products</h1>
    <table border="1">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="products.length === 0">
          <td colspan="5" style="text-align: center;">No products available.</td>
        </tr>
        <tr v-for="product in products" :key="product.id">
          <td>
            <img :src="getImageUrl(product.image_url)" alt="Product Image" style="width: 100px; height: auto;" />
          </td>
          <td>{{ product.name }}</td>
          <td>P{{ product.price }}</td>
          <td>{{ product.category }}</td>
          <td>
            <button @click="openEditModal(product)">Edit</button>
            <button @click="deleteProduct(product.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal for editing product -->
    <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Edit Product</h2>
        <form @submit.prevent="updateProduct">
          <div class="form-group">
            <label for="current_image">Current Image:</label>
            <div>
              <img :src="getImageUrl(selectedProduct.image_url)" alt="Current Product Image" style="width: 100px; height: auto;" />
            </div>
          </div>

          <div class="form-group">
            <label for="image">Upload New Image (optional):</label>
            <input type="file" @change="onFileChange" accept="image/*" />
          </div>

          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" v-model="selectedProduct.name" required />
          </div>

          <div class="form-group">
            <label for="price">Price:</label>
            <input type="number" v-model="selectedProduct.price" required />
          </div>

          <div class="form-group">
            <label for="category">Category:</label>
            <input type="text" v-model="selectedProduct.category" required />
          </div>

          <div class="form-actions">
            <button type="submit">Save</button>
            <button type="button" @click="closeEditModal">Cancel</button>
          </div>
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
      products: [],
      baseUrl: 'http://localhost:5000', // Adjust this to your actual base URL
      isModalVisible: false,
      selectedProduct: {},
      selectedFile: null, // To hold the uploaded file
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get(`${this.baseUrl}/api/admin/products`);
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    getImageUrl(imagePath) {
      return `${this.baseUrl}${imagePath}`;
    },
    openEditModal(product) {
      this.selectedProduct = { ...product }; // Create a copy to edit
      this.isModalVisible = true;
      this.selectedFile = null; // Reset the selected file
    },
    closeEditModal() {
      this.isModalVisible = false;
      this.selectedProduct = {}; // Clear selected product
      this.selectedFile = null; // Clear the selected file
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file; // Store the selected file
      }
    },
    async updateProduct() {
      const formData = new FormData();
      formData.append('name', this.selectedProduct.name);
      formData.append('price', this.selectedProduct.price);
      formData.append('category', this.selectedProduct.category);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile); // Append the file to FormData
      }

      try {
        await axios.put(`${this.baseUrl}/api/admin/products/${this.selectedProduct.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const index = this.products.findIndex(product => product.id === this.selectedProduct.id);
        if (index !== -1) {
          this.products.splice(index, 1, this.selectedProduct); // Update the product in the list
        }
        this.closeEditModal();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    },
    async deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          await axios.delete(`${this.baseUrl}/api/admin/products/${productId}`);
          this.products = this.products.filter(product => product.id !== productId);
          console.log('Product deleted:', productId);
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    },
  },
};
</script>

<style scoped>
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
  margin-right: 5px;
}

.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow effect */
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px; /* Space between form groups */
}

.form-actions {
  display: flex;
  justify-content: space-between; /* Space between buttons */
}
</style>