<template>
  <div>
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
        <h1>Edit Profile</h1><br><br>
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
<style scoped>
/* Navbar Styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 15px 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.navbar ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar ul li {
  margin-right: 30px;
}

.navbar ul li a {
  text-decoration: none;
  color: white;
  font-size: 18px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.navbar ul li a:hover {
  color: #28a745;
}

.navbar ul li.active a {
  color: #28a745;
}

.logout-container {
  display: flex;
  justify-content: flex-end;
}

.logout {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 5px;
}

.logout:hover {
  background-color: #c82333;
}

/* Content Styles */
.content-wrapper {
  display: flex;
  width: 80%;
  max-width: 1200px;
  margin-top: 80px; /* to avoid overlap with the navbar */
}

.profile-container {
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.profile-details h1 {
  font-size: 24px;
  font-weight: 600;
}

.edit-profile-container {
  flex: 1;
  padding: 50px 40px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.13);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
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
  margin-top: 20px;
  width: 100%;
  padding: 15px 0;
  background-color: #28a745;
  color: white;
  font-size: 18px;
  font-weight: 600;
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
</style>
