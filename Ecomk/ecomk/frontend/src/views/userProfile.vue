<template>
  <div class="app">
    <!-- Navbar -->
    <nav class="navbar">
      <ul>
        <li>
          <a :href="`/dashboard?token=${token}`">Home</a>
        </li>
        <li>
          <a :href="`/menu?token=${token}`">Menu</a>
        </li>
        <li>
          <a :href="`/orders?token=${token}`">Orders</a>
        </li>
        <li>
          <a :href="`/about-us?token=${token}`">About Us</a>
        </li>
      </ul>
      <!-- Logout Button -->
      <div class="logout-container">
        <ul>
          <li>
            <a :href="`/user-profile?token=${token}`">{{ user.username }}</a>
          </li>
        </ul>
        <a :href="`/`" class="logout">Logout</a>
      </div>
    </nav>

    <!-- Profile page content -->
    <div class="content-wrapper">
      <div class="profile-container" v-if="!isEditing">
        <div class="profile-details">
          <h1>{{ user.first_name }} {{ user.last_name }}</h1>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Phone:</strong> {{ user.phone }}</p>
          <p><strong>Username:</strong> {{ user.username }}</p>
          <!-- Button to toggle edit mode -->
          <button @click="toggleEditMode">Edit Profile</button>
        </div>
      </div>

      <!-- Edit Profile -->
      <div class="edit-profile-container" v-if="isEditing">
        <h1>Edit Profile</h1><br>
        <form @submit.prevent="handleEditProfile">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" v-model="user.first_name" required />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" v-model="user.last_name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="user.email" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="text" id="phone" v-model="user.phone" required />
          </div>
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="user.username" required />
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" @click="toggleEditMode">Cancel</button>
        </form>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      sessionStatus: null,
      user: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        username: ''
      },
      token: '',
      errorMessage: '',
      isEditing: false, // To toggle between view and edit modes
    };
  },
  created() {
    this.getTokenFromUrl();
  },
  mounted() {
    if (this.token) {
      this.checkSession(this.token);
    }
  },
  methods: {
    getTokenFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      this.token = urlParams.get('token');
      console.log('Received token:', this.token);
    },

    async checkSession(token) {
      if (!token) {
        this.sessionStatus = false;
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/user-profile', {
          params: { token: token },
          withCredentials: true,
        });

        if (response.data && response.data.user) {
          this.sessionStatus = true;
          this.user = { ...response.data.user };
        } else {
          console.error('No user data found in the response');
          this.sessionStatus = false;
        }
      } catch (error) {
        console.error('Session not active:', error.response?.data || error);
        this.sessionStatus = false;
        this.errorMessage = 'Failed to fetch user data';
      }
    },

    async handleEditProfile() {
      // Ensure the token is available
      if (!this.token) {
        this.errorMessage = "Token is missing. Please log in again.";
        return;
      }

      try {
        const response = await axios.put(
          `http://localhost:5000/api/edit-profile?token=${this.token}`,
          this.user,
          { withCredentials: true }
        );

        if (response.data.success) {
          this.errorMessage = '';
          // Optionally show a success message or update user data
          alert('Profile updated successfully!');
          this.toggleEditMode(); // Switch back to view mode
        } else {
          this.errorMessage = 'Failed to update profile. Please try again.';
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Failed to update profile.';
      }
    },

    toggleEditMode() {
      this.isEditing = !this.isEditing;
    },

    logout() {
      this.token = '';
      this.user = { first_name: '', last_name: '', email: '', phone: '', username: '' };
      window.location.href = '/';
    }
  },
};
</script>
<style>
/* General reset for padding and margin */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  height: 100%; /* Ensure the body and html take the full height */
  overflow: hidden; /* Prevent scrolling on the page */
}

/* App container with background image */
.app {
  min-height: 100vh; /* Ensures full screen height */
  background-size: cover; /* Ensures the image covers the full viewport */
  background-position: center; /* Keeps the image centered */
  background-repeat: no-repeat; /* Prevents repetition */
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  width: 100%; /* Ensures full width */
  overflow: hidden; /* Prevent any internal scrolling */
}

/* Default background image for desktop and laptop */
.app {
  background-image: url('https://static.vecteezy.com/system/resources/previews/002/876/937/original/bubble-milk-tea-design-collection-pearl-milk-tea-boba-milk-tea-yummy-drinks-coffees-with-doodle-style-banner-illustration-vector.jpg');
}

/* Background image for tablet and below */

@media screen and (min-width: 1024px) {
  .app {
    background-size: cover; /* Ensures the image covers the entire screen */
    background-position: center center; /* Centers the image */
  }
}

/* Navbar styles */
.navbar {
  background-color: rgba(228, 213, 188, 0.9);
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap; /* Prevent wrapping */
  white-space: nowrap; /* Prevent items from wrapping */
}

.nav-icons {
  display: flex;
  align-items: center;
}

.cart-icon {
  margin-right: 20px;
  font-size: 1.5em;
  color: #000;
  text-decoration: none;
}

.cart-icon:hover {
  color: #422e05;
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
  flex-wrap: nowrap; /* Prevent wrapping */
  overflow: hidden; /* Ensure overflow content is clipped */
  white-space: nowrap; /* Ensure text stays on one line */
}

.navbar li {
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap; /* Prevent text wrapping */
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
  font-size: 1rem; /* Default font size for larger screens */
  white-space: nowrap;
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
  white-space: nowrap;
}

.logout-container {
  display: flex;
  align-items: center;
  gap: 20px; /* Add space between the username and logout button */
  flex-wrap: nowrap; /* Prevent wrapping */
  white-space: nowrap; /* Prevent text from wrapping */
}

.logout:hover {
  background-color: #ffffff;
  font-weight: bold;
}

/* Content Styles */
.content-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;
  width: 100%;
  max-width: 600px;
  padding: 20px;
  text-align: center;
}

.profile-container {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.685);
  width: 100%;
  text-align: center;
}

.profile-details h1 {
  font-size: 24px;
  font-weight: 600;
}

.edit-profile-container {
  flex: 1;
  padding: 20px 40px;
  border: 2px solid rgba(255, 255, 255, 0.711);
  background-color: rgba(255, 255, 255, 0.832);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.682);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align title at the top */
  align-items: stretch;
  max-height: 70vh; /* Set a maximum height for the container */
  max-width: 1200px; /* Increased width for desktop */
  width: 100%; /* Ensure responsiveness */
  overflow-y: auto;
}

.edit-profile-container h1 {
  margin-top: 0; /* Ensure the title has no extra space at the top */
  margin-bottom: 20px; /* Add spacing below the title */
  text-align: center; /* Center-align the title */
}

.edit-profile-container::-webkit-scrollbar {
  width: 8px; /* Scrollbar width */
}

.edit-profile-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3); /* Scrollbar thumb color */
  border-radius: 4px;
}

.edit-profile-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* Form and other styles remain the same */
.form-group {
  margin-bottom: 20px;
}

label {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
}

input {
  width: 100%;
  padding: 0 16px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  font-size: 14px;
  font-weight: 300;
}

button {
  margin-top: 10px;
  margin-right: 10px;
  width: fit-content;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
}

button[type="button"] {
  background-color: #dc3545;
}

button[type="button"]:hover {
  background-color: #c82333;
}

button:hover {
  background-color: #218838;
}

.error {
  color: red;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 10px;
    width: 400px;
  }
  .navbar {
    padding: 5px 10px; /* Further reduce padding on mobile */
  }

  .navbar ul {
    gap: 5px; /* Reduce gap between items */
  }
  .navbar li {
    padding: 5px 8px; /* Further reduce padding for items */
  }

  .navbar li a {
    font-size: 0.75rem; /* Smaller font size for mobile screens */
  }

  .logout-container {
    gap: 5px; /* Reduce space between username and logout button */
  }
  .logout {
    font-size: 0.8em; /* Smaller font size for logout button */
    padding: 4px 8px; /* Compact padding */
  }
  .edit-profile-container {
    max-width: 100%; /* Use most of the viewport width on mobile */
    max-height: 60vh; /* Reduce height for mobile */
    padding: 15px; /* Adjust padding */
  }
  .edit-profile-container h1 {
    font-size: 23px;
  }
  .profile-details h1{
    font-size: 22px;
  }

  .form-group {
    margin-bottom: 10px; /* Reduce spacing between inputs */
  }

  input {
    height: 40px; /* Smaller input height */
    font-size: 0.9rem; /* Smaller text */
  }

  button {
    padding: 8px 12px; /* Compact buttons */
    font-size: 0.9rem; /* Smaller text size for buttons */
  }
}
</style>
