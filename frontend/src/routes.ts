import { RouteRecordRaw } from 'vue-router'
import AuthView from './views/AuthView.vue'
import HomeView from './views/HomeView.vue'
import ShoppingListView from './views/ShoppingListView.vue'
import RegisterView from './views/RegisterView.vue'
import LoginView from './views/LoginView.vue'
import JoinView from './views/JoinView.vue'
import SettingsView from './views/SettingsView.vue'
import MembersView from './views/MembersView.vue'

import { useUser } from './composables/useUser'
const { user } = useUser()

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    beforeEnter(from) {
      if (user.value && user.value.flatId) {
        console.log('bin in auth, user und flat gesetzt, redirect to /')

        return {
          path: '/',
        }
      }
      if (from.path !== '/flat' && user.value && !user.value.flatId) {
        console.log('bin in auth, user gesetzt, aber keine flat, redirect to /flat')

        return {
          path: '/flat',
        }
      } else return
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
            console.log('bin in /flat und kein user ist gesetzt, redirect to /register')

            return {
              path: '/register',
            }
          }
          if (user.value.flatId) {
            console.log('bin in /flat und user ist gesetzt, redirect to /')

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
        console.log('bin in "" user nicht gesetzt, redirect to register')
        return {
          path: '/register',
        }
      }
      if (!user.value?.flatId) {
        console.log('bin in "" keine flat id, redirect to flat')

        return {
          path: '/flat',
        }
      }
    },
    component: HomeView,
    children: [
      {
        path: 'members',
        component: MembersView,
      },
      {
        path: 'shopping',
        component: ShoppingListView,
      },
      {
        path: 'split',
        component: () => import('./views/SplitView.vue'),
      },
      {
        path: '/profile',
        component: SettingsView,
      },
    ],
  },
]

export { routes }
