<script setup lang="ts">
import type { IUser } from '@interfaces/user.interface'

defineProps<{
  members: IUser[]
}>()
</script>

<template>
  <div v-for="member in members" :key="member.id" class="avatar placeholder">
    <div class="bg-neutral-focus text-neutral-content rounded-full w-16 h-16">
      <span>{{ member.firstName }}</span>
    </div>
  </div>
</template>
