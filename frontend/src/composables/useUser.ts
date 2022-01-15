import { IUser } from '@interfaces/user.interface'
import { ref } from 'vue'
import axios from 'axios'

const user = ref<IUser>()

export function useUser() {
  const getUser: () => Promise<void> = async () => {
    try {
      const { data } = await axios('/user')
      user.value = data
    } catch (err) {
      user.value = undefined
      throw err
    }
  }

  const updateUser: (u: Partial<IUser>) => Promise<void> = async (u) => {
    if (!user.value) {
      return
    }
    await axios.patch('/user', u)
    user.value = { ...user.value, ...u }
  }

  const deleteUser: () => Promise<void> = async () => {
    if (!user.value) {
      return
    }
    await axios.delete('/user')
    user.value = undefined
    window.location.reload()
  }

  return { user, getUser, updateUser, deleteUser }
}
