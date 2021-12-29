import { RouteRecordRaw } from 'vue-router'
import AuthView from './views/AuthView.vue'
import HomeView from './views/HomeView.vue'
import ShoppingListView from './views/ShoppingListView.vue'
import RegisterView from './views/RegisterView.vue'
import LoginView from './views/LoginView.vue'
import JoinView from './views/JoinView.vue'
import SettingsView from './views/SettingsView.vue'

import { useUser } from './composables/useUser'
const { user } = useUser()

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    beforeEnter() {
      if (user.value && user.value.flatId) {
        return {
          path: '/',
        }
      }
      if (user.value && !user.value.flatId) {
        return {
          path: '/flat',
        }
      }
    },
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
          if (!user.value) {
            return {
              path: '/register',
            }
          }
          if (user.value.flatId) {
            return {
              path: '/',
            }
          }
        },
        component: JoinView,
      },
    ],
  },
  {
    path: '',
    beforeEnter() {
      if (!user.value) {
        return {
          path: '/register',
        }
      }
    },
    component: HomeView,
    children: [
      {
        path: 'shopping',
        component: ShoppingListView,
      },
      {
        path: 'split',
        component: () => import('./views/SplitView.vue'),
      },
      {
        path: "/profile",
        component: SettingsView,
      }
    ],
  },
]

export { routes }
