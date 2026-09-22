const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const TOKEN_KEY = 'campus_access_token'
export const REFRESH_TOKEN_KEY = 'campus_refresh_token'
export const USER_KEY = 'campus_user'

export async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
    throw new Error(data?.message || `Request failed with status ${res.status}`)
  }

  return data
}

export function toQueryString(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
  ).toString()
  return query ? `?${query}` : ''
}
