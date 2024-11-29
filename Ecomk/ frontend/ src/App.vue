<template>
    <router-view />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';


export default {
  name: 'App',
  components: {
    HelloWorld
  },
mounted() {
  const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
}
}

</script>

<style>
#app {
  font-family: Poppins, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #f7dede;
  height: 100%;
  min-height: 100vh;
}

img {
  width: 100px;
  height: auto;
}

h1 {
  font-weight: normal;
  font-size: 30px;
  margin: 0;
  padding: 0;
}
</style>
