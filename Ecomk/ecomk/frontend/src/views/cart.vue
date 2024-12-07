<template>
  <nav class="navbar">
      <ul>
        <li >
          <a :href="`/dashboard?token=${token}`">Home</a>
        </li>
        <li>
          <a :href="`/menu?token=${token}`">Menu</a>
        </li>
        <li>
          <a :href="`/aboout-us?token=${token}`">About Us</a>
        </li>
        <li>
          <a :href="`/contact?token=${token}`">Contacts</a>
        </li>
      </ul>
      <div class="nav-icons">
        <a :href="`/cart?token=${token}`" class="cart-icon">
          <i class="fas fa-shopping-cart"></i> <!-- FontAwesome cart icon -->
        </a>
      <!-- Logout Button -->
        <a href="/" class="logout">Logout</a>
      </div>
    </nav>
    <div class="cart-page">
      <h2>Your Cart</h2>
      
      <table>
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
        axios.get(`http://localhost:5000/api/cart?id=${this.token}`)
    .then((response) => {
      this.cart_id = response.data.cart_id;
      this.items = response.data.items;
    })
    .catch((error) => {
      console.error('Error fetching cart:', error);
    });
      },
      checkout() {
        this.$router.push('/checkout');
      },
    },
  };
  </script>
  
  <style>
  html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  font-family: Arial, sans-serif;
}

#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* Navbar styles */
.navbar {
  background-color: rgba(228, 213, 188, 0.9);
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap; /* Prevent items from wrapping */
}

.nav-icons {
  display: flex;
  align-items: center;
}

.cart-icon {
  margin-right: 20px;
  font-size: 1.5em;
  color: #dc3e3e;
  text-decoration: none;
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.navbar li {
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.navbar li.active {
  background-color: #ffffff82;
  font-weight: bold;
}

.navbar li:hover {
  background-color: #ffffff82;
  font-weight: bold;
}

.navbar li a {
  text-decoration: none;
  color: #000000;
}

/* Logout Button */
.logout {
  border: none;
  padding: 8px 16px;
  font-size: 1em;
  color: #000000;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
}

.logout:hover {
  background-color: #ffffff8e;
  font-weight: bold;
}
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
  