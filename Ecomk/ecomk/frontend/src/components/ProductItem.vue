<template>
    <div class="product-item">
      <img :src="product.img" :alt="product.name" />
      <p>{{ product.name }} ({{ product.price }} Php)</p>
      <div class="quantity-controls">
        <button @click="decreaseQuantity">-</button>
        <span>{{ product.quantity }}</span>
        <button @click="increaseQuantity">+</button>
      </div>
      <button class="add-item">Add Item</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProductItem',
    props: {
      product: Object,
    },
    methods: {
      increaseQuantity() {
        this.product.quantity++;
      },
      decreaseQuantity() {
        if (this.product.quantity > 1) this.product.quantity--;
      },
    },
  };
  </script>
  
  <style scoped>
  .product-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 10px;
    text-align: center;
  }
  .product-item img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  .quantity-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
  }
  </style>
  