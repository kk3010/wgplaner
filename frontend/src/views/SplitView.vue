<script lang="ts" setup>
import { useWallets } from '@/composables/useWallet'
import { onMounted, computed, ref } from 'vue'
import MemberWalletStat from '@/components/split/MemberWalletStat.vue'
import Spending from '@/components/split/Spending.vue'
import { useFlat } from '../composables/useFlat'
import { useUser } from '../composables/useUser'
import PaybackModal from '@/components/split/PaybackModal.vue'
import { TransitionPresets, useTransition } from '@vueuse/core'
import AddButton from '@/components/AddButton.vue'
import { CashIcon } from '@heroicons/vue/outline'
import CreatePurchase from '@/components/purchases/CreatePurchase.vue'
import { type CreatePurchase as CreatePurchaseType, usePurchases } from '../composables/usePurchases'
import { useToast } from '../composables/useToast';

const { user } = useUser()
const { flat } = useFlat()
const { wallets, fetchWallets } = useWallets()
const { purchases, createPurchase, fetchPurchases, transferMoney } = usePurchases()
const { notify } = useToast()

onMounted(async () => await fetchWallets())
onMounted(async () => await fetchPurchases())

const memberWallets = computed(() => {
  const members = flat.value?.members
  if (members && wallets.value) {
    return wallets.value
      .filter(({ userId }) => userId !== user.value!.id)
      .map((wallet) => ({ ...wallet, user: members.find(({ id }) => wallet.userId === id) }))
      .sort((a, b) => a.id - b.id)
  }
  return null
})

const userBalanceSource = computed(() => wallets.value?.find(({ userId }) => userId === user.value?.id)?.balance ?? 0)

const userBalance = useTransition(userBalanceSource, {
  duration: 500,
  transition: TransitionPresets.easeInOutCubic,
})

const paybackUser = ref<number>()

const handlePayback = async (amount: number) => {
  await transferMoney(paybackUser.value!, amount)
  await fetchWallets()
}

const handleCreatePurchase = async (purchase: CreatePurchaseType) => {
  await createPurchase(purchase)
  await fetchPurchases()
  notify('Purchase created', 'success')
}
</script>

<template>
  <div class="flex flex-col">
    <div v-if="userBalance !== undefined" class="mb-4">
      <h2 class="text-xl font-bold mb-4">My Balance</h2>
      <div class="text-6xl md:text-8xl text-center" :class="userBalance >= 0 ? 'text-green-600' : 'text-red-700'">
        {{ userBalance.toFixed(2) }}
      </div>
    </div>
    <div>
      <h2 class="text-xl font-bold my-4">Other's Balance</h2>
      <div class="stats w-full shadow grid-flow-row md:grid-flow-col">
        <MemberWalletStat
          v-for="wallet in memberWallets"
          :key="wallet.id"
          :balance="wallet.balance"
          :user="wallet.user!"
        >
          <label
            for="payback-modal"
            class="btn btn-primary btn-sm modal-button"
            title="pay back"
            @click="paybackUser = wallet.userId"
          >
            pay back
          </label>
          <input type="checkbox" id="payback-modal" class="modal-toggle" />
          <PaybackModal @submit="handlePayback" />
        </MemberWalletStat>
      </div>
    </div>
    <div>
      <h2 class="text-xl font-bold my-4">All Purchases</h2>
      <div class="stats w-full grid-flow-row md:grid-flow-col gap-5 flex flex-wrap">
        <Spending v-for="purchase in purchases" :key="purchase.id" :purchase="purchase"> </Spending>
      </div>
    </div>
  </div>
  <teleport to="body">
    <transition name="scale">
      <AddButton class="z-10">
        <label
          for="create-purchase-modal"
          class="btn btn-circle btn-secondary modal-button mb-2"
          title="create purchase"
        >
          <CashIcon class="h-6 w-6" />
        </label>
        <input type="checkbox" id="create-purchase-modal" class="modal-toggle" />
        <CreatePurchase v-if="flat" @create="handleCreatePurchase" :members="flat.members" />
      </AddButton>
    </transition>
  </teleport>
</template>
