import { RouteRecordRaw } from 'vue-router'
import AuthView from './views/AuthView.vue'
import HomeView from './views/HomeView.vue'
import CleaningScheduleView from './views/CleaningScheduleView.vue'
import ShoppingListView from './views/ShoppingListView.vue'
import RegisterView from './views/RegisterView.vue'

/* const routes: RouteRecordRaw[] = [
  { 
    path: '/', 
    component: HomeView, 
    children: [
      {
        path: 'Putzplan',
        component: CleaningScheduleView
      },
      {
        path: 'Einkaufsliste',
        component: ShoppingListView
      },
      {
        path: 'login',
        component: AuthView
      },
      {
        path: '',
        component : RegisterView
      },

    ]
  },
    { path: '/auth', component: AuthView },
  ] */
const routes: RouteRecordRaw[] = [
  { 
    path: '/', 
    component: RegisterView, 
  },
  { 
    path: '/login', 
    component: AuthView 
  },
  { 
    path: '/auth', 
    component: HomeView, 
    children: [
      {
        path: 'Putzplan',
        component: CleaningScheduleView
      },
      {
        path: 'Einkaufsliste',
        component: ShoppingListView
      },
  ]},
  ]

export {routes}