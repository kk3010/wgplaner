<script setup lang="ts">
import SideMenu from '@/components/SideMenu.vue'
import MenuComponent from '@/components/MenuComponent.vue'
</script>

<template>
  <div class="drawer drawer-mobile">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <main class="flex flex-col drawer-content">
      <MenuComponent />
      <router-view></router-view>
    </main>
    <SideMenu></SideMenu>
  </div>
</template>
