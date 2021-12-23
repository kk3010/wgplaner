<script setup lang="ts">
import { useFlat } from '@/composables/useFlat'

const { flat } = useFlat()
const members = flat.value?.members
members?.forEach((member) => {
  console.log(member.firstName)
})
</script>

<template>
  <div v-for="member in members" :key="member.id" class="avatar placeholder">
    <div class="bg-neutral-focus text-neutral-content rounded-full w-16 h-16">
      <span>{{ member.firstName }}</span>
    </div>
  </div>
</template>
