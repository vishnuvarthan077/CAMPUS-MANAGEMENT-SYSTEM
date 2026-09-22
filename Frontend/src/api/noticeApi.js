import { request, toQueryString } from './client'

export const getNotices = (params = {}) => request(`/notices${toQueryString(params)}`)

export const getNotice = (id) => request(`/notices/${id}`)

export const createNotice = (payload) =>
  request('/notices', { method: 'POST', body: JSON.stringify(payload) })

export const updateNotice = (id, payload) =>
  request(`/notices/${id}`, { method: 'PUT', body: JSON.stringify(payload) })

export const togglePinNotice = (id) => request(`/notices/${id}/pin`, { method: 'PATCH' })

export const deleteNotice = (id) => request(`/notices/${id}`, { method: 'DELETE' })
