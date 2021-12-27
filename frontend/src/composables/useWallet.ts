import { ref } from 'vue'
import type { IWallet } from '@interfaces/wallet.interface'
import axios from 'axios'

const wallets = ref<IWallet[]>()

export function useWallets() {
  const fetchWallets: () => Promise<void> = async () => {
    const { data } = await axios.get<IWallet[]>('/wallet')
    wallets.value = data
  }

  return { wallets, fetchWallets }
}
