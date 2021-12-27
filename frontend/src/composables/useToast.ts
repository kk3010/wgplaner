import { ref } from 'vue'

type Toast = {
  id: symbol
  type: 'success' | 'info' | 'error'
  message: string
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const removeToast = (toast: Toast) => {
    toasts.value = toasts.value.filter((t) => t.id !== toast.id)
  }

  const notify = (message: string, type: Toast['type'] = 'info') => {
    const id = Symbol()
    const toasted = { message, type, id }
    toasts.value.push(toasted)
    setTimeout(() => removeToast(toasted), 2500)
  }

  return { toasts, notify }
}
