<script setup lang="ts">
import { ref } from 'vue'
import SideMenu from '@/components/SideMenu.vue'
import MenuComponent from '@/components/MenuComponent.vue'

const drawerOpen = ref(false)
</script>

<template>
  <div class="drawer drawer-mobile">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" v-model="drawerOpen" />
    <main class="flex flex-col drawer-content">
      <MenuComponent />
      <router-view></router-view>
    </main>
    <SideMenu @click="drawerOpen = false" />
  </div>
</template>
