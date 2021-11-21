<script setup lang="ts">
import LoginComponent from './components/LoginComponent.vue'
import MenuComponent from './components/MenuComponent.vue'
// import SideMenu from './components/SideMenu.vue'
</script>

<template>
  <!-- mx center items-->
  <main class="container mx-auto">
    <MenuComponent />
    <LoginComponent class="mx-auto" />
    <!-- <SideMenu /> -->
  </main>
</template>
