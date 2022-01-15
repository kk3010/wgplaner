import { EventSourcePolyfill } from 'event-source-polyfill'
import { useUser } from './useUser'
import { useAuth } from './useAuth'
import { getCurrentInstance, onBeforeUnmount, ref, watchEffect } from 'vue'
import type { IUser } from '@interfaces/user.interface'

const source = ref<EventSourcePolyfill>()

type SubscriberFn = (msg: { user: IUser } & Record<any, any>) => void

const { user } = useUser()

export const initSse = () => {
  const { getAccessToken, refresh } = useAuth(user)
  const establishConnection = () => {
    source.value = new EventSourcePolyfill('/api/sse', { headers: { Authorization: `Bearer ${getAccessToken()}` } })
    source.value.addEventListener('error', async (e) => {
      if ((e as any).status === 422) {
        source.value!.close()
        await refresh()
        establishConnection()
      }
    })
  }

  if (!source.value) {
    establishConnection()
  }
}

export function useSse(subscriberMap: Record<string, SubscriberFn>, listenToSelf = false) {
  const listener = ({ data }) => {
    const parsed = JSON.parse(data)
    const handler = subscriberMap[parsed.type]

    if (handler && (listenToSelf || user.value?.id !== parsed.data.user.id)) {
      handler(parsed.data)
    }
  }

  watchEffect(() => source.value?.addEventListener('message', listener))

  if (getCurrentInstance()) {
    onBeforeUnmount(() => source.value?.removeEventListener('message', listener))
  }
}
