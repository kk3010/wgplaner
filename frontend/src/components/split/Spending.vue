<script lang="ts" setup>
import UserAvatar from '../user/UserAvatar.vue'
import { TransitionPresets, useTransition } from '@vueuse/core'
import type { IUser } from '@interfaces/user.interface'
import { toRef } from 'vue'
import { IPurchase } from '@interfaces/purchase.interface'

const props = defineProps<{
  user: IUser
  balance: number
  purchase: IPurchase
}>()

const balance = useTransition(toRef(props, 'balance'), {
  duration: 500,
  transition: TransitionPresets.easeInOutCubic,
})
</script>

<template>
  <div class="card shadow-lg collapse collapse-arrow">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium flex-row">
      <h2 class="card-title">{{ purchase.name }}</h2>
      <span class="badge badge-outline mb-2" v-if="purchase.shoppingItems?.length > 0">Purchase</span>
      <span class="badge badge-outline mb-2" v-else>Transaction</span>
      <div class="ml-0">
        <div class="stat-value" :class="balance <= 0 ? 'text-green-600' : 'text-red-700'">
          {{ -balance.toFixed(2) }} €
        </div>
      </div>
    </div>
    <div class="collapse-content">
      <h3 class="card-title">Payers:</h3>
      <UserAvatar class="m-1" v-for="payer in purchase.payers" :key="payer.id" :user="payer" />
      <br />
      <br />
      <h3 class="card-title">Purchased Items:</h3>
      <p v-for="item in purchase.shoppingItems" :key="item.id">{{ item.name }}</p>
    </div>
  </div>
</template>
