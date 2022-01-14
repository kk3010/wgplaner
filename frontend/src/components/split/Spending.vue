<script lang="ts" setup>
import { useFlat } from '@/composables/useFlat'
import type { IPurchase } from '@interfaces/purchase.interface'
import { computed } from 'vue'
import UserAvatar from '../user/UserAvatar.vue'

const props = defineProps<{
  purchase: IPurchase
}>()

const { flat } = useFlat()
const buyer = computed(() => flat.value?.members.find((member) => member.id === props.purchase.buyerId))
</script>

<template>
  <div class="card shadow-lg collapse collapse-arrow w-full">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      <div class="stat place-content-center bg-transparent">
        <div class="stat-figure">
          <UserAvatar v-if="buyer" :user="buyer"></UserAvatar>
        </div>
        <div class="stat-value">{{ purchase.price.toFixed(2) }} €</div>
        <div class="stat-title mb-2 opacity-100 font-bold">
          <h3>{{ purchase.name }}</h3>
        </div>
        <div class="stat-desc opacity-100">
          <span class="badge badge-info badge-lg">{{ purchase.shoppingItems?.length ? 'Purchase' : 'Spending' }}</span>
        </div>
      </div>
    </div>
    <div class="collapse-content px-10">
      <label>
        <span class="text-lg font-bold opacity-80">Payers</span>
        <div class="mb-6 -space-x-4 avatar-group" v-if="purchase.payers && purchase.payers.length > 0">
          <UserAvatar v-for="payer in purchase.payers" :key="payer.id" :user="payer" />
        </div>
      </label>
      <label v-if="purchase.shoppingItems && purchase.shoppingItems.length > 0">
        <span class="text-lg font-bold opacity-80">Purchased Items</span>
        <ul class="list-none">
          <li v-for="item in purchase.shoppingItems" :key="item.id">{{ item.quantity }}x {{ item.name }}</li>
        </ul>
      </label>
    </div>
  </div>
</template>

<style scoped>
.avatar-group > .avatar {
  @apply !border-base-content/10 bg-base-100;
}
</style>
