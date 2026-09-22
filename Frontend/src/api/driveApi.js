import { request, toQueryString } from './client'

export const getDrives = (params = {}) => request(`/drives${toQueryString(params)}`)

export const getDrive = (id) => request(`/drives/${id}`)

export const createDrive = (payload) =>
  request('/drives', { method: 'POST', body: JSON.stringify(payload) })

export const updateDrive = (id, payload) =>
  request(`/drives/${id}`, { method: 'PUT', body: JSON.stringify(payload) })

export const deleteDrive = (id) => request(`/drives/${id}`, { method: 'DELETE' })
