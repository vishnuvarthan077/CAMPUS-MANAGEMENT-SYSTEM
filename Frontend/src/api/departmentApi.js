import { request, toQueryString } from './client'

export const getDepartments = (params = {}) => request(`/departments${toQueryString(params)}`)

export const getDepartment = (id) => request(`/departments/${id}`)

export const createDepartment = (payload) =>
  request('/departments', { method: 'POST', body: JSON.stringify(payload) })

export const updateDepartment = (id, payload) =>
  request(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(payload) })

export const deleteDepartment = (id) => request(`/departments/${id}`, { method: 'DELETE' })
