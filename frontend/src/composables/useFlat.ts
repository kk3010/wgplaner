import { ref } from 'vue'
import type { IFlat } from '@interfaces/flat.interface'
import axios from 'axios'

const flat = ref<IFlat>()

export function useFlat() {
  const createFlat: (name: string) => Promise<void> = async (name: string) => {
    await axios.post('/flat', { name })
  }

  const getFlat: () => Promise<void> = async () => {
    const { data } = await axios.get('/flat')
    flat.value = data
  }

  const updateFlat: (name: string) => Promise<void> = (flat) => {}

  const deleteFlat: () => Promise<void> = () => {}

  const joinFlat: (token: string) => Promise<void> = () => {}

  const removeUser: (userId: number) => Promise<void> = (userId) => {}

  return { flat, createFlat, getFlat, updateFlat, deleteFlat, joinFlat, removeUser }
}
