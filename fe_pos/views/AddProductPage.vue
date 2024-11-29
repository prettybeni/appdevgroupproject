<template>
  <div class="add-product-container">
    <div class="content-wrapper">
      <div class="form-container">
        <form @submit.prevent="addProduct" class="add-product-form">
          <h3>Add Product</h3>
          <div class="form-group">
            <label>Category:</label>
            <select v-model="product.category" required>
              <option value="Beverages">Beverages</option>
              <option value="Desserts">Desserts</option>
              <option value="Add Ons">Add Ons</option>
            </select>
          </div>
          <div class="form-group">
            <label>Product Name:</label>
            <input type="text" v-model="product.name" required />
          </div>
          <div class="form-group">
            <label>Price:</label>
            <input type="number" v-model="product.price" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Quantity:</label>
            <input type="number" v-model="product.quantity" required />
          </div>
          <div class="form-group">
            <label>Image URL:</label>
            <input type="text" v-model="product.image_url" />
          </div>
          <button type="submit" class="submit-button">Add Product</button>
        </form>
      </div>

      <div class="products-list">
        <h3>Products List</h3>
        <table class="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      product: {
        category: "Beverages",
        name: "",
        price: 0,
        quantity: 0,
        image_url: "",
      },
      products: [],
    };
  },
  methods: {
    async fetchProducts() {
      const response = await axios.get("http://localhost:5000/api/products");
      this.products = response.data;
    },
    async addProduct() {
      try {
        await axios.post("http://localhost:5000/api/products", this.product);
        alert("Product added successfully!");
        this.fetchProducts();
        this.resetForm();
      } catch (error) {
        console.error("Error adding product:", error);
      }
    },
    resetForm() {
      this.product = {
        category: "Beverages",
        name: "",
        price: 0,
        quantity: 0,
        image_url: "",
      };
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style>
.add-product-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Aligns items to the top */
  background-color: #f3dede;
  padding: 2rem;
  min-height: 100vh;
}

.content-wrapper {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 40%;
}

.add-product-form h3 {
  text-align: center;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.submit-button {
  width: 100%;
  padding: 0.7rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #218838;
}

.products-list {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 60%;
  max-height: 400px; /* Set a fixed height */
  overflow-y: auto; /* Enable vertical scrolling */
}

.products-list h3 {
  text-align: center;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 0.8rem;
  text-align: left;
}

.product-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}
</style>
