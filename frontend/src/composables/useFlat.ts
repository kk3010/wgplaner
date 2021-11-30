import { ref } from 'vue'
import type { IFlat } from '@interfaces/flat.interface'

const flat = ref<IFlat>()

export function useFlat() {
  const createFlat: (name: string) => Promise<void> = (name: string) => {}

  const getFlat: () => Promise<void> = () => {}

  const updateFlat: (name: string) => Promise<void> = (flat) => {}

  const deleteFlat: () => Promise<void> = () => {}

  const joinFlat: (token: string) => Promise<void> = () => {}

  const removeUser: (userId: number) => Promise<void> = (userId) => {}

  return { flat, createFlat, getFlat, updateFlat, deleteFlat, joinFlat, removeUser }
}
