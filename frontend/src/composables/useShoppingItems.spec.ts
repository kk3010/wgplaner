import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import type { IShoppingItem } from '@interfaces/shopping-item.interface'
import { useShoppingItems } from './useShoppingItems'

const mock = new MockAdapter(axios)

const genItem: () => IShoppingItem = () => ({
  id: 1,
  purchaseId: null,
  flatId: 1,
  name: 'item',
  quantity: 1,
})

const { shoppingItems, createItem, deleteItem, fetchItems, updateItem } = useShoppingItems()

describe('useShoppingItems', () => {
  let oldRef: IShoppingItem[]

  beforeEach(() => {
    shoppingItems.value = []
    mock.reset()
    oldRef = shoppingItems.value
  })

  describe('getItems', () => {
    it('GET /shopping-item sets the items ref', async () => {
      const items = Array.from(Array(5)).map(() => genItem())
      mock.onGet('/shopping-item').reply(200, items)
      await fetchItems()
      expect(shoppingItems.value).toEqual(items)
    })

    it('throws on error and leaves list untouched', async () => {
      shoppingItems.value.push(genItem())
      mock.onAny().networkError()
      await expect(fetchItems()).rejects.toThrow()
      expect(shoppingItems.value).toHaveLength(1)
    })
  })

  describe('updateItem', () => {
    let item: IShoppingItem

    beforeEach(() => {
      item = genItem()
      shoppingItems.value.push(item)
    })

    it('PATCH /shopping-item/:id and update list', async () => {
      mock.onPatch('/shopping-item/' + item.id).reply(204)
      const update = { id: item.id, name: 'new name', quantity: 5 }
      await updateItem(update)
      const expected = { ...item, ...update }
      expect(shoppingItems.value).toEqual([expected])
      // make sure the list is assigned anew
      expect(shoppingItems.value).not.toBe(oldRef)
    })

    it('throws on error and leaves item untouched', async () => {
      mock.onAny().networkError()
      await expect(updateItem({ id: item.id, name: 'abc', quantity: 1 })).rejects.toThrow()
      expect(shoppingItems.value).toHaveLength(1)
      expect(shoppingItems.value[0]).toEqual(item)
    })
  })

  describe('createItem', () => {
    it('POST /shopping-item and reassign list', async () => {
      mock.onPost('/shopping-item').reply(({ data }) => [201, { ...genItem(), ...JSON.parse(data) }])
      const item = { name: 'test', quantity: 2 }
      await createItem(item)
      expect(shoppingItems.value).toHaveLength(1)
      expect(shoppingItems.value).not.toBe(oldRef)
    })

    it('should throw and leave list untouched', async () => {
      mock.onAny().networkError()
      await expect(createItem({ name: 'abc', quantity: 2 })).rejects.toThrow()
      expect(shoppingItems.value).toHaveLength(0)
    })
  })

  describe('deleteItem', () => {
    let item: IShoppingItem

    beforeEach(() => {
      item = genItem()
      item.id = 420
      item.name = 'delete me'
      shoppingItems.value.push(...[item, genItem()])
    })

    it('DELETE /shopping-item and remove from list', async () => {
      mock.onDelete('/shopping-item/' + item.id).reply(200)
      await deleteItem(item.id)
      expect(shoppingItems.value).toHaveLength(1)
      expect(shoppingItems.value[0]).not.toEqual(item)
      expect(oldRef).not.toBe(shoppingItems.value)
    })

    it('throws on error and leaves list untouched', async () => {
      mock.onAny().networkError()
      await expect(deleteItem(item.id)).rejects.toThrow()
      expect(shoppingItems.value).toHaveLength(2)
      expect(oldRef).toBe(shoppingItems.value)
    })
  })
})
