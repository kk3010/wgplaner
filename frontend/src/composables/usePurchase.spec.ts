import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import type { IPurchase } from '@interfaces/purchase.interface'
import { type UpdatePurchase, type CreatePurchase, type Transfer, usePurchases } from './usePurchases';

const mock = new MockAdapter(axios)

const genPurchase: () => IPurchase = () => ({
  id: 1,
  name: 'purchase',
  buyerId: 1,
  payerIds: [],
  price: 0,
  shoppingItems: [],
  flatId: 1,
})

const { purchases, createPurchase, fetchPurchases, updatePurchase, transferMoney } = usePurchases()

describe('usePurchases', () => {
  let oldRef: IPurchase[]

  beforeEach(() => {
    purchases.value = []
    mock.reset()
    oldRef = purchases.value
  })

  describe('getPurchases', () => {
    it('GET /purchase sets the ref', async () => {
      const items = Array.from(Array(5)).map(() => genPurchase())
      mock.onGet('/purchase').reply(200, items)
      await fetchPurchases()
      expect(purchases.value).toEqual(items)
    })

    it('throws on error and leaves list untouched', async () => {
      purchases.value.push(genPurchase())
      mock.onAny().networkError()
      await expect(fetchPurchases()).rejects.toThrow()
      expect(purchases.value).toHaveLength(1)
    })
  })

  describe('updatePurchase', () => {
    let item: IPurchase
    const update: UpdatePurchase = { id: 1, name: 'new name', payers: [], price: 0 }

    beforeEach(() => {
      item = genPurchase()
      purchases.value.push(item)
    })

    it('PATCH /purchase/:id and update list', async () => {
      mock.onPatch('/purchase/' + update.id).reply(204)
      await updatePurchase(update)
      const expected = { ...item, ...update }
      expect(purchases.value).toEqual([expected])
      // make sure the list is assigned anew
      expect(purchases.value).not.toBe(oldRef)
    })

    it('throws on error and leaves item untouched', async () => {
      mock.onAny().networkError()
      await expect(updatePurchase(update)).rejects.toThrow()
      expect(purchases.value).toHaveLength(1)
      expect(purchases.value[0]).toEqual(item)
    })
  })

  describe('createPurchase', () => {
    const item: CreatePurchase = { name: 'test', payers: [], price: 1, shoppingItems: [] }
    it('POST /purchase and reassign list', async () => {
      mock.onPost('/purchase').reply(({ data }) => [201, { ...genPurchase(), ...JSON.parse(data) }])
      await createPurchase(item)
      expect(purchases.value).toHaveLength(1)
      expect(purchases.value).not.toBe(oldRef)
    })

    it('should throw and leave list untouched', async () => {
      mock.onAny().networkError()
      await expect(createPurchase(item)).rejects.toThrow()
      expect(purchases.value).toHaveLength(0)
    })
  })

  describe('transferMoney', () => {
    
    it('create purchase with negative amount and no shopping items', async () => {
      const expected: Transfer = {
        price: 100,
        payers: [1],
      }
      mock.onPost('/purchase').reply(({ data }) => [201, { ...genPurchase(), ...JSON.parse(data) }])
      await transferMoney(expected.payers[0], expected.price)
      expect(purchases.value).toHaveLength(1)
      expect(purchases.value[0].price).toBe(-expected.price)
      expect(purchases.value).not.toBe(oldRef)

    })
  })
})
