<script lang="ts" setup>
import type { IUser } from '@interfaces/user.interface'

defineProps<{
  user: IUser
}>()
</script>

<template>
  <div class="avatar placeholder">
    <div class="bg-neutral-focus text-neutral-content w-12 h-12 mask mask-squircle uppercase">
      <span>{{ user.firstName[0] + user.lastName[0] }}</span>
    </div>
  </div>
</template>
