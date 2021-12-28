<script lang="ts" setup>
import { useWallets } from '@/composables/useWallet'
import { onMounted, computed } from 'vue'
import { usePurchases } from '../composables/usePurchases'
import MemberWalletStat from '@/components/split/MemberWalletStat.vue'
import { useFlat } from '../composables/useFlat'
import { useUser } from '../composables/useUser'
import PaybackModal from '@/components/split/PaybackModal.vue'

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
  }
  return null
})

const userWallet = computed(() => wallets.value?.find(({ userId }) => userId === user.value?.id))

const handlePayback = async (user: number, amount: number) => {
  await transferMoney(user, amount)
}
</script>

<template>
  <div class="flex flex-col">
    <div v-if="userWallet">
      <h2 class="text-xl font-bold my-4">My Balance</h2>
      <div class="text-8xl text-center" :class="userWallet.balance >= 0 ? 'text-green-600' : 'text-red-700'">
        {{ userWallet.balance.toFixed(2) }}
      </div>
    </div>
    <div>
      <h2 class="text-xl font-bold my-4">Other's Balance</h2>
      <div class="stats w-full shadow grid-flow-row md:grid-flow-col">
        <MemberWalletStat v-for="wallet in memberWallets" :key="wallet.id" :wallet="wallet" :user="wallet.user!">
          <label for="payback-modal" class="btn btn-primary btn-sm modal-button" title="pay back"> pay back </label>
          <input type="checkbox" id="payback-modal" class="modal-toggle" />
          <PaybackModal @submit="handlePayback(wallet.userId, $event)" />
        </MemberWalletStat>
      </div>
    </div>
  </div>
</template>
