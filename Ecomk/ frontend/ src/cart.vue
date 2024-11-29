<template>
    <div class="cart-page">
      <h2>Your Cart</h2>
      <div v-if="cartItems.length === 0">
        <p>Your cart is empty.</p>
      </div>
      <table v-else>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.id">
            <td>{{ item.name }}</td>
            <td>P{{ item.price.toFixed(2) }}</td>
            <td>{{ item.quantity }}</td>
            <td>P{{ (item.price * item.quantity).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="cartItems.length > 0" class="cart-summary">
        <p>Total: P{{ totalAmount.toFixed(2) }}</p>
        <button @click="checkout">Checkout</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        cartItems: [],
      };
    },
    computed: {
      totalAmount() {
        return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    },
    mounted() {
      this.fetchCart();
    },
    methods: {
      async fetchCart() {
        try {
          const response = await axios.get('http://localhost:5000/api/cart');
          this.cartItems = response.data.cartItems;
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      },
      checkout() {
        this.$router.push('/checkout');
      },
    },
  };
  </script>
  
  <style scoped>
  .cart-page {
    padding: 20px;
    background-color: #fbeaff;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th, td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  .cart-summary {
    margin-top: 20px;
    font-size: 1.2em;
  }
  
  button {
    padding: 10px;
    font-size: 1.2em;
    background-color: #b20099;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #6a0dad;
  }

  
  </style>
  
