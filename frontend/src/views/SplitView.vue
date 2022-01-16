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
      .map((wallet) => ({ ...wallet, user: members.find(({ id }) => wallet.userId === id) }))
      .filter((wallet) => wallet.user && wallet.userId !== user.value!.id)
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
  notify('Payback successful', 'success')
}

const handleCreatePurchase = async (purchase: CreatePurchaseType) => {
  await createPurchase(purchase)
  notify('Purchase created', 'success')
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-black mb-6">Split</h1>
    <div class="flex flex-col">
      <div v-if="userBalance !== undefined" class="mb-4">
        <h2 class="text-xl font-bold mb-4">My balance</h2>
        <div
          class="text-6xl md:text-8xl text-center font-bold"
          :class="userBalance >= 0 ? 'text-green-400' : 'text-red-400'"
        >
          {{ userBalance.toFixed(2) }} €
        </div>
      </div>
      <div>
        <h2 class="text-xl font-bold mt-8 mb-4">Member balances</h2>
        <div class="stats border-dash !overflow-auto w-full shadow grid grid-flow-row lg:grid-flow-col">
          <MemberWalletStat
            class="lg:!border-t-0 lg:!border-l-2"
            v-for="wallet in memberWallets"
            :key="wallet.id"
            :balance="wallet.balance"
            :user="wallet.user!"
          >
            <label
              for="payback-modal"
              class="btn btn-dark btn-sm modal-button"
              title="pay back"
              @click="paybackUser = wallet.userId"
            >
              Pay back
            </label>
            <input type="checkbox" id="payback-modal" class="modal-toggle" />
            <PaybackModal
              v-if="paybackUser"
              @submit="handlePayback"
              :receiver="flat?.members.find(member => member.id === paybackUser)!"
            />
          </MemberWalletStat>
        </div>
      </div>
      <div>
        <h2 class="text-xl font-bold mt-8 mb-4">Activities</h2>
        <div class="flex flex-col gap-5" v-if="flat">
          <Spending
            v-for="purchase in purchases.sort((a, b) => b.id - a.id)"
            :key="purchase.id"
            :purchase="purchase"
            :members="flat.members"
          />
        </div>
      </div>
    </div>
    <teleport to="body">
      <transition name="scale">
        <AddButton class="z-40">
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
  </div>
</template>

<style scoped>
.stat:first-child {
  border: none !important;
}
</style>
