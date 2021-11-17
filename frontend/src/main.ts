import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

if (import.meta.env.DEV) {
  const { worker } = require('./mocks/browser')
  worker.start()
}

createApp(App).mount('#app')
