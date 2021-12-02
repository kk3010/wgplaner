import { RouteRecordRaw } from 'vue-router'
import AuthView from './views/AuthView.vue'
import HomeView from './views/HomeView.vue'
import CleaningScheduleView from './views/CleaningScheduleView.vue'
import ShoppingListView from './views/ShoppingListView.vue'
import RegisterView from './views/RegisterView.vue'
import LoginView from './views/LoginView.vue'
import JoinView from './views/JoinView.vue'

import { useUser } from './composables/useUser'
import { useFlat } from './composables/useFlat'
const { user } = useUser()
const { flat } = useFlat()

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    beforeEnter() {
      if (user.value && flat.value)
        return {
          path: '/',
        }
      else if (user.value && !flat.value)
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
    beforeEnter() {
      if (!user.value)
        return {
          path: '/auth',
        }
    },
    component: HomeView,
    children: [
      {
        path: 'cleaning',
        component: CleaningScheduleView,
      },
      {
        path: 'shopping',
        component: ShoppingListView,
      },
    ],
  },
]

export { routes }
