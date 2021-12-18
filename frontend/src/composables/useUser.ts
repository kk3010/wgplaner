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
    }
  }

  const updateUser: (user: Partial<IUser>) => Promise<void> = (user) => {}

  const deleteUser: () => Promise<void> = () => {}

  return { user, getUser, updateUser, deleteUser }
}
