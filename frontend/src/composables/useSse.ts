import { EventSourcePolyfill } from 'event-source-polyfill'
import { useUser } from './useUser'
import { useAuth } from './useAuth'
import { onBeforeUnmount } from 'vue'
import type { IUser } from '@interfaces/user.interface'

let source: EventSourcePolyfill

type SubscriberFn = (msg: { user: IUser } & Record<any, any>) => void

export function useSse(subscriberMap: Record<string, SubscriberFn>) {
  const { user } = useUser()

  if (!source) {
    const { getAccessToken } = useAuth(user)
    source = new EventSourcePolyfill('/api/sse', { headers: { Authorization: `Bearer ${getAccessToken()}` } })
  }

  const listener = ({ data }) => {
    const parsed = JSON.parse(data)
    const handler = subscriberMap[parsed.type]

    if (handler && user.value?.id !== parsed.data.user.id) {
      handler(parsed.data)
    }
  }

  source.addEventListener('message', listener)

  onBeforeUnmount(() => source.removeEventListener('message', listener))
}
