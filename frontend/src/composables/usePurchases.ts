import { ref } from 'vue'
import type { IPurchase } from '@interfaces/purchase.interface'
import axios from 'axios'

export type UpdatePurchase = {
  id: number
  name?: string
  price: number
  payers: number[]
}

export type CreatePurchase = Transfer & {
  shoppingItems?: number[]
}

export type Transfer = Omit<UpdatePurchase, 'id'>

export function usePurchases() {
  const purchases = ref<IPurchase[]>([])

  const fetchPurchases: () => Promise<void> = async () => {
    const { data } = await axios.get<IPurchase[]>('/purchase')
    purchases.value = data
  }

  const fetchPurchaseById: (id: number) => Promise<IPurchase> = async (id) => {
    const { data } = await axios.get<IPurchase>('/purchase/' + id)
    return data
  }

  const updatePurchase: (partial: UpdatePurchase) => Promise<void> = async (partial) => {
    const { id, ...rest } = partial
    await axios.patch<never>('/purchase/' + id, rest)
    const copy = [...purchases.value]
    const i = copy.findIndex((p) => p.id === id)
    Object.assign(copy[i], rest)
    purchases.value = copy
  }

  const createPurchase: (purchase: Transfer) => Promise<void> = async (purchase) => {
    const { data } = await axios.post<IPurchase>('/purchase', purchase)
    purchases.value = [...purchases.value, data]
  }

  const transferMoney: (to: number, amount: number) => Promise<void> = (to, amount) =>
    createPurchase({
      payers: [to],
      price: -amount,
    })

  return { purchases, fetchPurchases, fetchPurchaseById, updatePurchase, createPurchase, transferMoney }
}
