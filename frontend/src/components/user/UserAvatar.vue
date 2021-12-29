<script lang="ts" setup>
import type { IUser } from '@interfaces/user.interface'

defineProps<{
  user: IUser
}>()
</script>

<template>
  <div class="avatar placeholder">
    <div class="w-12 h-12 mask mask-squircle uppercase" :class="user.color ? `[--avatar-color:${user.color}] dynamic-color` : 'bg-neutral-focus text-neutral-content'" v-bind="$attrs">
      <span>{{ user.firstName[0] + user.lastName[0] }}</span>
    </div>
  </div>
</template>

