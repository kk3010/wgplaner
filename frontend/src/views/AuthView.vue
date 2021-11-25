<script setup lang="ts">
import LoginComponent from '@/components/LoginComponent.vue'

defineProps<{
  show: boolean
}>()
</script>

<template>
    <LoginComponent></LoginComponent>
</template>