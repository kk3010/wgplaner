import { RouteRecordRaw } from 'vue-router'

import { useUser } from './composables/useUser'
const { user } = useUser()

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    beforeEnter(from) {
      if (user.value && user.value.flatId) {
        return {
          path: '/',
        }
      }
      if (from.path !== '/flat' && user.value && !user.value.flatId) {
        return {
          path: '/flat',
        }
      }
    },
    component: () => import('./views/AuthView.vue'),
    children: [
      {
        path: '/register',
        component: () => import('./views/RegisterView.vue'),
      },
      {
        path: '/login',
        component: () => import('./views/LoginView.vue'),
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
        component: () => import('./views/JoinView.vue'),
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
      if (!user.value?.flatId) {
        return {
          path: '/flat',
        }
      }
    },
    component: () => import('./views/HomeView.vue'),
    children: [
      {
        path: '',
        component: () => import('./views/MembersView.vue'),
      },
      {
        path: 'shopping',
        component: () => import('./views/ShoppingListView.vue'),
      },
      {
        path: 'split',
        component: () => import('./views/SplitView.vue'),
      },
      {
        path: '/profile',
        component: () => import('./views/SettingsView.vue'),
      },
    ],
  },
]

export { routes }
