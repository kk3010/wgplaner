import { ref } from 'vue'
import type { IPurchase } from '@interfaces/purchase.interface'
import axios from 'axios'

export type UpdatePurchase = {
  id: number
  name: string
  price: number
  payers: number[]
}

export type CreatePurchase = Omit<UpdatePurchase, 'id'> & {
  shoppingItems: number[]
}

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

  const createPurchase: (purchase: CreatePurchase) => Promise<void> = async (purchase: CreatePurchase) => {
    const { data } = await axios.post<never>('/purchase', purchase)
    purchases.value = [...purchases.value, data]
  }

  return { purchases, fetchPurchases, fetchPurchaseById, updatePurchase, createPurchase }
}
