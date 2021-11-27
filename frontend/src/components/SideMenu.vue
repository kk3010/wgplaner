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
    <ul class="menu mr-2 p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
      <li v-for="route in routes" :key="route.link" class="font-semibold uppercase">
        <router-link :to="route.link"> {{ route.text }} </router-link>
      </li>
    </ul>
  </div>
</template>
