<template>
  <div class="app">
    <!-- Navbar -->
    <nav class="navbar">
      <ul>
        <li class="active">
          <a href="/home">Home</a>
        </li>
        <li>
          <a href="/menu">Menu</a>
        </li>
        <li>
          <a href="/about-us">About Us</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
      <!-- Cart Icon and Logout Button -->
      <div class="nav-icons">
        <a href="/cart" class="cart-icon">
          <i class="fas fa-shopping-cart"></i> <!-- FontAwesome cart icon -->
        </a>
        <a href="/" class="logout">Logout</a>
      </div>
    </nav>

    <!-- Home Section -->
    <section class="home">
      <h1>Welcome to Lebrew Foodhouse eShop</h1>
      <p>Your favorite milk tea, delivered to your doorstep!</p>
      <button class="shop-now" onclick="window.location.href='/menu'">Shop Now</button>
    </section>
  </div>
</template>

<script>
export default {
  
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
  display: flex;
  flex-direction: column;
  width: 100%; /* Ensures full width */
  overflow: hidden; /* Prevent any internal scrolling */
}

/* Default background image for desktop and laptop */
.app {
  background-image: url('https://static.vecteezy.com/system/resources/previews/002/909/315/non_2x/bubble-milk-tea-design-collection-pearl-milk-tea-boba-milk-tea-yummy-drinks-coffees-with-doodle-style-banner-illustration-vector.jpg');
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
  background-color: #ffffff;
  font-weight: bold;
}

/* Home Section styles */
/* Home Section styles */
.home {
  text-align: center;
  padding: 50px;
  color: #8a5e3c;
  background-color: rgba(255, 255, 255, 0.874); /* More transparency */
  margin: auto;
  width: 80%;
  max-width: 800px;
  border-radius: 15px;
}


.home h1 {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 3em;
  margin-bottom: 20px;
  color: #962604;
}

.home p {
  font-size: 1.2em;
  margin-bottom: 30px;
  color: #382517;
}

/* Shop Now button */
.shop-now {
  background-color: #c37800;
  border: none;
  padding: 10px 20px;
  font-size: 1.2em;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: fit-content;
}

.shop-now:hover {
  background-color: #bb8d41;
}

/* Responsive design for tablet and laptop (covers screens from 1024px to 1366px) */
@media screen and (max-width: 1366px) {
  .home {
    width: 90%;
    padding: 40px;
  }

  .home h1 {
    font-size: 2em;
  }

  .home p {
    font-size: 1.1em;
  }

  .shop-now {
    font-size: 0.95em;
  }
}

/* Responsive design for mobile (max-width: 768px) */
@media screen and (max-width: 768px) {
  
  .navbar ul {
    gap: 10px;
    font-size: 0.8em; /* Smaller font size for mobile */
  }

  .navbar li {
    padding: 5px 10px; /* Reduced padding for better fit */
  }

  .logout {
    font-size: 0.9em; /* Resize logout button text */
  }

  .shop-now {
    font-size: 0.9em; /* Resize shop now button text */
  }

  .home {
    width: 95%;
    padding: 30px;
  }

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

