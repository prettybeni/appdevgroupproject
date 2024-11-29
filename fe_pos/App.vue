<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/add-product">Add Product</router-link></li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #f7dede; /* Updated background color */
}

nav {
  margin-bottom: 1rem;
}

nav ul {
  display: flex;
  list-style-type: none;
  padding: 0;
  justify-content: center;
  gap: 1rem;
}

nav li {
  font-size: 1.2rem;
}

router-link {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

router-link:hover {
  color: #0056b3;
}
</style>
