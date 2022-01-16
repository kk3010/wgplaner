<script lang="ts" setup>
import UserAvatar from '../user/UserAvatar.vue'
import { TransitionPresets, useTransition } from '@vueuse/core'
import type { IUser } from '@interfaces/user.interface'
import { toRef } from 'vue'

const props = defineProps<{
  user: IUser
  balance: number
}>()

defineEmits<{
  (event: 'payback'): void
}>()

const balance = useTransition(toRef(props, 'balance'), {
  duration: 500,
  transition: TransitionPresets.easeInOutCubic,
})
</script>

<template>
  <div class="stat place-items-center place-content-center">
    <div class="stat-figure">
      <UserAvatar :user="user" />
    </div>
    <div class="stat-title">{{ user?.firstName + ' ' + user?.lastName }}</div>
    <div class="stat-value" :class="balance >= 0 ? 'text-green-400' : 'text-red-400'">{{ balance.toFixed(2) }} €</div>
    <div class="stat-actions">
      <slot :user="user" />
    </div>
  </div>
</template>
