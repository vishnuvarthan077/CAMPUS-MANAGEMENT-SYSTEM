import { request, TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../api/client'

function persistSession({ accessToken, refreshToken, user }) {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const authService = {
  async login(credentials) {
    if (!credentials.email || !credentials.password) {
      throw new Error('Please enter both email and password.')
    }

    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    })

    persistSession(res)
    return { token: res.accessToken, user: res.user }
  },

  async register(userData) {
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('Please fill in your name, email, and password.')
    }

    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        role: userData.role || 'student',
        registerNumber: userData.registerNumber || undefined,
        department: userData.department || undefined,
      }),
    })

    persistSession(res)
    return { success: true, user: res.user }
  },

  async logout() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    try {
      await request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      })
    } catch {
      // logging out locally still succeeds even if the network call fails
    } finally {
      clearSession()
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY)
  },

  getCurrentUser() {
    const userJson = localStorage.getItem(USER_KEY)
    if (!userJson) return null
    try {
      return JSON.parse(userJson)
    } catch {
      return null
    }
  },
}
