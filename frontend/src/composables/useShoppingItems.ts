import type { IShoppingItem } from '@interfaces/shopping-item.interface'
import { ref } from 'vue'
import axios from 'axios'

type RequestItem = Pick<IShoppingItem, 'name' | 'quantity'>

const shoppingItems = ref<IShoppingItem[]>([])

export function useShoppingItems() {
  const fetchItems: () => Promise<void> = async () => {
    const { data } = await axios.get<IShoppingItem[]>('/shopping-item')
    shoppingItems.value = data
  }

  const createItem: (item: RequestItem) => Promise<void> = async (item) => {
    const { data } = await axios.post<IShoppingItem>('/shopping-item', item)
    shoppingItems.value = [...shoppingItems.value, data]
  }

  const updateItem: (partial: Partial<RequestItem> & Pick<IShoppingItem, 'id'>) => Promise<void> = async (partial) => {
    await axios.patch<never>(`/shopping-item/${partial.id}`, partial)
    const copy = [...shoppingItems.value]
    const i = copy.findIndex(({ id }) => id === partial.id)
    Object.assign(copy[i], partial)
    shoppingItems.value = copy
  }

  const deleteItem: (id: number) => Promise<void> = async (id) => {
    await axios.delete<never>(`/shopping-item/${id}`)
    shoppingItems.value = shoppingItems.value.filter((item) => item.id !== id)
  }

  return { shoppingItems, fetchItems, createItem, updateItem, deleteItem }
}
