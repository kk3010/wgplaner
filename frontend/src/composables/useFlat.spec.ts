import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { useFlat } from './useFlat'
import type { IFlat } from '@interfaces/flat.interface'
import type { IUser } from '@interfaces/user.interface'

const mock = new MockAdapter(axios)

const genFlat: () => IFlat = () => ({
  id: 1,
  invitationToken: 'token',
  members: [],
  name: 'flat',
})

describe('useFlat', () => {
  let original: IFlat
  const { flat, createFlat, deleteFlat, getFlat, joinFlat, removeUser, updateFlat } = useFlat()

  beforeEach(() => {
    original = genFlat()
    mock.reset()
  })

  describe('no flat is set', () => {
    beforeEach(() => {
      flat.value = undefined
    })

    describe('joinFlat', () => {
      it('POST /flat/join/{token} then GET to set flat', async () => {
        mock.onPost(/\/flat\/join\/.+/).reply(201)
        mock.onGet('/flat').reply(200, original)
        await joinFlat('token')
        expect(mock.history.get.length).toBe(1)
        expect(mock.history.post.length).toBe(1)
        expect(flat.value).toEqual(original)
      })

      it('does not set flat when request fails', async () => {
        mock.onPost(/\/flat\/join\/.+/).networkError()
        await expect(joinFlat('token')).rejects.toThrow()
        expect(mock.history.post.length).toBe(1)
        expect(flat.value).toBeUndefined()
      })
    })

    describe('createFlat', () => {
      it('POST /flat and set ref', async () => {
        mock.onPost('/flat').reply(201, original)
        await createFlat('flat')
        expect(mock.history.post.length).toBe(1)
        expect(flat.value).toBe(original)
      })

      it('does not set flat when request fails', async () => {
        mock.onPost('/flat').networkError()
        await expect(createFlat('flat')).rejects.toThrow()
        expect(mock.history.post.length).toBe(1)
        expect(flat.value).toBeUndefined()
      })
    })

    describe('getFlat', () => {
      it('GET /flat and update ref', async () => {
        mock.onGet('/flat').reply(200, original)
        await getFlat()
        expect(mock.history.get.length).toBe(1)
        expect(flat.value).toBe(original)
      })

      it('does not set flat when request fails', async () => {
        mock.onGet('/flat').networkError()
        await expect(getFlat()).rejects.toThrow()
        expect(mock.history.get.length).toBe(1)
        expect(flat.value).toBeUndefined()
      })
    })
  })

  describe('flat is set and then changed or deleted', () => {
    beforeEach(() => {
      flat.value = original
    })

    describe('updateFlat', () => {
      it('PATCH /flat and update ref', async () => {
        mock.onPatch('/flat').reply((req) => [200, { ...original, name: req.data.name }])
        await updateFlat('new name')
        expect(mock.history.patch.length).toBe(1)
        expect(flat.value).toEqual({ ...original, name: 'new name' })
      })

      it('does not update flat when request fails', async () => {
        mock.onPatch('/flat').networkError()
        await expect(updateFlat('new name')).rejects.toThrow()
        expect(mock.history.patch.length).toBe(1)
        expect(flat.value).toBe(original)
      })
    })

    describe('deleteFlat', () => {
      it('DELETE /flat and unset ref', async () => {
        mock.onDelete('/flat').reply(200)
        await deleteFlat()
        expect(mock.history.delete.length).toBe(1)
        expect(flat.value).toBeUndefined()
      })
      it('does not unset flat when request fails', async () => {
        mock.onDelete('/flat').networkError()
        await expect(deleteFlat()).rejects.toThrow()
        expect(mock.history.delete.length).toBe(1)
        expect(flat.value).toBe(original)
      })
    })

    describe('removeUser', () => {
      const user = { id: 123 } as IUser

      beforeEach(() => {
        original.members.push(user)
      })

      it('DELETE /flat/{userId}', async () => {
        mock.onDelete(/\/flat\/\d+/).reply(200)
        await removeUser(user.id)
        expect(mock.history.delete.length).toBe(1)
        expect(flat.value?.members).toHaveLength(0)
      })

      it('does not remove user when request fails', async () => {
        mock.onDelete(/\/flat\/\d+/).networkError()
        await expect(removeUser(123)).rejects.toThrow()
        expect(mock.history.delete.length).toBe(1)
        expect(flat.value?.members).toHaveLength(1)
      })
    })
  })
})
