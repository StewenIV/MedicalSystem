import { toast } from 'react-toastify'

const BASE_URL = process.env.REACT_APP_API_URL ?? ''
const TOKEN_KEY = 'token'

export interface UploadResponse {
  fileName: string
  objectName: string
  contentType: string
  url: string
}

const MAX_FILE_SIZE = 15 * 1024 * 1024 

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Размер файла превышает лимит (15 МБ)')
  }

  const token = localStorage.getItem(TOKEN_KEY)
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${BASE_URL}/api/files/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: formData
  })

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY)
    window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    throw new Error('Сессия истекла. Войдите снова.')
  }

  if (!res.ok) {
    let errorMsg = 'Ошибка при загрузке файла'
    try {
      const errText = await res.text()
      if (errText) {
        try {
          const errData = JSON.parse(errText)
          if (errData.message) {
            errorMsg = errData.message
          }
        } catch {
          errorMsg = errText
        }
      }
    } catch {}
    throw new Error(errorMsg)
  }

  return res.json()
}

export const downloadFileFromServer = async (fileName: string, filePath: string) => {
  const infoToast = toast.info(`Начало скачивания "${fileName}"...`)
  try {
    const url = `${BASE_URL}/api/files/download/${encodeURIComponent(filePath)}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Не удалось получить файл с сервера')

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.dismiss(infoToast)
    toast.success(`Файл "${fileName}" успешно скачан`)

    window.open(blobUrl, '_blank')
  } catch (err: any) {
    toast.dismiss(infoToast)
    toast.error(err.message || 'Ошибка при скачивании файла')
  }
}
