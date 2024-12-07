<template class="body">
  <div id="bg">
    <!-- Container for the image and reset password form -->
    <div class="content-wrapper">
      <!-- Image on the left side -->
      <div class="image-container">
        <img src="../../public/img/logo.png" alt="Logo" class="logo-image" />
      </div>

      <!-- Reset password form on the right side -->
      <div class="reset-password-container">
        <h1>Reset Password</h1>
        <form @submit.prevent="handleResetPassword">
          <div class="form-group">
            <label for="usernameOrEmail">Email or Username</label>
            <input 
              type="text" 
              id="usernameOrEmail" 
              v-model="usernameOrEmail" 
              required 
              placeholder="Enter your email or username" 
            />
          </div>
          <button type="submit">Send Reset Link</button>
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success">{{ successMessage }}</div>
        </form>
        <div class="footer">
          <p>Remembered your password? <router-link to="/">Login here</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usernameOrEmail: '', 
      errorMessage: '', 
      successMessage: '', 
    };
  },
  methods: {
    async handleResetPassword() {
      this.errorMessage = ''; 
      this.successMessage = ''; 

      const resetPasswordUrl = 'http://localhost:5000/api/reset-password';

      try {
        const response = await fetch(resetPasswordUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ identifier: this.usernameOrEmail }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          this.errorMessage = errorData.message || 'Unable to send reset link. Please try again.';
          return;
        }

        const data = await response.json();
        if (data.success) {
          this.successMessage = 'Reset password email sent.';
        } else {
          this.errorMessage = 'Unable to process the request. Please check your input and try again.';
        }
      } catch (error) {
        this.errorMessage = 'An error occurred. Please try again later.';
      }
    },
  },
};
</script>

<style>
/* Apply background color and animation */
#bg {
  background: linear-gradient(45deg, #D8C4A3, #A3D8C4, #D8A3C4);
  height: 100vh;
  background-size: 600% 600%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: gradientAnimation 15s ease infinite;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Container for image and reset password form side by side */
.content-wrapper {
  display: flex;
  width: 80%;
  max-width: 1200px;
  flex-wrap: wrap; /* Allow wrapping on smaller devices */
  justify-content: center;
  align-items: center;
}

.image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px; /* Add space below image for mobile */
}

.logo-image {
  width: 80%;
  max-width: 400px;
  height: auto;
}

.reset-password-container {
  flex: .6;
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
  width: 100%;
  max-width: 450px; /* Limit the form width */
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
  margin-bottom: 10px;
}

input {
  display: block;
  width: 100%;
  box-sizing: border-box;
  height: 50px;
  background-color: rgba(255,255,255,0.07);
  border-radius: 3px;
  padding: 0 16px;
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

h1 {
  margin-bottom: 30px;
}

/* Responsive design for tablets and smaller devices (max-width: 1024px) */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: row; /* Keep image on the left and form on the right */
    justify-content: center;
    align-items: center;
    width: 90%;
  }

  .image-container {
    flex: 1;
    max-width: 400px;
    margin-right: 20px; /* Add some margin to separate the image from the form */
  }

  .reset-password-container {
    flex: 1.2;
    width: 50%;
    padding: 40px;
    margin-top: 20px; /* Add space between image and form */
  }

  .logo-image {
    width: 70%;
    max-width: 350px;
  }
}

/* Responsive design for mobile devices (max-width: 768px) */
@media (max-width: 768px) {
  #bg {
    background-position: center center;
    background-size: 100% 100%;
    flex-direction: column;
    padding: 0 15px;
  }

  .content-wrapper {
    width: 100%;
    flex-direction: column; /* Stack content vertically */
    justify-content: center;
    align-items: center; /* Center the content */
    text-align: center;
  }

  .image-container {
    width: 100%; /* Full width for mobile */
    margin-bottom: 30px;
  }

  .logo-image {
    width: 60%; /* Adjust logo size for mobile */
    max-width: 300px;
  }

  .reset-password-container {
    width: 100%;
    padding: 20px;
    max-width: 400px;
    margin: 0 auto; /* Center the form */
  }

  label {
    font-size: 14px;
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
  .reset-password-container {
    width: 100%;
    max-width: 100%; /* Ensure form takes up full width */
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
    font-size: 12px;
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

h1{
  margin-bottom: 30px;
}
</style>
