<template>
    <div class="cashier">
      <h1>Cashier Page</h1>
  
      <div class="products">
        <h2>Products</h2>
        <ul>
          <li v-for="product in products" :key="product.id" class="product-item">
            <span>{{ product.name }} - ${{ product.price }}</span>
            <input
              type="number"
              v-model.number="product.quantity"
              min="1"
              @change="updateCart(product)"
              placeholder="Quantity"
            />
          </li>
        </ul>
      </div>
  
      <div class="cart">
        <h2>Cart</h2>
        <ul>
          <li v-for="item in cart" :key="item.id" class="cart-item">
            <span>{{ item.name }} x{{ item.quantity }} - ${{ item.totalPrice }}</span>
          </li>
        </ul>
        <div v-if="cart.length > 0" class="total">
          <p>Total: ${{ totalPrice }}</p>
          <button @click="finalizePurchase">Finalize Purchase</button>
        </div>
        <div v-else>
          <p>Your cart is empty.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        products: [
          { id: 1, name: "Product 1", price: 10, quantity: 0 },
          { id: 2, name: "Product 2", price: 20, quantity: 0 },
          { id: 3, name: "Product 3", price: 30, quantity: 0 }
        ],
        cart: []
      };
    },
    computed: {
      totalPrice() {
        return this.cart.reduce((total, item) => total + item.totalPrice, 0);
      }
    },
    methods: {
      updateCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (product.quantity > 0) {
          if (existingItem) {
            existingItem.quantity = product.quantity;
            existingItem.totalPrice = existingItem.quantity * existingItem.price;
          } else {
            this.cart.push({
              ...product,
              quantity: product.quantity,
              totalPrice: product.quantity * product.price
            });
          }
        } else if (existingItem) {
          this.cart = this.cart.filter(item => item.id !== product.id);
        }
      },
      finalizePurchase() {
        if (this.cart.length > 0) {
          alert(`Purchase complete! Total: $${this.totalPrice}`);
          // Reset cart after purchase
          this.cart = [];
          this.products.forEach(product => (product.quantity = 0));
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .cashier {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .products,
  .cart {
    margin-bottom: 30px;
  }
  
  .product-item,
  .cart-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  input {
    width: 60px;
    padding: 5px;
    margin-left: 10px;
  }
  
  button {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #218838;
  }
  
  .total {
    margin-top: 20px;
    text-align: right;
  }
  
  p {
    font-size: 18px;
    font-weight: bold;
  }
  </style>
  