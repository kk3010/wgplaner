import { RouteRecordRaw } from 'vue-router'
import AuthView from './views/AuthView.vue'
import HomeView from './views/HomeView.vue'
import ShoppingListView from './views/ShoppingListView.vue'
import RegisterView from './views/RegisterView.vue'
import LoginView from './views/LoginView.vue'
import JoinView from './views/JoinView.vue'

import { useUser } from './composables/useUser'
const { user } = useUser()

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    async beforeEnter() {
      if (user.value && user.value.flatId)
        return {
          path: '/',
        }
      else if (user.value && !user.value.flatId)
        return {
          path: '/flat',
        }
    },
    redirect: '/register',
    component: AuthView,
    children: [
      {
        path: '/register',
        component: RegisterView,
      },
      {
        path: '/login',
        component: LoginView,
      },
      {
        path: '/flat',
        beforeEnter() {
          if (!user.value)
            return {
              path: '/register',
            }
        },
        component: JoinView,
      },
    ],
  },
  {
    path: '',
    async beforeEnter() {
      if (!user.value) {
        return {
          path: '/auth',
        }
      }
    },
    component: HomeView,
    children: [
      {
        path: 'shopping',
        component: ShoppingListView,
      },
    ],
  },
]

export { routes }
