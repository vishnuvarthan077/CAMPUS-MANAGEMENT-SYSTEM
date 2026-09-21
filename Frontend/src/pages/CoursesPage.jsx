import { useEffect, useState } from 'react'
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api/courseApi'
import { getDepartments } from '../api/departmentApi'
import CourseList from '../components/courses/CourseList'
import CourseForm from '../components/courses/CourseForm'
import Modal from '../components/Modal'

function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [departments, setDepartments] = useState([])
  const [filters, setFilters] = useState({ search: '', department: '', semester: '', courseType: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadCourses = async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const res = await getCourses(params)
      setCourses(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadDepartments = async () => {
    try {
      const res = await getDepartments()
      setDepartments(res.data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadDepartments()
    loadCourses()
  }, [])

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const applyFilters = (e) => {
    e.preventDefault()
    loadCourses(filters)
  }

  const openCreateModal = () => {
    setEditingCourse(null)
    setModalOpen(true)
  }

  const openEditModal = (course) => {
    setEditingCourse({ ...course, department: course.department?._id || '' })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingCourse(null)
  }

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, payload)
      } else {
        await createCourse(payload)
      }
      closeModal()
      await loadCourses(filters)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete course "${course.name}"?`)) return
    try {
      await deleteCourse(course._id)
      await loadCourses(filters)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">Manage courses offered across departments</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          + Add Course
        </button>
      </div>

      <form className="toolbar" onSubmit={applyFilters}>
        <input
          type="text"
          name="search"
          placeholder="Search by name or code..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select name="department" value={filters.department} onChange={handleFilterChange}>
          <option value="">All departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
        <select name="semester" value={filters.semester} onChange={handleFilterChange}>
          <option value="">All semesters</option>
          {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
        <select name="courseType" value={filters.courseType} onChange={handleFilterChange}>
          <option value="">All types</option>
          <option value="Core">Core</option>
          <option value="Elective">Elective</option>
          <option value="Lab">Lab</option>
          <option value="Project">Project</option>
        </select>
        <button type="submit" className="btn">
          Filter
        </button>
      </form>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading courses...</div>
      ) : (
        <CourseList courses={courses} onEdit={openEditModal} onDelete={handleDelete} />
      )}

      {modalOpen && (
        <Modal title={editingCourse ? 'Edit Course' : 'Add Course'} onClose={closeModal}>
          <CourseForm
            initialValues={editingCourse || {}}
            departments={departments}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  )
}

export default CoursesPage
