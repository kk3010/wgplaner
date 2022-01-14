<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SideMenu from '@/components/SideMenu.vue'
import MenuComponent from '@/components/MenuComponent.vue'
import { useFlat } from '../composables/useFlat'
import ToastAlert from '@/components/ToastAlert.vue'
import { initSse } from '@/composables/useSse'

const drawerOpen = ref(false)
const { getFlat } = useFlat()

onMounted(async () => {
  await getFlat()
  initSse()
})
</script>

<template>
  <div class="drawer drawer-mobile">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" v-model="drawerOpen" />
    <main class="flex flex-col drawer-content lg:overflow-hidden">
      <MenuComponent />
      <div class="p-2 md:p-4 lg:p-10">
        <router-view></router-view>
      </div>
    </main>
    <SideMenu @click="drawerOpen = false" />
    <ToastAlert />
  </div>
</template>
