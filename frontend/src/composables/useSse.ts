import { EventSourcePolyfill } from 'event-source-polyfill'
import { useUser } from './useUser'
import { useAuth } from './useAuth'
import { onBeforeUnmount } from 'vue'
import type { IUser } from '@interfaces/user.interface'

let source: EventSourcePolyfill

type SubscriberFn<T> = (msg: { user: IUser } & T) => void

export function useSse<T>(subscriberMap: Record<string, SubscriberFn<T>>) {
  if (!source) {
    const { user } = useUser()
    const { getAccessToken } = useAuth(user)
    source = new EventSourcePolyfill('/api/sse', { headers: { Authorization: `Bearer ${getAccessToken()}` } })
  }

  const { user } = useUser()

  const listeners: any[] = []

  Object.entries(subscriberMap).forEach(([event, handler]) => {
    const listener = ({ data }) => {
      const parsed = JSON.parse(data)

      if (parsed.type === event && user.value?.id !== parsed.data.user.id) {
        handler(parsed.data)
      }
    }

    source.addEventListener('message', listener)

    listeners.push(listener)
  })

  onBeforeUnmount(() => listeners.forEach((listener) => source.removeEventListener('message', listener)))
}
