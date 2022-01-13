import { ref } from 'vue'
import axios from 'axios'
import type { IFlat } from '@interfaces/flat.interface'
import { useSse } from './useSse'
import { useToast } from './useToast'

const flat = ref<IFlat>()

const { notify } = useToast()

useSse({
  'flat.update': (msg) => {
    flat.value = { ...flat.value, ...msg.flat }
  },
  'flat.delete': (msg) => {
    notify(`${msg.user.firstName} deleted "${flat.value?.name}".`)
    window.location.reload()
  },
  'flat.memberJoined': (msg) => {
    notify(`${msg.member.firstName} joined "${flat.value?.name}".`)
    flat.value?.members.push(msg.member)
  },
  'flat.memberRemoved': (msg) => {
    const index = flat.value!.members.findIndex((member) => member.id === msg.id)
    const member = flat.value!.members[index]
    notify(`${member.firstName} left "${flat.value?.name}".`)
    index && flat.value?.members.splice(index, 1)
  },
})

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
