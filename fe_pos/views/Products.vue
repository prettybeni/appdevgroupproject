<template>
  <div class="products-container">
    <!-- Left Section -->
    <div class="menu-section">
      <h2>Menu Items</h2>
      <div class="filter-buttons">
        <button
          v-for="category in categories"
          :key="category"
          :class="{ active: selectedCategory === category }"
          @click="filterProducts(category)"
        >
          {{ category }}
        </button>
      </div>
      <div class="menu-items">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="menu-item"
        >
          <img :src="product.image_url" :alt="product.name" />
          <p>{{ product.name }}</p>
          <p>{{ product.price }} Php</p>
          <button
            :class="{ active: selectedProduct === product.id }"
            @click="selectProduct(product)"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>

    <!-- Right Section -->
    <div class="order-summary-section">
      <OrderSummary
        :orderItems="orderItems"
        @remove-item="removeItem"
        @clear-order="clearOrder"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import OrderSummary from "../components/OrderSummary.vue";

export default {
  components: { OrderSummary },
  data() {
    return {
      categories: ["All", "Beverages", "Desserts", "Add Ons"],
      selectedCategory: "All",
      products: [],
      filteredProducts: [],
      orderItems: [],
      selectedProduct: null, // Tracks the currently selected product
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        this.products = response.data;
        this.filteredProducts = this.products;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    filterProducts(category) {
      this.selectedCategory = category;
      this.filteredProducts =
        category === "All"
          ? this.products
          : this.products.filter((p) => p.category === category);
    },
    selectProduct(product) {
      this.selectedProduct = product.id; // Update the selected product
      this.addItemToOrder(product); // Add item to the order
    },
    addItemToOrder(product) {
      const item = this.orderItems.find((i) => i.id === product.id);
      if (item) {
        item.quantity++;
      } else {
        this.orderItems.push({ ...product, quantity: 1 });
      }
    },
    removeItem(index) {
      this.orderItems.splice(index, 1);
    },
    clearOrder() {
      this.orderItems = [];
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style>
.products-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
}

.menu-section {
  flex: 3;
  padding: 1rem;
  background-color: #f7e8e8;
  border-radius: 8px;
}

.menu-section h2 {
  margin: 0;
  padding: 0.5rem 0;
}

.order-summary-section {
  flex: 1;
  padding: 1rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.filter-buttons button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  color: #007bff;
  border: 1px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
}

.filter-buttons button.active {
  background-color: #007bff;
  color: white;
}

.filter-buttons button:hover {
  background-color: #0056b3;
  color: white;
}

.menu-items {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  max-height: 450px;
  overflow-y: auto;
}

.menu-item {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  background-color: #ffffff;
}

.menu-item img {
  max-width: 100%;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.menu-item button {
  margin-top: 1rem;
  background-color: white;
  color: #28a745;
  padding: 0.5rem 1rem;
  border: 1px solid #28a745;
  border-radius: 4px;
  cursor: pointer;
}

.menu-item button.active {
  background-color: #28a745;
  color: white;
}

.menu-item button:hover {
  background-color: #218838;
  color: white;
}
</style>
