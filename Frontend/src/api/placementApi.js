import { request, toQueryString } from './client'

export const getPlacements = (params = {}) => request(`/placements${toQueryString(params)}`)

export const getPlacementStats = () => request('/placements/stats')

export const getPlacement = (id) => request(`/placements/${id}`)

export const createPlacement = (payload) =>
  request('/placements', { method: 'POST', body: JSON.stringify(payload) })

export const updatePlacement = (id, payload) =>
  request(`/placements/${id}`, { method: 'PUT', body: JSON.stringify(payload) })

export const deletePlacement = (id) => request(`/placements/${id}`, { method: 'DELETE' })
