const BASE_URL = process.env.REACT_APP_API_URL ?? ''
const TOKEN_KEY = 'token'

export interface LoginResponse {
  token: string
  role: string
  userId: string
  login: string
  displayName?: string
}

export interface MeResponse {
  userId: string
  login: string
  role: string
  displayName?: string
}

export const authApi = {

  async login(login: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    })

    if (!res.ok) {
      let message = 'Неверный логин или пароль.'
      try {
        const data = await res.json()
        if (data?.message) message = data.message
      } catch {}
      throw new Error(message)
    }

    return res.json()
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem(TOKEN_KEY)
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
    } catch {
    } finally {
      localStorage.removeItem(TOKEN_KEY)
    }
  },

  async me(): Promise<MeResponse | null> {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return null

    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) return null
      return res.json()
    } catch {
      return null
    }
  }
}

export function decodeJwt(token: string): Record<string, any> | null {
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function isTokenValid(): boolean {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return false

  const claims = decodeJwt(token)
  if (!claims || !claims.exp) return false

  return Date.now() < claims.exp * 1000
}
