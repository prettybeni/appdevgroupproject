<template>
  <button @click="exitPage" class="exit-btn">&times;</button>
  <div class="container">
    <h1 class="title">Manage Products</h1>

    <!-- Search Bar -->
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search by name or category" 
        @input="filterProducts"
        class="search-input"
      />
    </div>

    <table class="product-table">
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
        <tr v-if="paginatedProducts.length === 0">
          <td colspan="5" class="no-products">No products available.</td>
        </tr>
        <tr v-for="product in paginatedProducts" :key="product.id">
          <td>
            <img :src="getImageUrl(product.image_url)" alt="Product Image" class="product-image" />
          </td>
          <td>{{ product.name }}</td>
          <td>P{{ product.price }}</td>
          <td>{{ product.category }}</td>
          <td>
            <button @click="openEditModal(product)" class="btn edit-btn">Edit</button>
            <button @click="deleteProduct(product.id)" class="btn delete-btn">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1" 
        @click="currentPage--">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages" 
        @click="currentPage++">Next</button>
    </div>

    <!-- Modal for editing product -->
    <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2 class="modal-title">Edit Product</h2>
        <form @submit.prevent="updateProduct" class="modal-form">
          <div class="form-group">
            <label>Current Image:</label>
            <img :src="getImageUrl(selectedProduct.image_url)" alt="Current Product Image" class="modal-image" />
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
            <button type="submit" class="btn save-btn">Save</button>
            <button type="button" @click="closeEditModal" class="btn cancel-btn">Cancel</button>
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
      baseUrl: 'http://localhost:5000',
      isModalVisible: false,
      selectedProduct: {},
      selectedFile: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) {
        return this.products;
      }
      const query = this.searchQuery.toLowerCase();
      return this.products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
      );
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    exitPage() {
      window.history.back(); // Go back to the previous page
    },

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
      this.selectedProduct = { ...product };
      this.isModalVisible = true;
      this.selectedFile = null;
    },
    closeEditModal() {
      this.isModalVisible = false;
      this.selectedProduct = {};
      this.selectedFile = null;
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
      }
    },
    async updateProduct() {
      const formData = new FormData();
      formData.append('name', this.selectedProduct.name);
      formData.append('price', this.selectedProduct.price);
      formData.append('category', this.selectedProduct.category);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      try {
        const response = await axios.put(`${this.baseUrl}/api/admin/products/${this.selectedProduct.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          const index = this.products.findIndex(product => product.id === this.selectedProduct.id);
          if (index !== -1) {
            this.products[index] = { ...this.selectedProduct, image_url: response.data.image_url };
          }
          this.closeEditModal();
        }
      } catch (error) {
        console.error('Error updating product:', error);
      }
    },
    async deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          const response = await axios.put(`${this.baseUrl}/api/admin/products/${productId}/delete`);
          if (response.status === 200) {
            this.products = this.products.filter(product => product.id !== productId);
          } else {
            console.error('Failed to delete product');
          }
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
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

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
  text-align: center;
}

.search-input {
  width: 50%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.product-table th, .product-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.product-table th {
  background-color: #f4f4f4;
}

.no-products {
  text-align: center;
  font-size: 16px;
  color: #777;
}

.product-image {
  width: 80px;
  height: auto;
  border-radius: 5px;
}

.btn {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.edit-btn {
  background-color: #4CAF50;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.pagination {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 3px;
  width: fit-content;
}

.page-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 40%;
}

.modal-title {
  margin-bottom: 20px;
  text-align: center;
}

.modal-image {
  width: 100px;
  height: auto;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}
</style>
