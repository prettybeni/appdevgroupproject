const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // The URL where your Node server is running
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, // This removes "/api" from the request before forwarding
      },
    },
  },
};