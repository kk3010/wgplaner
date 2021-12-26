import { EventSourcePolyfill } from 'event-source-polyfill'
import { useUser } from './useUser'
import { useAuth } from './useAuth'
import { onBeforeUnmount } from 'vue'

let source: EventSourcePolyfill

type SubscriberFn = (msg: any) => void

export function useSse(subscriberMap: Record<string, SubscriberFn>) {
  if (!source) {
    const { user } = useUser()
    const { getAccessToken } = useAuth(user)
    source = new EventSourcePolyfill('/api/sse', { headers: { Authorization: `Bearer ${getAccessToken()}` } })
  }

  const listeners: any[] = []

  Object.entries(subscriberMap).forEach(([event, handler]) => {
    const listener = ({ data }) => {
      const { type, data: d } = JSON.parse(data)
      if (type === event) {
        handler(d)
      }
    }

    source.addEventListener('message', listener)

    listeners.push(listener)
  })

  onBeforeUnmount(() => listeners.forEach((listener) => source.removeEventListener('message', listener)))
}
