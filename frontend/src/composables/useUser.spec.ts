import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { useUser } from './useUser'
import type { IUser } from '@interfaces/user.interface'

const mock = new MockAdapter(axios)

describe('useUser', () => {
  const { user, deleteUser, getUser, updateUser } = useUser()
  const expected = { id: 1 } as IUser

  describe('getUser', () => {
    beforeEach(() => {
      user.value = undefined
      mock.reset()
    })

    it('GET /user', async () => {
      mock.onGet('/user').reply(200, expected)
      await getUser()
      expect(mock.history.get).toHaveLength(1)
      expect(user.value).toBe(expected)
    })

    it('throws and does not set the user when request fails', async () => {
      mock.onGet('/user').networkError()
      await expect(getUser()).rejects.toThrow()
      expect(user.value).toBeUndefined()
    })
  })

  describe('updateUser', () => {
    beforeEach(() => {
      user.value = { id: 2 } as IUser
    })

    it('PATCH /user', async () => {
      mock.onPatch('/user').reply(200)
      await updateUser(expected)
      expect(mock.history.patch).toHaveLength(1)
      expect(user.value).toEqual(expected)
    })

    it('does net update user on failet request', async () => {
      mock.onPatch('/user').networkError()
      await expect(updateUser(expected)).rejects.toThrow()
      expect(mock.history.patch).toHaveLength(1)
      expect(user.value).toBeUndefined()
    })
  })

  describe('deleteUser', () => {
    beforeEach(() => {
      user.value = expected
    })

    it('DELETE /user', async () => {
      mock.onDelete('/user').reply(200)
      await deleteUser()
      expect(mock.history.delete).toHaveLength(1)
      expect(user.value).toBeUndefined()
    })

    it('does not unset user on failed request', async () => {
      mock.onDelete('/user').networkError()
      await expect(deleteUser()).rejects.toThrow()
      expect(mock.history.delete).toHaveLength(1)
      expect(user.value).toBe(expected)
    })
  })
})
