import { ref } from 'vue'
import type { IFlat } from '@interfaces/flat.interface'
import axios from 'axios'

const flat = ref<IFlat>()

export function useFlat() {
  const createFlat: (name: string) => Promise<void> = async (name: string) => {
    try {
      const { data } = await axios.post('/flat', { name })
      flat.value = data
    } catch (error) {}
  }

  const getFlat: () => Promise<void> = async () => {
    try {
      const { data } = await axios.get('/flat')
      flat.value = data
    } catch (error) {
      flat.value = undefined
    }
  }

  const updateFlat: (n: string) => Promise<void> = async (n) => {
    if (!flat.value) {
      return
    }
    try {
      await axios.patch('/flat', { name: n })
      flat.value = { ...flat.value, ...{ name: n } }
    } catch (err) {
      flat.value
    }
  }

  const deleteFlat: () => Promise<void> = async () => {
    if (!flat.value) {
      return
    }
    try {
      await axios.delete('/flat')
      flat.value = undefined
    } catch (err) {
      flat.value
    }
  }

  const joinFlat: (token: string) => Promise<void> = async (token) => {
    try {
      await axios.post(`/flat/join/${token}`)
      await getFlat()
    } catch (err) {
      flat.value = undefined
    }
  }

  const removeUser: (userId: number) => Promise<void> = async (userId) => {
    if (!flat.value) {
      return
    }
    try {
      await axios.delete(`/flat/${userId}`)
      const members = flat.value.members.filter((user) => user.id !== userId)
      flat.value = { ...flat.value, members }
    } catch (err) {}
  }

  return { flat, createFlat, getFlat, updateFlat, deleteFlat, joinFlat, removeUser }
}
