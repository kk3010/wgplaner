<script lang="ts" setup>
import type { IPurchase } from '@interfaces/purchase.interface'
import UserAvatar from '../user/UserAvatar.vue'

defineProps<{
  purchase: IPurchase
}>()
</script>

<template>
  <div class="card shadow-lg collapse collapse-arrow col-span-1 w-full">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      <h2 class="card-title">{{ purchase.name }}</h2>

      <span class="badge badge-info mb-4">{{
        purchase.shoppingItems && purchase.shoppingItems.length > 0 ? 'Purchase' : 'Spending'
      }}</span>

      <div class="ml-0">
        <div class="stat-value" :class="purchase.price <= 0 ? 'text-green-400' : 'text-red-400'">
          {{ purchase.price.toFixed(2) }} €
        </div>
        <!-- <UserAvatar :user="buyer!"></UserAvatar> -->
      </div>
    </div>
    <div class="collapse-content">
      <h3 class="card-title">Payers:</h3>
      <div class="mb-6 -space-x-4 avatar-group" v-if="purchase.payers && purchase.payers.length > 0">
        <UserAvatar v-for="payer in purchase.payers" :key="payer.id" :user="payer" />
      </div>
      <div class="mb-3">
        <h3 class="card-title" v-if="purchase.shoppingItems && purchase.shoppingItems.length > 0">Purchased Items:</h3>
        <p v-for="item in purchase.shoppingItems" :key="item.id">{{ item.quantity }}x {{ item.name }}</p>
      </div>
    </div>
  </div>
</template>
