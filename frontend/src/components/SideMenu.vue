<script setup lang="ts">
import { useFlat } from '@/composables/useFlat'

const routes = [
  {
    link: '/shopping',
    text: 'shopping',
  },
]

const { flat } = useFlat()
</script>

<template>
  <div class="drawer-side h-screen">
    <label for="my-drawer" class="drawer-overlay"></label>
    <aside class="bg-base-100 text-base-content w-60">
      <div class="py-1 inset-x-0 top-0 sticky z-50">
        <div class="navbar justify-center">
          <RouterLink class="font-bold text-xl truncate" to="/"> {{ flat?.name }}</RouterLink>
        </div>
      </div>
      <ul class="menu p-4 space-y-2">
        <li v-for="route in routes" :key="route.link" class="font-semibold uppercase">
          <router-link :to="route.link" active-class="active"> {{ route.text }} </router-link>
        </li>
      </ul>
    </aside>
  </div>
</template>
