<script setup lang="ts">
import SideMenu from '@/components/SideMenu.vue'
import {useSideMenu} from '@/composables/useSideMenu'
import MenuComponent from '@/components/MenuComponent.vue'

defineProps<{
  show: boolean
}>()
const {isOpen} = useSideMenu()
</script>

<template>
    <MenuComponent />
    <SideMenu v-if="isOpen"></SideMenu>
    <router-view></router-view>
</template>