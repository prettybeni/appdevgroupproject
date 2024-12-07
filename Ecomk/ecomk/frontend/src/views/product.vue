<template>
  <div>
    <div class="cancel-button">
      <a :href="`/menu?token=${token}`" class="logout">Cancel</a>
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
              <label for="sugar_level">Sugar Level:</label>
              <select id="sugar_level" v-model="sugar_level" placeholder="Select sugar level">
                <option value="0">0%</option>
                <option value="25">25%</option>
                <option value="50">50%</option>
                <option value="75">75%</option>
                <option value="100">100%</option>
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
    sugar_level: '',
    size: '',
    note: '',
    errorMessage: '', // Declare errorMessage here
    token: '',
  };
},
  mounted() {
    const productId = this.$route.params.productId;
    this.fetchProductDetails(productId);
  },
  methods: {
    async fetchProductDetails(productId) {
    try {
        const response = await axios.get(`http://localhost:5000/api/product/${productId}?token=${this.$route.query.token}`); // Pass the token in query
        if (response.data) {
            this.product = response.data.product;
            this.token = response.data.token; // Store the token in a variable
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
      sugar_level: this.sugar_level,
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

<style>
/* Base Styles */
html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Prevent horizontal scrollbars */
  height: 100%; /* Full viewport height */
  width: 100%; /* Full viewport width */
  font-family: Arial, sans-serif;
}

.product-page {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Align items to the top */
  gap: 20px;
  min-height: 100vh; /* Full viewport height */
  padding: 5%;
  box-sizing: border-box;
  background-color: #eeede0; /* Default background color */
  position: relative; /* Remove fixed positioning for responsiveness */
  flex-wrap: wrap;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center align items horizontally */
  text-align: center;
  gap: 10px;
}

.product-image img {
  width: 80%;
  max-width: 300px; /* Limit the maximum size */
  height: auto;
  margin-bottom: 10px;
}

.product-name {
  font-size: 1.8em;
  font-weight: bold;
  color: #000000; /* Vibrant pink text */
  margin: 5px 0;
  font-family: 'Arial Narrow Bold', sans-serif;
}

.product-price {
  font-size: 1.5em;
  color: #000000; /* Violet text */
  margin: 5px 0;
}

/* Right Column: Input Form */
.input-card {
  flex: 1;
  display: flex;
  align-items: flex-start; /* Align the form to the top */
  height: 100%;
}

.form-wrapper {
  background-color: #ffffffc3;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.452);
  width: 100%;
  max-width: 400px;
  text-align: center;
  min-height: 400px; /* Ensure the form wrapper has a minimum height */
}

.form-wrapper h3 {
  font-size: 1.6em;
  margin-bottom: 25px;
  color: #b93a14;
  font-weight: 900;
  font-family: 'Arial Narrow Bold', sans-serif;
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
  background-color: #ffffff;
  width: 100%;
  padding: 10px;
  font-size: 1.1em;
  border: 1px solid #a0a0a0;
  border-radius: 5px;
  box-sizing: border-box;
}

textarea {
  resize: none;
  height: 60px;
}

button {
  margin-top: 1px;
  width: fit-content;
  text-align: center;
  padding: 12px;
  font-size: 1em;
  color: #fff;
  background-color: #985d0ab8;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #985d0a;
}

/* Cancel Button */
.cancel-button {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  margin: 5px;
}

.cancel-button .logout {
  text-decoration: none;
  font-size: .8em;
  color: #ffffff;
  background-color: #985d0ab8;
  padding: 10px 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}

.cancel-button .logout:hover {
  background-color: #985d0a;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .product-page {
    flex-direction: column; /* Stack elements vertically */
    align-items: center;
    padding: 10%;
    background-color:#eeede0; /* Lighter shade of pink for tablets/mobile */
    position: relative; /* Remove fixed positioning for responsiveness */
    height: auto;
  }

  .product-details {
    margin-bottom: 20px;
  }

  .product-image img {
    width: 100%;
    max-width: 250px; /* Adjust for smaller screens */
  }

  .form-wrapper {
    width: 100%;
    padding: 20px;
  }

  .input-card {
    align-items: center;
  }
}

@media (max-width: 768px) {
  .product-page {
    padding: 5%;
    background-color: #eeede0; /* Even lighter background for smaller devices */
  }

  .form-wrapper {
    max-width: 100%; /* Ensure form takes up the full width */
    padding: 20px;
  }
  .product-name {
    font-size: 1.3em;
  }

  .product-price {
    font-size: 1.3em;
  }
}
</style>