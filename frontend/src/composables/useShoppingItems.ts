import type { IShoppingItem } from '@interfaces/shopping-item.interface'
import { ref } from 'vue'
import axios from 'axios'
import { useSse } from './useSse'
import { useToast } from './useToast'

export type UpdateShoppingItem = Pick<IShoppingItem, 'id' | 'name' | 'quantity'>
export type NewShoppingItem = Omit<UpdateShoppingItem, 'id'>

export function useShoppingItems() {
  const shoppingItems = ref<IShoppingItem[]>([])

  const { notify } = useToast()

  useSse({
    'shopping-item.update': (msg) => {
      const index = shoppingItems.value.findIndex(({ id }) => id === msg.item.id)
      shoppingItems.value.splice(index, 1, { ...shoppingItems.value[index], ...msg.item })
    },
    'shopping-item.create': (msg) => {
      console.log(msg)
      shoppingItems.value.push(msg.item)
      notify(`${msg.user.firstName} added a shopping item`)
    },
    'shopping-item.delete': (msg) => {
      const index = shoppingItems.value.findIndex((el) => el.id === msg.item.id)
      shoppingItems.value.splice(index, 1)
      notify(`${msg.user.firstName} deleted a shopping item`)
    },
  })

  const fetchItems: () => Promise<void> = async () => {
    const { data } = await axios.get<IShoppingItem[]>('/shopping-item')
    shoppingItems.value = data
  }

  const createItem: (item: NewShoppingItem) => Promise<void> = async (item) => {
    const { data } = await axios.post<IShoppingItem>('/shopping-item', item)
    shoppingItems.value = [...shoppingItems.value, data]
  }

  const updateItem: (partial: UpdateShoppingItem) => Promise<void> = async (partial) => {
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
