<template>
  <div id="bg">
    <!-- Container for the reset password form -->
    <div class="content-wrapper">
      <!-- Image on the left side -->
      <div class="image-container">
        <img src="../../public/img/logo.png" alt="Logo" class="logo-image" />
      </div>

      <!-- Reset Password form on the right side -->
      <div class="login-container">
        <h1>Reset Password</h1><br><br>
        
        <form @submit.prevent="submitNewPassword">
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input 
              type="password" 
              id="newPassword" 
              v-model="newPassword" 
              required 
              placeholder="Enter new password" 
            />
          </div>
  
          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              required 
              placeholder="Confirm new password" 
            />
          </div>

          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      errorMessage: ''
    };
  },
  methods: {
    async submitNewPassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      this.errorMessage = '';

      try {
        const token = this.$route.params.token;
        if (!token) {
          this.errorMessage = "Invalid or expired token.";
          return;
        }

        const response = await fetch(`http://localhost:5000/api/password-changed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            newPassword: this.newPassword
          })
        });

        if (response.status === 200) {
          this.$router.push('/password-changed');
        } else {
          const data = await response.json();
          this.errorMessage = data.message || 'An error occurred. Please try again.';
        }
      } catch (error) {
        this.errorMessage = 'An error occurred. Please try again.';
      }
    }
  }
};
</script>

<style scoped>
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

.content-wrapper {
  display: flex;
  width: 80%;
  max-width: 1200px;
}

.image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  width: 80%;
  max-width: 400px;
  height: auto;
  margin-right: 200px;
}

.login-container {
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
  box-sizing: border-box; /* Ensures padding doesn't affect the width */
  width: 100%;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.07);
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
</style>
