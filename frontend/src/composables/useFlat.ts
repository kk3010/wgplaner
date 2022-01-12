import { ref } from 'vue'
import type { IFlat } from '@interfaces/flat.interface'
import axios from 'axios'
import { useSse } from './useSse'

const flat = ref<IFlat>()

export function useFlat() {
  const createFlat: (name: string) => Promise<void> = async (name) => {
    const { data } = await axios.post('/flat', { name })
    flat.value = data
  }

  const getFlat: () => Promise<void> = async () => {
    try {
      const { data } = await axios.get('/flat')
      flat.value = data
    } catch (error) {
      flat.value = undefined
      throw error
    }
  }

  const updateFlat: (n: string) => Promise<void> = async (n) => {
    if (!flat.value) {
      return
    }
    await axios.patch('/flat', { name: n })
    useSse({
      'flat.update': (msg: any) => {
        console.log(msg)
      },
    })
    flat.value = { ...flat.value, ...{ name: n } }
  }

  const deleteFlat: () => Promise<void> = async () => {
    if (!flat.value) {
      return
    }
    await axios.delete('/flat')
    flat.value = undefined
  }

  const joinFlat: (token: string) => Promise<void> = async (token) => {
    await axios.post(`/flat/join/${token}`)
    await getFlat()
  }

  const removeUser: (userId: number) => Promise<void> = async (userId) => {
    if (!flat.value) {
      return
    }
    await axios.delete(`/flat/${userId}`)
    const members = flat.value.members.filter((user) => user.id !== userId)
    flat.value = { ...flat.value, members }
  }

  return { flat, createFlat, getFlat, updateFlat, deleteFlat, joinFlat, removeUser }
}
