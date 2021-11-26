<script setup lang="ts">
import SideMenu from '@/components/SideMenu.vue'
import MenuComponent from '@/components/MenuComponent.vue'

defineProps<{
  show: boolean
}>()
</script>

<template >
  <div class="drawer drawer-mobile">
    <input id="my-drawer" type="checkbox" class="drawer-toggle">
    <div class="flex flex-col drawer-content">
      <MenuComponent />
      <router-view></router-view>
    </div>
      <SideMenu></SideMenu>
  </div>
</template>