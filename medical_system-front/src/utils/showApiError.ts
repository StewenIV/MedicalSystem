import { toast } from 'react-toastify'

export function showApiError(error: unknown, fallback = 'Произошла ошибка'): void {
  const message = error instanceof Error ? error.message : String(error || fallback)

  if (!message) {
    toast.error(fallback)
    return
  }

  const lines = message.split('\n').map(l => l.trim()).filter(Boolean)

  if (lines.length <= 1) {
    toast.error(message || fallback)
  } else {
    lines.forEach(line => toast.error(line))
  }
}
