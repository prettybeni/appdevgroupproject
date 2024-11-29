<template>
  <div>
    <div class="cancel-button">
      <a href="/menu" class="logout">Cancel</a>
    </div>

    <div class="product-page">
      <!-- Left: Product Details -->
      <div class="product-details">
        <div class="product-image">
          <img :src="`http://localhost:5000${product.image_url}`" :alt="product.name" />
        </div>
        <h2 class="product-name">{{ product.name || 'Loading...' }}</h2>
        <p class="product-price">P{{ product.price || 'Loading...' }}</p>
      </div>

      <!-- Right: Input Form -->
      <div class="input-card">
        <div class="form-wrapper">
          <h3>Customize Your Order</h3>

          <!-- Form Start -->
          <form @submit.prevent="addToCart">

            <!-- Quantity -->
            <div class="input-group">
              <label for="quantity">Quantity:</label>
              <input type="number" id="quantity" v-model="quantity" min="1" />
            </div>

            <!-- Sugar Level -->
            <div class="input-group">
              <label for="sugarLevel">Sugar Level:</label>
              <select id="sugarLevel" v-model="sugarLevel" placeholder="Select sugar level">
                <option value="0%">0%</option>
                <option value="25%">25%</option>
                <option value="50%">50%</option>
                <option value="75%">75%</option>
                <option value="100%">100%</option>
              </select>
            </div>

            <!-- Size -->
            <div class="input-group">
              <label for="size">Size:</label>
              <select v-model="size" id="size" placeholder="Select size">
                <!-- Predefined options -->
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>

                <!-- Dynamic sizes from the product -->
                <option v-for="(size, index) in product.sizes" :key="index" :value="size">{{ size }}</option>
              </select>
            </div>

            <!-- Note -->
            <div class="input-group">
              <label for="note">Note:</label>
              <textarea v-model="note" id="note" placeholder="Add a note for the seller"></textarea>
            </div>

            <!-- Add to Cart Button -->
            <button type="submit">Add to Cart</button>
          </form>
          <!-- Form End -->

        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
axios.defaults.withCredentials = true;

export default {
  data() {
  return {
    product: {},
    quantity: 1,
    sugarLevel: '',
    size: '',
    note: '',
    errorMessage: '', // Declare errorMessage here
  };
},
  mounted() {
    const productId = this.$route.params.productId;
    this.fetchProductDetails(productId);
  },
  methods: {
    async fetchProductDetails(productId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/product/${productId}`);
        if (response.data) {
          this.product = response.data;
        } else {
          console.error('Empty product data received');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    },
    async addToCart() {
  try {
    const response = await axios.post('http://localhost:5000/api/cart/add', {
      productId: this.product.id,
      quantity: this.quantity,
      sugarLevel: this.sugarLevel,
      size: this.size,
      note: this.note,
    }, { withCredentials: true });  // Ensure the cookie is sent with the request

    if (response.status === 200) {
      this.$router.push('/menu');
    }
  } catch (error) {
    console.error(error);
    this.errorMessage = 'Failed to add item to cart';
  }
}

  },
};
</script>

<style scoped>
/* Page Layout */


.product-page {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Center vertically */
  gap: 20px;
  min-height: 100%; /* Ensure the height takes the full viewport */
  padding: 200px;
  background-color: #f7dede;
}

/* Left Column: Product Details */
.product-details {
  flex: 1;
}

.product-image img {
  width: 50%;
  height: 50%;

}

.product-name {
  font-size: 1.8em;
  font-weight: bold;
  color: #c9684a; /* Vibrant pink text */
  margin: 10px 0;
  font-family:  'Arial Narrow Bold', sans-serif;

}

.product-price {
  font-size: 1.5em;
  color: #d46847; /* Violet text */
  margin: 5px 0;
}

/* Right Column: Input Form */
.input-card {
  flex: 1;
  display: flex;
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  height: 100%;
}

.form-wrapper {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 30px; /* Increased padding for more spacing inside the card */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.452); /* Slightly stronger shadow for emphasis */
  width: 100%;
  max-width: 500px; /* Increased max width for a larger card */
  text-align: center; 
}

.form-wrapper h3 {
  font-size: 1.8em; /* Slightly larger title */
  margin-bottom: 25px;
  color: #dd7656; /* Vibrant pink text */
  font-weight: 900;
  font-family:  'Arial Narrow Bold', sans-serif;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  font-size: 1em;
  color: #333;
  display: block;
  margin-bottom: 5px;
  text-align: left;
  font-weight: 700;

}

.input-group input,
.input-group select,
.input-group textarea {
  width: 100%;
  padding: 10px;
  font-size: 1.1em;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

textarea {
  resize: none;
  height: 60px;
}

button {
  width: 40%;
  text-align: center;
  padding: 12px;
  font-size: 1.3em;
  color: #fff;
  background-color: #e27a5b; /* Vibrant pink button */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #b85d42; /* Violet hover effect */
}

/* Cancel Button */
.cancel-button {
  position: absolute; /* Ensures it's positioned relative to the viewport */
  top: 20px; /* Adjust distance from the top */
  right: 20px; /* Adjust distance from the right */
  z-index: 10; /* Ensure it appears above other elements */
  margin-top: 10px;
}

.cancel-button .logout {
  text-decoration: none;
  font-size: 1em;
  color: #ffffff;
  background-color: #b20099; /* Vibrant pink background */
  padding: 10px 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}

.cancel-button .logout:hover {
  background-color: #6a0dad; /* Violet hover effect */
}

</style>
