<template>
  <div class="app">
    <!-- Navbar -->
    <nav class="navbar">
      <ul>
        <li class="active">
          <a :href="`/dashboard?token=${token}`">Home</a>
        </li>
        <li>
          <a :href="`/menu?token=${token}`">Menu</a>
        </li>
        <li>
          <a :href="`/about-us?token=${token}`">About Us</a>
        </li>
        <li>
          <a :href="`/contact?token=${token}`">Contact</a>
        </li>
      </ul>
      <!-- Cart Icon and Logout Button -->
      <div class="nav-icons">
        <a :href="`/cart?token=${token}`" class="cart-icon">
          <i class="fas fa-shopping-cart"></i> <!-- FontAwesome cart icon -->
        </a>
        <!-- Display username here -->
        <a :href="`/user-profile?token=${token}`">{{ username }}</a>
        <a :href="`/?token=${token}`" class="logout">Logout</a>
      </div>
    </nav>

    <!-- Home Section -->
    <section class="home">
      <h1>Welcome to Tea Haven</h1>
      <p>Your favorite milk tea, delivered to your doorstep!</p>
      <button class="shop-now" :onclick="`window.location.href='/menu?token=${token}'`">Shop Now</button>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      sessionStatus: null, // null: checking, true: session active, false: session not active
      username: '', // Store username here
      token: '', // Store token here
    };
  },
  created() {
    this.getTokenFromUrl();
  },
  mounted() {
    if (this.token) {
      this.checkSession(this.token); // Use the token to check the session
    }
  },
  methods: {
    // Extract token from URL
    getTokenFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      this.token = urlParams.get('token');
      console.log('Received token:', this.token);
    },

    // Function to check session using the token
    checkSession(token) {
      if (!token) {
        console.log("No token provided");
        return;
      }

      axios
        .get('http://localhost:5000/api/dashboard', {
          params: { token: token }, // Send token as a query parameter or as part of the request
          withCredentials: true,
        })
        .then((response) => {
          this.sessionStatus = true;
          this.username = response.data.username; // Set the username from the response
        })
        .catch((error) => {
          console.error('Session not active:', error.response?.data || error);
          this.sessionStatus = false;
        });
    },
  },
};
</script>

<style scoped>
/* Existing styles */

/* Navbar styles */
.navbar {
  background-color: #ffe3c5;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: #ff6347; /* Example hover color */
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
  background-color: #ffb7a1;
  font-weight: bold;
}

.navbar li:hover {
  background-color: #ffb7a1;
  font-weight: bold;
}

.navbar li a {
  text-decoration: none;
  color: #6b4226;
}

/* Logout Button */
.logout {
  border: none;
  padding: 8px 16px;
  font-size: 1em;
  color: #6b4226;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
}

.logout:hover {
  background-color: #ffb7a1;
  font-weight: bold;
}

/* Home Section styles */
.home {
  text-align: center;
  padding: 50px;
  color: #6b4226;
}

.home h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.home p {
  font-size: 1.2em;
  margin-bottom: 30px;
}

/* Shop Now button */
.shop-now {
  background-color: #ffb7a1;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.shop-now:hover {
  background-color: #f28268;
}

/* Responsive design */
@media screen and (max-width: 768px) {
  .navbar ul {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .logout {
    margin-top: 10px;
    width: 100%;
    max-width: 200px;
  }

  .shop-now {
    width: 100%;
    max-width: 200px;
  }
}

@media screen and (max-width: 480px) {
  .home h1 {
    font-size: 1.8em;
  }

  .home p {
    font-size: 1em;
  }

  .shop-now {
    font-size: 0.9em;
    padding: 8px 16px;
  }
}
</style>
