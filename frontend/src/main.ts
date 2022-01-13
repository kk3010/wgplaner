import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
import axios from 'axios'
import { useAuth } from './composables/useAuth'
import { useUser } from './composables/useUser'
import { initSse } from '@/composables/useSse'

const { user, getUser } = useUser()
const { addAxiosAuth } = useAuth(user)

addAxiosAuth()
axios.defaults.baseURL = '/api'

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes: routes, // short for `routes: routes`
})

getUser()
  .catch()
  .finally(() => {
    initSse()
    const app = createApp(App)

    app.use(router)

    app.mount('#app')
  })
