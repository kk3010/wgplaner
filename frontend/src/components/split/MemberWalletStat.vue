<script lang="ts" setup>
import type { IUser } from '@interfaces/user.interface'
import type { IWallet } from '@interfaces/wallet.interface'
import UserAvatar from '../user/UserAvatar.vue'

defineProps<{
  user: IUser
  wallet: IWallet
}>()

defineEmits<{
  (event: 'payback'): void
}>()
</script>

<template>
  <div class="stat place-items-center place-content-center">
    <div class="stat-figure">
      <UserAvatar :user="user" />
    </div>
    <div class="stat-title">{{ user?.firstName }}</div>
    <div class="stat-value" :class="wallet.balance >= 0 ? 'text-green-600' : 'text-red-700'">
      {{ wallet.balance.toFixed(2) }}
    </div>
    <div class="stat-actions">
      <slot :user="user" />
    </div>
  </div>
</template>
