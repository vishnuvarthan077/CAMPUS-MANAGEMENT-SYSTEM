import { request, toQueryString } from './client'

export const getCompanies = (params = {}) => request(`/companies${toQueryString(params)}`)

export const getCompany = (id) => request(`/companies/${id}`)

export const createCompany = (payload) =>
  request('/companies', { method: 'POST', body: JSON.stringify(payload) })

export const updateCompany = (id, payload) =>
  request(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(payload) })

export const deleteCompany = (id) => request(`/companies/${id}`, { method: 'DELETE' })
