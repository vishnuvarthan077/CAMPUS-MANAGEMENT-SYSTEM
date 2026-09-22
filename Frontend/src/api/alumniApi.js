import { request, toQueryString } from './client'

export const getAlumniDirectory = (params = {}) => request(`/alumni${toQueryString(params)}`)

export const getAlumniProfile = (id) => request(`/alumni/${id}`)

export const registerAlumni = (payload) =>
  request('/alumni', { method: 'POST', body: JSON.stringify(payload) })

export const updateAlumni = (id, payload) =>
  request(`/alumni/${id}`, { method: 'PUT', body: JSON.stringify(payload) })

export const toggleVerifyAlumni = (id) => request(`/alumni/${id}/verify`, { method: 'PATCH' })

export const deleteAlumni = (id) => request(`/alumni/${id}`, { method: 'DELETE' })
