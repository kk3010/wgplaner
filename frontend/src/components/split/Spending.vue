<script lang="ts" setup>
import { useFlat } from '@/composables/useFlat'
import type { IPurchase } from '@interfaces/purchase.interface'
import type { IUser } from '@interfaces/user.interface'
import { computed, toRefs } from 'vue'
import UserAvatar from '../user/UserAvatar.vue'

const { flat } = useFlat()

const props = defineProps<{
  members: IUser[]
  purchase: IPurchase
}>()

const { members, purchase } = toRefs(props)

const buyer = computed(() => flat.value?.members.find((member) => member.id === purchase.value.buyerId))

const payers = computed(
  () =>
    purchase.value.payerIds
      .map((id) => members.value.find((member) => member.id === id))
      .filter((member) => member !== undefined) as IUser[],
)

const isPurchase = !!props.purchase.shoppingItems?.length
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
          <span :class="(isPurchase ? 'badge-info' : 'badge-success') + ' badge badge-lg'">{{
            isPurchase ? 'Purchase' : 'Spending'
          }}</span>
        </div>
      </div>
    </div>
    <div class="collapse-content px-10">
      <label v-if="payers?.length">
        <span class="text-lg font-bold opacity-80">Payers</span>
        <div class="mb-6 -space-x-4 avatar-group">
          <UserAvatar v-for="payer in payers" :key="payer.id" :user="payer" />
        </div>
      </label>
      <label v-if="purchase.shoppingItems?.length">
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
