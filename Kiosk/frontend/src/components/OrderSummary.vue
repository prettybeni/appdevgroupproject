<template>
  <div class="order-summary">
    <h3>Order Summary</h3>
    <ul>
      <li v-for="(item, index) in orderItems" :key="index">
        <span>{{ item.name }} ({{ item.quantity }}x) - {{ item.price * item.quantity }} Php</span>
        <!-- Trash Bin Icon to Remove Item -->
        <button class="remove-item-btn" @click="removeItem(index)">
          <i class="fas fa-trash-alt"></i> <!-- Font Awesome Trash Bin Icon -->
        </button>
      </li>
    </ul>
    <div class="totals">
      <p>Beverages Total: {{ totals.beverages }} Php</p>
      <p>Desserts Total: {{ totals.desserts }} Php</p>
      <p>Add Ons Total: {{ totals.addOns }} Php</p>
      <hr />
      <p>Total: {{ totals.overall }} Php</p>
    </div>
    <button @click="placeOrder" :disabled="orderItems.length === 0">Place Order</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['orderItems'],
  computed: {
    totals() {
      let totals = {
        beverages: 0,
        desserts: 0,
        addOns: 0,
        overall: 0,
      };

      this.orderItems.forEach((item) => {
        if (item.category === "Beverages") totals.beverages += item.price * item.quantity;
        if (item.category === "Desserts") totals.desserts += item.price * item.quantity;
        if (item.category === "Add Ons") totals.addOns += item.price * item.quantity;
        totals.overall += item.price * item.quantity;
      });

      return totals;
    },
  },
  methods: {
    removeItem(index) {
      this.$emit("remove-item", index);
    },
    async placeOrder() {
      try {
        const payload = {
          items: this.orderItems,
          totalPrice: this.totals.overall,
        };
        await axios.post("http://localhost:5000/api/orders", payload);
        alert("Order placed successfully!");
        this.$emit("clear-order");
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place the order. Please try again.");
      }
    },
  },
};
</script>

<style>
.order-summary ul {
  padding: 0;
  margin: 0;
  max-height: 200px; /* Set a fixed height for the list */
  overflow-y: auto; /* Enable vertical scrolling */
}

.order-summary li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0; /* Reduced padding to decrease space between products */
  border-bottom: 1px solid #ddd; /* Optional, if you want a line between items */
}

.remove-item-btn {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.2rem;
  cursor: pointer;
}

.remove-item-btn:hover {
  color: #c82333;
}

.totals {
  margin-top: 1rem;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
}

button:disabled {
  background-color: #ccc;
}
</style>
