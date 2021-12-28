<script lang="ts" setup>
import { useWallets } from '@/composables/useWallet'
import { onMounted, computed, ref } from 'vue'
import { usePurchases } from '../composables/usePurchases'
import MemberWalletStat from '@/components/split/MemberWalletStat.vue'
import { useFlat } from '../composables/useFlat'
import { useUser } from '../composables/useUser'
import PaybackModal from '@/components/split/PaybackModal.vue'
import { TransitionPresets, useTransition } from '@vueuse/core'

const { user } = useUser()
const { flat } = useFlat()
const { wallets, fetchWallets } = useWallets()
const { transferMoney } = usePurchases()

onMounted(async () => await fetchWallets())

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
</script>

<template>
  <div class="flex flex-col">
    <div v-if="userBalance" class="mb-4">
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
  </div>
</template>
