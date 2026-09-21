import { request, toQueryString } from './client'

export const getCourses = (params = {}) => request(`/courses${toQueryString(params)}`)

export const getCourse = (id) => request(`/courses/${id}`)

export const createCourse = (payload) =>
  request('/courses', { method: 'POST', body: JSON.stringify(payload) })

export const updateCourse = (id, payload) =>
  request(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(payload) })

export const deleteCourse = (id) => request(`/courses/${id}`, { method: 'DELETE' })
