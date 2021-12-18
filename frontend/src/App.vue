<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useUser } from './composables/useUser'

const { getUser } = useUser()

onBeforeMount(async () => await getUser())
</script>

<template>
  <!-- mx center items-->
  <div class="container h-screen mx-auto">
    <router-view></router-view>
  </div>
</template>
