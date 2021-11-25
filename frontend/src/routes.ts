import { RouteRecordRaw } from 'vue-router'
import AuthView from './views/AuthView.vue'
import HomeView from './views/HomeView.vue'
import CleaningScheduleView from './views/CleaningScheduleView.vue'
import ShoppingListView from './views/ShoppingListView.vue'

const routes: RouteRecordRaw[] = [
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
        path: '',
        component: AuthView
      }
    ]
  },
    { path: '/auth', component: AuthView },
  ]

export {routes}