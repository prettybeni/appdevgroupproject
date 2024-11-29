<template>
  <div class="add-product">
    <form @submit.prevent="addProduct">
      <h3>Add Product</h3>
      <div>
        <label>Category:</label>
        <select v-model="product.category">
          <option value="Beverages">Beverages</option>
          <option value="Desserts">Desserts</option>
          <option value="Add Ons">Add Ons</option>
        </select>
      </div>
      <div>
        <label>Product Name:</label>
        <input type="text" v-model="product.name" required />
      </div>
      <div>
        <label>Price:</label>
        <input type="number" v-model="product.price" step="0.01" required />
      </div>
      <div>
        <label>Quantity:</label>
        <input type="number" v-model="product.quantity" required />
      </div>
      <div>
        <label>Image:</label>
        <input type="text" v-model="product.image_url" />
      </div>
      <button type="submit">Add Product</button>
    </form>
    <hr />
    <h3>Products List</h3>
    <table>
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
        this.product = {
          category: "Beverages",
          name: "",
          price: 0,
          quantity: 0,
          image_url: "",
        };
      } catch (error) {
        console.error("Error adding product:", error);
      }
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>
  
<style>
.add-product {
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

form div {
  margin-bottom: 1rem;
}

button {
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

/* Increase input box height */
.add-product form div input {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
