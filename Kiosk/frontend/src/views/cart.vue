<template>
  <nav class="navbar">
      <ul>
        <li>
          <a href="/dashboard">Home</a>
        </li>
        <li class="active">
          <a href="/menu">Menu</a>
        </li>
        <li>
          <a href="/about-us">About Us</a>
        </li>
        <li>
          <a href="/contact">Contacts</a>
        </li>
      </ul>
      <div class="nav-icons">
        <a href="/cart" class="cart-icon">
          <i class="fas fa-shopping-cart"></i>
        </a>
        <a href="/logout" class="logout">Logout</a>
      </div>
    </nav>
  <div class="cart-page">
    <h1>My Cart</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-if="cartItems.length">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Sugar Level</th>
              <th>Quantity</th>
              <th>Size</th>
              <th>Note</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  <tr v-for="item in cartItems" :key="item.id">
    <td>
      <img :src="'http://localhost:5000' + item.product_image_url" alt="Product Image" class="product-image" />
    </td>
    <td>{{ item.product_name }}</td>
    <td>{{ item.sugar_level }}%</td>
    <td>{{ item.quantity }}</td>
    <td>{{ item.size }}</td>
    <td>{{ item.note || 'N/A' }}</td>
    <td>P{{ (item.price * item.quantity).toFixed(2) }}</td>
    <td>
      <button @click="openEditModal(item)">Edit</button>
      <button @click="openDeleteModal(item)">Remove</button>
    </td>
  </tr>
</tbody>
        </table>

        <!-- Total Price Section -->
        <div class="total-section">
          <h3>Total Price: P{{ totalPrice.toFixed(2) }}</h3>
          <button @click="checkout" class="checkout-button">Checkout</button>
        </div>
      </div>
      <div v-else>
        <p>Your cart is empty.</p>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="isEditModalOpen" class="modal">
  <div class="modal-content">
    <span class="close" @click="closeEditModal">&times;</span>
    <h2>Edit Item</h2>
    
    <label for="quantity">Quantity:</label>
    <input type="number" v-model.number="editItem.quantity" min="1" class="input-field" />
    
    <label for="sugarLevel">Sugar Level:</label>
    <select v-model="editItem.sugar_level" class="input-field">
      <option value="0">0%</option>
      <option value="25">25%</option>
      <option value="50">50%</option>
      <option value="75">75%</option>
      <option value="100">100%</option>
    </select>
    
    <label for="size">Size:</label>
    <select v-model="editItem.size" class="input-field">
      <option value="Small">Small</option>
      <option value="Medium">Medium</option>
      <option value="Large">Large</option>
    </select>
    
    <label for="note">Note:</label>
    <input type="text" v-model="editItem.note" class="input-field" />
    
    <button @click="saveEdit">Save</button>
  </div>
</div>

    <!-- Delete Modal -->
    <div v-if="isDeleteModalOpen" class="modal">
  <div class="modal-content">
    <span class="close" @click="closeDeleteModal">&times;</span>
    <h2>Are you sure you want to remove this item?</h2>
    <button @click="deleteItem(deleteItemId)">Yes</button>
    <button @click="closeDeleteModal">Cancel</button>
  </div>
</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cart: null,
      cartItems: [],
      loading: true,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      editItem: {
        quantity: 1, // Default quantity
        sugar_level: 100, // Default sugar level
        size: 'Small', // Default size
        note: '' // Default note
      },
      deleteItemId: null,
    };
  },

  async created() {
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        withCredentials: true,
      });
      this.cart = response.data.cart;
      this.cartItems = response.data.cartItems;
      console.log('Cart items fetched:', this.cartItems); // Log the fetched cart items
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      this.loading = false;
    }
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    }
  },
  methods: {
    async updateCart(item) {
      try {
        await axios.put(`http://localhost:5000/api/cart/${item.cart_item_id}`, {
          quantity: item.quantity,
          sugar_level: item.sugar_level,
          size: item.size,
          note: item.note,
        }, {
          withCredentials: true,
        });
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    },
    openEditModal(item) {
      this.editItem = { ...item };
      this.isEditModalOpen = true;
    },
    closeEditModal() {
      this.isEditModalOpen = false;
      this.editItem = {};
    },
    async saveEdit() {
      await this.updateCart(this.editItem);
      this.closeEditModal();
    },
    async deleteItem(itemId) {
      try {
        await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
          withCredentials: true,
        });
        this.cartItems = this.cartItems.filter(item => item.cart_item_id !== itemId);
      } catch (error) {
        console.error('Error deleting item:', error);
      } finally {
        this.closeDeleteModal();
      }
    },
    openDeleteModal(item) {
      this.deleteItemId = item.cart_item_id;
      this.isDeleteModalOpen = true;
    },
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.deleteItemId = null;
    },
    checkout() {
      this.$router.push('/checkout');
    },
  }
};
</script>


<style scoped>
.cart-page {
  padding: 20px;
}
.cart-table {
  width: 100%;
  border-collapse: collapse;
}
.cart-table th, .cart-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}
.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
.total-section {
  margin-top: 20px;
  text-align: right; /* Align total price and button to the right */
}
.checkout-button {
  padding: 10px 15px;
  font-size: 1em;
  color: #fff;
  background-color: #28a745; /* Green color for checkout */
  border: none;
  border-radius: 5px;
}
.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.input-field {
    width: 100%; /* Make the input fields and dropdowns take the full width */
    padding: 10px; /* Add padding for better appearance */
    margin: 5px 0; /* Add some margin for spacing */
    border: 1px solid #ccc; /* Add a border */
    border-radius: 4px; /* Rounded corners */
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

button {
    padding: 10px 15px; /* Add padding to the button */
    background-color: #4CAF50; /* Green background */
    color: white; /* White text */
    border: none; /* No border */
    border-radius: 4px; /* Rounded corners */
    cursor: pointer; /* Pointer cursor on hover */
}

button:hover {
    background-color: #45a049; /* Darker green on hover */
}

/* Navbar styles */
.navbar {
  background-color: rgba(228, 213, 188, 0.9); /* Background color of the navbar */
  padding: 10px 20px; /* Padding around the navbar */
  display: flex; /* Use flexbox for layout */
  justify-content: space-between; /* Space items evenly */
  align-items: center; /* Center items vertically */
  flex-wrap: nowrap; /* Prevent items from wrapping */
}

.nav-icons {
  display: flex; /* Use flexbox for nav icons */
  align-items: center; /* Center icons vertically */
}

.cart-icon {
  margin-right: 20px; /* Space between cart icon and next item */
  font-size: 1.5em; /* Size of the cart icon */
  color: #000; /* Color of the cart icon */
  text-decoration: none; /* Remove underline from the link */
}

.cart-icon:hover {
  color: #422e05; /* Change color on hover */
}

.navbar ul {
  list-style: none; /* Remove bullet points from list */
  display: flex; /* Use flexbox for the list */
  gap: 20px; /* Space between list items */
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
}

.navbar li {
  padding: 8px 16px; /* Padding for list items */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Change cursor to pointer on hover */
  transition: background-color 0.3s ease; /* Smooth background color transition */
}

.navbar li.active {
  background-color: #ffffff82; /* Background color for active item */
  font-weight: bold; /* Bold text for active item */
}

.navbar li:hover {
  background-color: #ffffff82; /* Background color on hover */
  font-weight: bold; /* Bold text on hover */
}

.navbar li a {
  text-decoration: none; /* Remove underline from links */
  color: #000000; /* Text color for links */
}

/* Logout Button */
.logout {
  border: none; /* Remove border */
  padding: 8px 16px; /* Padding for logout button */
  font-size: 1em; /* Font size for logout button */
  color: #000000; /* Text color for logout button */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Change cursor to pointer on hover */
  transition: background-color 0.3s ease; /* Smooth background color transition */
  text-decoration: none; /* Remove underline from link */
}

.logout:hover {
  background-color: #ffffff8e; /* Background color on hover */
  font-weight: bold; /* Bold text on hover */
}

/* Responsive design for mobile phones (max-width: 768px) */
@media screen and (max-width: 768px) {
  .navbar ul {
    gap: 10px; /* Smaller gap for mobile */
    font-size: 0.8em; /* Smaller font size for mobile */
  }

  .navbar li {
    padding: 5px 10px; /* Reduced padding for better fit */
  }

  .logout {
    font-size: 0.9em; /* Resize logout button text */
  }
}

/* For very small devices (max-width: 576px) */
@media screen and (max-width: 576px) {
  .navbar {
    padding: 6px 8px; /* Smaller padding */
    gap: 5px; /* Minimize gaps further */
  }

  .navbar ul {
    gap: 5px; /* Compact spacing for menu items */
  }

  .navbar li {
    font-size: 14px; /* Further reduce font size */
    padding: 3px 5px; /* Compact padding */
  }

  .nav-icons {
    gap: 5px; /* Compact space between icons */
  }

  .cart-icon i {
    font-size: 16px; /* Smaller icon size */
  }

  .logout {
    font-size: 14px; /* Smaller logout text */
    padding: 3px 5px; /* Compact padding */
  }
}
</style>