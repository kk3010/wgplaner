import { RouteRecordRaw } from 'vue-router'
import AuthView from './views/AuthView.vue'
import HomeView from './views/HomeView.vue'
import CleaningScheduleView from './views/CleaningScheduleView.vue'
import ShoppingListView from './views/ShoppingListView.vue'
import RegisterView from './views/RegisterView.vue'
import LoginView from './views/LoginView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
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
    ],
  },
  {
    path: '',
    component: HomeView,
    children: [
      {
        path: 'putzplan',
        component: CleaningScheduleView,
      },
      {
        path: 'einkaufsliste',
        component: ShoppingListView,
      },
    ],
  },
]

export { routes }
