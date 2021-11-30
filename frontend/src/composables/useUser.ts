import { IUser } from '@interfaces/user.interface'
import { ref } from 'vue'

const user = ref<IUser>()

export function useUser() {
  const getUser: () => Promise<void> = () => {}

  const updateUser: (user: Partial<IUser>) => Promise<void> = (user) => {}

  const deleteUser: () => Promise<void> = () => {}

  return { user, getUser, updateUser, deleteUser }
}
