<template class="body">
  <div id="bg">
    <!-- Container for the image and login form -->
    <div class="content-wrapper">
      <!-- Image on the left side -->
      <div class="image-container">
        <img src="../../public/img/logo.png" alt="Logo" class="logo-image" />
      </div>

      <!-- Login form on the right side -->
      <div class="login-container">
        <h1>Login</h1><br><br>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="usernameOrEmail">Email or Username</label>
            <input type="text" id="usernameOrEmail" v-model="usernameOrEmail" required placeholder="Email or username" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required placeholder="Enter your password" />
            <p id="res"><router-link to="/reset-password">Forgot your password?</router-link></p> <!-- Reset password link -->
          </div>
          <button type="submit">Login</button>
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
          <div class="footer">
            <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'Login',
  data() {
    return {
      usernameOrEmail: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = ''; // Reset error message

      const loginUrl = 'http://localhost:5000/api'; // Adjusted endpoint for login

      try {
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.usernameOrEmail, 
            password: this.password
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          this.errorMessage = errorData.message || 'Login failed. Please try again.';
          return;
        }

        const data = await response.json();
        console.log('Login successful:', data);

        // Check the role and redirect accordingly
        if (data.success) {
          if (data.redirectUrl) {
            this.$router.push(data.redirectUrl); // Redirect based on role (cashier, admin, user)
          } else {
            this.errorMessage = 'Role not recognized or missing redirect URL.';
          }
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      } catch (error) {
        console.error('Error during login:', error);
        this.errorMessage = 'An error occurred. Please try again later.';
      }
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  height: 100%; /* Ensure the body and html take the full height */
}
/* Apply background color to the entire page */
#bg {
  background: linear-gradient(45deg, #D8C4A3, #A3D8C4, #D8A3C4);
  min-height: 100vh; /* Ensure it takes at least the full height of the viewport */
  height: auto; /* Allow the height to adapt to the content */
  background-size: 600% 600%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: gradientAnimation 15s ease infinite;
  padding: 20px; /* Add padding for better spacing on smaller devices */
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Container for image and login form side by side */
.content-wrapper {
  display: flex;
  width: 90%; /* Adjusted for better fit on all screens */
  max-width: 1200px; /* Set max-width */
  flex-wrap: wrap; /* Allow content to stack on smaller screens */
  justify-content: center;
  align-items: center;
}

/* Image container adjustments */
.image-container {
  flex: 1; /* Takes up half the width */
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 50%; /* Ensure image is responsive */
}

.logo-image {
  width: 80%; /* Adjust image size */
  max-width: 400px; /* Set a max width for the image */
  height: auto;
}

/* Login form container */
.login-container {
  flex: 1; /* Takes up the other half of the width */
  padding: 40px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.13);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Optional: Add shadow for better contrast */
  border-radius: 10px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  max-width: 450px; /* Limit form width */
  width: 100%; /* Make form responsive */
  margin-top: 50px;
}

/* Form group styling */
.form-group {
  margin-bottom: 20px; /* Reduce space between input fields */
  display: flex;
  flex-direction: column; /* Stack label above the textbox */
  align-items: flex-start; /* Align the label to the left */
}

label {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
}

input {
  display: block;
  width: 100%; /* Ensure textboxes take the full width */
  box-sizing: border-box; /* Ensures padding doesn't affect the width */
  height: 50px; /* Match the textbox height */
  background-color: rgba(255,255,255,0.07);
  border-radius: 3px;
  padding: 0 16px; /* Equal padding on both sides */
  font-size: 14px;
  font-weight: 300;
}

#res {
  font-size: 14px;
  text-align: right;
  margin-top: 10px; /* Add spacing above */
  display: block; /* Ensure it takes its own line */
  width: 100%; /* Make sure it doesn't overflow */
}

.form-group a {
  color: #007bff;
}

/* Button styling */
button {
  margin-top: 20px;
  width: 100%; /* Ensure the button takes up the full width */
  padding: 15px 0;
  background-color: #28a745;
  color: white;
  font-size: 18px;
  font-weight: 600;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

/* Error message styling */
.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}

/* Footer styling */
.footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.footer a {
  color: #007bff;
}

/* Responsive design for tablets and smaller devices (max-width: 1024px) */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column; /* Stack the image and form vertically */
    width: 90%;
  }

  .image-container {
    max-width: 100%;
    margin-top: 50px;
    margin-bottom: 20px; /* Add space between image and form */
  }

  .login-container {
    width: 80%;
    padding: 30px;
  }

  .logo-image {
    width: 70%; /* Adjust image size */
    max-width: 350px;
  }

  /* Adjust font sizes and button for smaller devices */
  label {
    font-size: 14px;
  }

  input {
    font-size: 12px;
  }

  button {
    font-size: 16px;
    padding: 12px 0;
  }
}

/* Responsive design for mobile devices (max-width: 768px) */
@media (max-width: 768px) {
  #bg {
    background-size: 100% 100%;
    padding: 15px; /* Ensure spacing around the content */
    align-items: flex-start; /* Align content to the top on small devices */
  }

  #res {
    text-align: right; /* Align to the right */
    margin-left: 0; /* Remove unnecessary left margin */
    margin-top: 10px; /* Ensure proper spacing */
    font-size: 12px; /* Adjust font size for mobile */
  }

  .form-group {
    margin-bottom: 15px; /* Reduce space between form fields */
  }

  .content-wrapper {
    flex-direction: column; /* Stack content vertically */
    width: 100%;
    padding: 10px;
  }

  .image-container {
    width: 100%; /* Full-width for mobile */
    margin-bottom: 30px; /* Increase spacing */
  }

  .logo-image {
    width: 60%; /* Adjust logo size for mobile */
    max-width: 300px;
  }

  .login-container {
    margin-top: 20px; /* Add some space above the form */
    margin-bottom: 20px; /* Add space below the form to avoid cutting off background */
  }

  label {
    font-size: 12px;
  }

  input {
    font-size: 12px;
    height: 45px;
  }

  button {
    font-size: 16px;
    padding: 12px 0;
  }
}

/* Extra small devices (below 576px) */
@media (max-width: 576px) {
  .login-container {
    width: 100%;
    max-width: 100%; /* Ensure the form takes up the full width */
    padding: 10px;
  }

  .logo-image {
    width: 50%;
    max-width: 250px;
  }

  .content-wrapper {
    padding: 5%;
  }

  label {
    font-size: 14px;
  }

  input {
    font-size: 12px;
    height: 40px;
  }

  button {
    font-size: 14px;
    padding: 10px 0;
  }
}

/* Extra small devices (below 576px) */
@media (max-width: 576px) {
  .login-container {
    margin-top: -30px;
    width: 100%;
    padding: 15px;
  }

  .logo-image {
    margin-top: -90px;
    width: 50%;
    max-width: 250px;
  }

  .content-wrapper {
    padding: 5%;
  }

  label {
    font-size: 14px;
  }

  input {
    font-size: 12px;
    height: 40px;
  }

  button {
    font-size: 14px;
    padding: 10px 0;
  }
}

</style>
