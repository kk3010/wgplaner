<script lang="ts" setup>
import UserAvatar from '../user/UserAvatar.vue'
import type { IUser } from '@interfaces/user.interface'
import type { IPurchase } from '@interfaces/purchase.interface'
import { computed, toRefs } from 'vue'

const props = defineProps<{
  members: IUser[]
  purchase: IPurchase
}>()

const { members, purchase } = toRefs(props)

const payers = computed(
  () =>
    purchase.value.payerIds
      .map((id) => members.value.find((member) => member.id === id))
      .filter((member) => member !== undefined) as IUser[],
)
</script>

<template>
  <div class="card shadow-lg collapse collapse-arrow col-span-1 w-full">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      <h2 class="card-title">{{ purchase.name }}</h2>
      <span class="badge badge-outline mb-4" v-if="purchase.shoppingItems && purchase.shoppingItems.length > 0"
        >Purchase</span
      >
      <span class="badge badge-outline mb-4" v-else>Spending</span>
      <div class="ml-0">
        <div class="stat-value" :class="purchase.price <= 0 ? 'text-green-600' : 'text-red-700'">
          {{ purchase.price.toFixed(2) }} €
        </div>
      </div>
    </div>
    <div class="collapse-content">
      <h3 class="card-title">Payers:</h3>
      <div class="mb-6" v-if="payers.length">
        <UserAvatar class="m-1" v-for="payer in payers" :key="payer.id" :user="payer" />
      </div>
      <div class="mb-3">
        <h3 class="card-title" v-if="purchase.shoppingItems?.length">Purchased Items:</h3>
        <p v-for="item in purchase.shoppingItems" :key="item.id">{{ item.quantity }}x {{ item.name }}</p>
      </div>
    </div>
  </div>
</template>
