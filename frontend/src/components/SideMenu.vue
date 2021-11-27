<script setup lang="ts">
const routes = [
  {
    link: '/putzplan',
    text: 'putzplan',
  },
  {
    link: '/einkaufsliste',
    text: 'einkaufsliste',
  },
]
</script>

<template>
  <div class="drawer-side h-screen">
    <label for="my-drawer" class="drawer-overlay"></label>
    <aside class="bg-base-100 text-base-content border-r border-base-200">
      <div class="py-1 inset-x-0 top-0 sticky z-50 border-b border-base-200">
        <div class="navbar justify-center">
          <RouterLink class="font-bold text-3xl btn btn-ghost" to="/"> Mi Casa </RouterLink>
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
