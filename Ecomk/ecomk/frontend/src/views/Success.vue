<template>
    <div class="success-page">
      <div class="success-container">
        <h1>Password Changed Successfully!</h1>
        <p>Your password has been successfully updated. You can now use your new password to log in.</p>
        <router-link to="/" class="btn">Go to Login</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PasswordChangeSuccess',
    methods: {
      submitNewPassword() {
        const token = this.$route.query.token; // Get token from query params
        const newPassword = this.newPassword;  // Assuming you have a newPassword data
  
        fetch('http://localhost:8080/api/reset-password1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, newPassword }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              // Redirect to the success page if password reset was successful
              this.$router.push({ name: 'PasswordChangeSuccess' });
            } else {
              // Handle error, show message
              this.errorMessage = data.message || 'An error occurred.';
            }
          })
          .catch(error => {
            console.error('Error:', error);
            this.errorMessage = 'An error occurred while resetting your password.';
          });
      }
    },
  };
  </script>
  
  <style scoped>
  .success-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f7f7f7;
  }
  
  .success-container {
    text-align: center;
    padding: 40px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
  }
  
  h1 {
    color: #28a745;
    font-size: 2rem;
  }
  
  p {
    color: #555;
    margin: 20px 0;
  }
  
  .btn {
    text-decoration: none;
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: bold;
    display: inline-block;
    margin-top: 20px;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  </style>
  