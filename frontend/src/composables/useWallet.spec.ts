import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import type { IWallet } from '@interfaces/wallet.interface'
import { useWallets } from './useWallet'

const mock = new MockAdapter(axios)

const genMockWallet: () => IWallet = () => ({
  id: 1,
  balance: 0,
  flatId: 1,
  userId: 1,
})

const { wallets, fetchWallets } = useWallets()

describe('useWallet', () => {
  let oldRef: IWallet[]

  beforeEach(() => {
    wallets.value = []
    mock.reset()
    oldRef = wallets.value
  })

  describe('fetchWallets', () => {
    it('fetches all wallets and sets the ref', async () => {
      const expected = Array.from(Array(5)).map(() => genMockWallet())
      mock.onGet('/wallet').reply(200, expected)
      await fetchWallets()
      expect(expected).toEqual(wallets.value)
      expect(wallets.value).not.toBe(oldRef)
    })

    it('leaves ref untouched and throws on error', async () => {
      mock.onAny().networkError()
      await expect(fetchWallets()).rejects.toThrow()
      expect(wallets.value).toBe(oldRef)
    })
  })
})
