<script setup lang="ts">
import { onMounted } from 'vue'
import SideMenu from '@/components/SideMenu.vue'
import MenuComponent from '@/components/MenuComponent.vue'
import { useFlat } from '../composables/useFlat'
import ToastAlert from '@/components/ToastAlert.vue'

const { getFlat } = useFlat()

onMounted(async () => {
  await getFlat()
})
</script>

<template>
  <div class="drawer drawer-mobile">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <main class="flex flex-col drawer-content lg:overflow-hidden">
      <MenuComponent />
      <div class="p-4 md:p-4 lg:p-10 overflow-auto">
        <router-view></router-view>
      </div>
    </main>
    <SideMenu />
    <ToastAlert />
  </div>
</template>
