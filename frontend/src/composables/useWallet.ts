import { ref } from 'vue'
import type { IWallet } from '@interfaces/wallet.interface'
import axios from 'axios'
import { useSse } from './useSse'

const wallets = ref<IWallet[]>()

useSse(
  {
    'wallet.update': (msg) => {
      const wallet: IWallet = msg.wallet
      const index = wallets.value!.findIndex(({ id }) => id === wallet.id)
      if (index > -1) {
        wallets.value!.splice(index, 1, wallet)
      }
    },
  },
  true,
)

export function useWallets() {
  const fetchWallets: () => Promise<void> = async () => {
    const { data } = await axios.get<IWallet[]>('/wallet')
    wallets.value = data
  }

  return { wallets, fetchWallets }
}
