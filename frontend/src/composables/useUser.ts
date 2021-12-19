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

  /*   const updateUser: (u: Partial<IUser>) => Promise<void> = async (u) => {
    try {
      const {...data} = u
      user.value = data
      await axios.patch('/user', user)
      
    } catch (err) {
      user
    }
  } */

  const updateUser: (u: Partial<IUser>) => Promise<void> = async (u) => {
    try {
      const { id } = u
      const { data } = await axios.patch(`/user/${id}`, u)
      user.value = data
    } catch (err) {
      user.value = undefined
    }
  }

  const deleteUser: () => Promise<void> = async () => {
    try {
      await axios.delete('/user')
      user.value = undefined
    } catch (err) {
      user.value
    }
  }

  return { user, getUser, updateUser, deleteUser }
}
