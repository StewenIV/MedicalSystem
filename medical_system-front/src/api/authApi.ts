const BASE_URL = process.env.REACT_APP_API_URL ?? ''
const TOKEN_KEY = 'token'

export interface LoginResponse {
  token: string
  role: string
  userId: string
  login: string
  displayName?: string
  patientId?: string
}

export interface MeResponse {
  userId: string
  login: string
  role: string
  displayName?: string
  patientId?: string
}

export interface RegisterPatientPayload {
  lastName: string
  firstName: string
  middleName?: string
  email: string
  password: string
  dateOfBirth: string
  phone: string
}

export interface GoogleAuthResponse {
  isNewUser: boolean
  email: string
  firstName: string
  lastName: string
  token?: string
  role?: string
  userId?: string
  displayName?: string
  patientId?: string
}

export interface GoogleRegisterPayload {
  accessToken: string
  gender: string
  dateOfBirth: string
  phone: string
  firstName: string
  lastName: string
  middleName?: string
}

export const authApi = {

  async registerPatient(payload: RegisterPatientPayload): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/auth/register-patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      let message = 'Ошибка регистрации.'
      try {
        const data = await res.json()
        if (data?.message) {
          message = data.message
        } else if (data?.errors) {
          const msgs = Object.values(data.errors).flat() as string[]
          message = msgs.join('\n')
        }
      } catch {}
      throw new Error(message)
    }

    return res.json()
  },

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
      if (!res.ok) {
        localStorage.removeItem(TOKEN_KEY)
        return null
      }
      return res.json()
    } catch {
      return null
    }
  },

  async getGoogleConfig(): Promise<{ clientId: string }> {
    const res = await fetch(`${BASE_URL}/api/auth/google-config`)
    if (!res.ok) {
      throw new Error('Не удалось получить конфигурацию Google OAuth.')
    }
    return res.json()
  },

  async googleLogin(accessToken: string): Promise<GoogleAuthResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken })
    })

    if (!res.ok) {
      let message = 'Ошибка входа через Google.'
      try {
        const data = await res.json()
        if (data?.message) message = data.message
      } catch {}
      throw new Error(message)
    }

    return res.json()
  },

  async googleRegister(payload: GoogleRegisterPayload): Promise<GoogleAuthResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/google-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      let message = 'Ошибка регистрации через Google.'
      try {
        const data = await res.json()
        if (data?.message) message = data.message
      } catch {}
      throw new Error(message)
    }

    return res.json()
  },

  async forgotPassword(email: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    if (!res.ok) {
      let message = 'Не удалось отправить код восстановления.'
      try {
        const data = await res.json()
        if (data?.message) message = data.message
      } catch {}
      throw new Error(message)
    }

    return res.json()
  },

  async verifyResetCode(email: string, code: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/auth/verify-reset-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    })

    if (!res.ok) {
      let message = 'Неверный или истекший код.'
      try {
        const data = await res.json()
        if (data?.message) message = data.message
      } catch {}
      throw new Error(message)
    }

    return res.json()
  },

  async resetPassword(email: string, code: string, password: string, confirmPassword: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, password, confirmPassword })
    })

    if (!res.ok) {
      let message = 'Не удалось изменить пароль.'
      try {
        const data = await res.json()
        if (data?.message) message = data.message
      } catch {}
      throw new Error(message)
    }

    return res.json()
  }
}

export function decodeJwt(token: string): Record<string, any> | null {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const binString = atob(base64)
    const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0))
    const decoded = new TextDecoder().decode(bytes)
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
