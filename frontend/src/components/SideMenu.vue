<script setup lang="ts">
import { useFlat } from '@/composables/useFlat'
import { useRoute } from 'vue-router'
import { HomeIcon } from '@heroicons/vue/outline'
import { ShoppingCartIcon } from '@heroicons/vue/outline'
import { CashIcon } from '@heroicons/vue/outline'

const routes = [
  {
    link: '/shopping',
    text: 'Shopping',
    icon: ShoppingCartIcon,
  },
  {
    link: '/split',
    text: 'Split',
    icon: CashIcon,
  },
]

const handleClose = () => {
  ;(document.getElementById('my-drawer') as HTMLInputElement).checked = false
}

const { flat } = useFlat()
const route = useRoute()
</script>

<template>
  <div class="drawer-side h-screen">
    <label for="my-drawer" class="drawer-overlay"></label>
    <aside class="bg-base-100 text-base-content w-56 mr-4 lg:rounded-box">
      <div class="py-1 inset-x-0 top-0 sticky z-50">
        <div class="navbar justify-center">
          <RouterLink class="font-bold text-xl truncate" to="/"> {{ flat?.name }}</RouterLink>
        </div>
      </div>
      <ul class="menu p-4 space-y-2" @click="handleClose">
        <li key="/" class="font-semibold uppercase">
          <router-link to="/" :active-class="route.path === '/' ? 'active' : ''">
            <HomeIcon class="w-5 h-5 mr-3" /> Home
          </router-link>
        </li>
        <li v-for="route in routes" :key="route.link" class="font-semibold uppercase">
          <router-link :to="route.link" active-class="active">
            <component :is="route.icon" class="w-5 h-5 mr-3" /> {{ route.text }}
          </router-link>
        </li>
      </ul>
    </aside>
  </div>
</template>
