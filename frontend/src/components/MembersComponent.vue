<script setup lang="ts">
import type { IUser } from '@interfaces/user.interface'
import UserAvatar from './user/UserAvatar.vue'

defineProps<{
  members: IUser[]
}>()
</script>

<template>
  <label class="label">
    <span class="label-text font-bold text-xl">Manage your members</span>
  </label>
  <UserAvatar v-for="member in members" :key="member.id" :user="member" class="m-1 h-20 w-20" />
</template>
