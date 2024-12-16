import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';


const toastOptions = {
  position: "top-right",
  timeout: 3000, // Duration in milliseconds
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};


createApp(App).use(router).mount('#app')