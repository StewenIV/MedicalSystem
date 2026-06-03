import { toast } from 'react-toastify'

/**
 * Показывает ошибки API в виде уведомлений (toast).
 *
 * Сервер может вернуть несколько сообщений об ошибках валидации,
 * разделённых символом переноса строки (\n).
 * Каждое сообщение отображается отдельным toast-уведомлением.
 *
 * @param error - объект Error или строка с сообщением об ошибке
 * @param fallback - текст по умолчанию, если сообщение пустое
 */
export function showApiError(error: unknown, fallback = 'Произошла ошибка'): void {
  const message = error instanceof Error ? error.message : String(error || fallback)

  if (!message) {
    toast.error(fallback)
    return
  }

  // Если серверная ошибка содержит несколько строк — показываем каждую отдельно
  const lines = message.split('\n').map(l => l.trim()).filter(Boolean)

  if (lines.length <= 1) {
    toast.error(message || fallback)
  } else {
    lines.forEach(line => toast.error(line))
  }
}
