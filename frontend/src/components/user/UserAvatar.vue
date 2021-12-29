<script lang="ts" setup>
import { computed, type StyleValue } from 'vue'
import type { IUser } from '@interfaces/user.interface'

const props = defineProps<{
  user: IUser
}>()

const userStyle = computed(() => ({
  '--user-background': props.user.color,
} as StyleValue))
</script>

<template>
  <div class="avatar placeholder">
    <div
      class="w-12 h-12 mask mask-squircle uppercase"
      :class="
        user.color
          ? ['bg-[color:var(--user-background)]', user.textWhite ? 'text-gray-100' : 'text-gray-800']
          : 'bg-neutral-focus text-neutral-content'
      "
      :style="userStyle"
      v-bind="$attrs"
    >
      <span class="font-bold">{{ user.firstName[0] + user.lastName[0] }}</span>
    </div>
  </div>
</template>
