<script lang="ts" setup>
import { computed } from "vue";
import type { IUser } from '@interfaces/user.interface'

const props = defineProps<{
  user: IUser
}>()

const userStyle = computed(() => ({
  '--user-background': props.user.color,
}))
</script>

<template>
  <div class="avatar placeholder">
    <div class="w-12 h-12 mask mask-squircle uppercase"
    :class="[
      user.color ? 'bg-[color:var(--user-background)]' : 'bg-neutral-focus text-neutral-content',
      user.textWhite ? 'text-gray-100' : 'text-gray-800'
    ]"
    :style="userStyle"
    v-bind="$attrs"
    >
      <span class="font-bold">{{ user.firstName[0] + user.lastName[0] }}</span>
    </div>
  </div>
</template>

