<template>
  <div class="card">
    <h2>Verified</h2>
    <p>Your email has been successfully verified.</p>
    <p v-if="countdown > 0">Redirecting in {{ countdown }} seconds...</p>
    <p v-else>Redirecting...</p>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router'; // Use Vue Router for redirection

export default {
  data() {
    return {
      token: this.$route.query.token,  // Grab the token from the URL query
      countdown: 5,  // Countdown timer for redirect
      error: ''
    };
  },
  created() {
    this.verifyAccount();
    this.startRedirectCountdown();
  },
  methods: {
    async verifyAccount() {
      try {
        const token = this.$route.query.token;  // Retrieve token from query string
        const response = await axios.get(`http://localhost:5000/api/verify?token=${token}`);

        
      } catch (err) {
        if (err.response) {
          this.error = err.response.data.message;  // Display the error message from the backend
        } else {
          this.error = 'An error occurred';
        }
      }
    },
    startRedirectCountdown() {
      const interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(interval);
          this.$router.push('/');  // Redirect to the login page
        } 
      }, 1000); // Update every second
    }
  }
};
</script>

<style scoped>
.card {
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f8f8;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 20px auto;
  text-align: center;
}

h2 {
  color: #28a745; /* Success green */
}

p {
  color: #333;
  font-size: 16px;
}

.loading, .error {
  font-size: 18px;
  color: #d9534f; /* Error red */
}
</style>
