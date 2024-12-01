<template>
  <div id="bg">
    <div class="content-wrapper">
      <div class="image-container">
        <img src="../../public/img/logo.png" alt="Logo" class="logo-image" />
      </div>
      <div class="register-container">
        <h1>Register</h1>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input v-model="username" type="text" id="username" placeholder="Enter your username" required />
          </div>
          <div class="form-group">
            <div class="name-labels">
              <label for="first_name">First Name</label>
              <label for="last_name">Last Name</label>
            </div>
            <div class="name-inputs">
              <input v-model="first_name" type="text" id="first_name" placeholder="Enter your first name" required />
              <input v-model="last_name" type="text" id="last_name" placeholder="Enter your last name" required />
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model="email" type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input v-model="phone" type="tel" id="phone" placeholder="Enter your phone number" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input v-model="password" type="password" id="password" placeholder="Enter your password" required />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder="Confirm your password" required />
          </div>
          <button type="submit">Register</button>
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success">{{ successMessage }}</div>
          <div class="footer">
            <p>Already have an account? <router-link to="/">Log in</router-link></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      successMessage: '',
    };
  },
  methods: {
    async submitForm() {
      this.errorMessage = '';
      this.successMessage = '';

      // Form validation
      if (this.username.length < 4) {
        this.errorMessage = 'Username must be at least 4 characters long.';
        return;
      }
      if (!this.email.includes('@')) {
        this.errorMessage = 'Please enter a valid email address.';
        return;
      }
      if (this.phone.length < 11) {
        this.errorMessage = 'Phone number must be at least 11 characters long.';
        return;
      }
      if (this.password.length < 8) {
        this.errorMessage = 'Password must be at least 8 characters long.';
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match!';
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/register', {
          username: this.username,
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          phone: this.phone,
          password: this.password,
        });

        if (response.status === 201) {
          this.$router.push('/');
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.errorMessage = 'Email or username already exists';
        } else {
          this.errorMessage = 'Email is already in use.';
        }
        console.error(error);
      }
    },
  },
};
</script>

<style>
/* General Styles for Body and HTML */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: Arial, sans-serif;
  overflow-x: hidden; /* Prevent horizontal scroll */
  overflow-y: auto; /* Allow vertical scrolling */
}

/* Background gradient */
#bg {
  background: linear-gradient(45deg, #D8C4A3, #A3D8C4, #D8A3C4);
  background-size: 600% 600%;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align items at the top */
  min-height: 100vh; /* Fallback for viewport height */
  height: auto; /* Adjust height dynamically */
  animation: gradientAnimation 15s ease infinite;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Content Wrapper - Centering the form */
.content-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  min-height: 100vh; /* Ensure it covers full viewport if content is small */
}

.image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  min-width: 200px;
  margin-top: 50px;
}

.logo-image {
  width: 80%;
  max-width: 400px;
  height: auto;
}

/* Register Container - Form Styling */
.register-container {
  flex: 1;
  padding: 30px;
  padding-top: 10px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.13);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  min-width: 320px;
  max-width: 500px;
  z-index: 1;
  /* Add this to ensure it affects the layout's height */
}

h1 {
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

input {
  display: block;
  width: 100%;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 300;
}

input::placeholder {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.name-inputs {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.name-inputs input {
  width: 48%;
}

button {
  margin-top: 20px;
  width: 100%;
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

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.success {
  color: green;
  margin-top: 10px;
  text-align: center;
}

.footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.footer a {
  color: #007bff;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 15px;
  }

  .image-container {
    flex: 0 1 100%;
    margin-bottom: 30px;
    text-align: center;
  }

  .register-container {
    flex: 0 1 100%;
    width: 100%;
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .logo-image {
    max-width: 300px;
    width: 80%;
  }

  .register-container {
    max-width: 400px;
    width: 90%;
    margin: 0 auto;
  }

  h1 {
    font-size: 24px;
  }

  input,
  button {
    font-size: 14px;
    padding: 12px 0;
  }

  .name-inputs input {
    width: 48%;
  }
}

@media (max-width: 576px) {
  .logo-image {
    width: 70%;
    max-width: 250px;
  }

  .register-container {
    max-width: 350px;
    padding: 20px;
    width: 90%;
  }

  .form-group {
    margin-bottom: 15px;
  }

  button {
    font-size: 16px;
    padding: 14px 0;
  }

  h1 {
    font-size: 20px;
  }
}
</style>
