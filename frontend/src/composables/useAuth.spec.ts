import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { useAuth } from './useAuth'

const mock = new MockAdapter(axios)

describe('useAuth', () => {
  describe('refresh flow', () => {
    beforeAll(() => {
      const { addAxiosAuth } = useAuth()
      addAxiosAuth()
    })

    afterEach(() => {
      mock.reset()
    })

    it('retries a request when getting an Unauthorized 401 Response', async () => {
      mock.onPost('/auth/refresh').reply(200, { token: 'token' }).onAny().replyOnce(401).onAny().replyOnce(200)

      const { status } = await axios.get('')

      expect(status).toBe(200)
      expect(mock.history.post.length).toBe(1)
      expect(mock.history.get.length).toBe(2)
      expect(mock.history.get[1].headers?.['Authorization']).toBe('Bearer token')
    })

    it('retries a request when getting an Unprocessable Entity 422 Response', async () => {
      mock.onPost('/auth/refresh').reply(200, { token: 'token' }).onAny().replyOnce(422).onAny().replyOnce(200)

      const { status } = await axios.get('')

      expect(status).toBe(200)
      expect(mock.history.post.length).toBe(1)
      expect(mock.history.get.length).toBe(2)
      expect(mock.history.get[1].headers?.['Authorization']).toBe('Bearer token')
    })

    it('fails when error is something other than 401 or 422', async () => {
      mock.onAny().reply(404)

      await expect(axios.get('')).rejects.toThrow()
      expect(mock.history.get.length).toBe(1)
    })
  })
})
