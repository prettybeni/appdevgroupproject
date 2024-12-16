<template>
    <div class="checkout-page">
      <div class="checkout-container">
        <!-- Delivery Address Card -->
        <div class="address-card">
          <h2>Delivery Address</h2>
          <form @submit.prevent="submitOrder">
            <label for="address">Address:</label>
            <input type="text" v-model="deliveryAddress" required class="input-field" />
  
            <h2>Payment Method</h2>
            <p>Payment Method: <strong>Cash on Delivery (COD)</strong></p>
  
            <button type="submit" class="checkout-button">Place Order</button>
          </form>
        </div>
  
        <!-- Cart Summary -->
        <div class="cart-summary">
  <h2>Order Summary</h2><br>
  <div v-if="cartItems.length">
    <div v-for="(item, index) in cartItems" :key="item.cart_item_id" class="cart-item">
      <div class="cart-item-details">
        <strong class="product-name">{{ item.product_name }} x{{ item.quantity }}</strong>
        <div class="item-details">
          <div>Sugar level: {{ item.sugar_level }}%</div>
          <div>Size: {{ item.size }}</div>
          <div v-if="item.note">Note: {{ item.note }}</div>
        </div>
      </div>
      <div class="cart-item-price">
        P{{ (item.price * item.quantity).toFixed(2) }}
      </div>
    </div>
    <hr class="item-divider" />
  </div>
  <div v-else>
    <p>Your cart is empty.</p>
  </div>
  <div class="total-section">
    <h3>Total Price: P{{ totalPrice.toFixed(2) }}</h3>
  </div>
</div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        cartItems: [],
        loading: true,
        deliveryAddress: '',
      };
    },
    computed: {
      totalPrice() {
        return this.cartItems.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      }
    },
    async created() {
  
      try {
        const response = await axios.get(`http://localhost:5000/api/cart`);
        this.cartItems = response.data.cartItems;
        console.log('Cart items fetched:', this.cartItems); // Log the fetched cart items
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        this.loading = false;
      }
    },
    methods: {
      async submitOrder() {
        const orderData = {
          items: this.cartItems,
          total: this.totalPrice,
          deliveryAddress: this.deliveryAddress,
          paymentMethod: 'Cash on Delivery',
        };
  
        try {
          const response = await axios.post(`http://localhost:5000/api/orders`, orderData);
          if (response.status === 200) {
            alert('Order placed successfully!');
            // Optionally, redirect to a confirmation page or clear the cart
            this.$router.push('/order-confirmation');
          }
        } catch (error) {
          console.error('Error placing order:', error);
          alert('There was an error placing your order. Please try again.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .checkout-page {
    padding: 20px;
  }
  
  .checkout-container {
    display: flex;
    justify-content: space-between;
    width: 100%; /* Ensure the container takes full width */
  }
  
  .address-card {
    flex: 0 0 60%; /* Set width to 60% */
    margin-right: 20px; /* Space between address card and cart summary */
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-sizing: border-box; /* Include padding and border in width */
  }
  
  .cart-summary {
    flex: 0  0 40%; /* Set width to 40 % */
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-sizing: border-box; /* Include padding and border in width */
  }
  
  .cart-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 10px;
  }
  
  .cart-item-details {
    display: flex;
    flex-direction: column; /* Stack details vertically */
    flex-grow: 1; /* Allow details to take available space */
    margin-left: 10px; /* Indentation for details */
  }
  
  .product-name {
    font-size: 1.2em;
    color: #333;
    text-align: left; /* Align product name to the left */
  }
  
  .item-details {
    margin-top: 5px;
    font-size: 0.9em;
    color: #666;
    text-align: left; /* Align details to the left */
  }
  
  .cart-item-price {
    align-self: center;
    font-weight: bold;
    color: #007bff;
    min-width: 100px; /* Ensure price has a minimum width for alignment */
    text-align: right; /* Align price to the right */
  }
  
  .item-divider {
    border: none;
    border-top: 1px solid #ccc; /* Add a top border for separation */
    margin: 10px 0; /* Space above and below the line */
  }
  
  .total-section {
    margin-top: 20px;
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
  }
  </style>