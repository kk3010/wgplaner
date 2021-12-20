import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { useAuth } from './useAuth'
import { ref } from 'vue'
import type { AuthResponse } from './useAuth'
import type { IUser } from '@interfaces/user.interface'

const mock = new MockAdapter(axios)

describe('useAuth', () => {
  const user = ref()
  const { login, addAxiosAuth, logout, register } = useAuth(user)

  beforeEach(() => {
    user.value = undefined
    mock.reset()
    jest.resetAllMocks()
    localStorage.clear()
  })

  describe('refresh flow', () => {
    beforeAll(() => {
      addAxiosAuth()
    })

    it('retries a request when getting an Unauthorized 401 Response', async () => {
      mock.onPost('/auth/refresh').reply(200, { token: 'token' }).onAny().replyOnce(401).onAny().replyOnce(200)

      const { status } = await axios.get('')

      expect(status).toBe(200)
      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.get).toHaveLength(2)
      expect(mock.history.get[1].headers?.['Authorization']).toBe('Bearer token')
    })

    it('retries a request when getting an Unprocessable Entity 422 Response', async () => {
      mock.onPost('/auth/refresh').reply(200, { token: 'token' }).onAny().replyOnce(422).onAny().replyOnce(200)

      const { status } = await axios.get('')

      expect(status).toBe(200)
      expect(mock.history.post).toHaveLength(1)
      expect(mock.history.get).toHaveLength(2)
      expect(mock.history.get[1].headers?.['Authorization']).toBe('Bearer token')
    })

    it('fails when error is something other than 401 or 422', async () => {
      mock.onAny().reply(404)

      await expect(axios.get('')).rejects.toThrow()
      expect(mock.history.get).toHaveLength(1)
    })
  })

  describe('login', () => {
    it('sets user and tokens after successful login', async () => {
      const userRes = {} as IUser
      const res: AuthResponse = { user: userRes, token: 'token', refresh_token: 'refresh' }
      mock.onPost('/auth/login').reply(200, res)
      await login('', '')
      expect(user.value).toStrictEqual(userRes)
      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it('does not set anything when request fails', async () => {
      mock.onPost('/auth/login').reply(401)
      await expect(login('', '')).rejects.toThrow()
      expect(user.value).toBeUndefined()
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })
  })

  describe('register', () => {
    it('sets user and tokens after successful registration', async () => {
      const userRes = {} as IUser
      const res: AuthResponse = { user: userRes, token: 'token', refresh_token: 'refresh' }
      mock.onPost('/auth/register').reply(200, res)
      await register({} as IUser)
      expect(user.value).toStrictEqual(userRes)
      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it('does not set anything when request fails', async () => {
      mock.onPost('/auth/register').reply(401)
      await expect(register({} as IUser)).rejects.toThrow()
      expect(user.value).toBeUndefined()
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    const mockUser = {} as IUser
    beforeEach(() => {
      user.value = mockUser
    })

    it('clears user ref on logout', () => {
      logout()
      expect(user.value).toBeUndefined()
      expect(localStorage.removeItem).toHaveBeenCalled()
    })
  })
})
