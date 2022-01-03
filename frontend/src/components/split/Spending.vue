<script lang="ts" setup>
import UserAvatar from '../user/UserAvatar.vue'
import { IPurchase } from '@interfaces/purchase.interface'

defineProps<{
  purchase: IPurchase
}>()
</script>

<template>
  <div class="card shadow-lg collapse collapse-arrow col-span-1 w-full">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      <h2 class="card-title">{{ purchase.name }}</h2>
      <span class="badge badge-outline mb-4" v-if="purchase.shoppingItems?.length > 0">Purchase</span>
      <span class="badge badge-outline mb-4" v-else>Transaction</span>
      <div class="ml-0">
        <div class="stat-value" :class="purchase.price <= 0 ? 'text-green-600' : 'text-red-700'">
          {{ purchase.price.toFixed(2) }} €
        </div>
      </div>
    </div>
    <div class="collapse-content">
      <h3 class="card-title">Payers:</h3>
      <UserAvatar class="m-1" v-for="payer in purchase.payers" :key="payer.id" :user="payer" />
      <br />
      <br />
      <h3 class="card-title" v-if="purchase.shoppingItems?.length > 0">Purchased Items:</h3>
      <p v-for="item in purchase.shoppingItems" :key="item.id">{{ item.name }}</p>
    </div>
  </div>
</template>
