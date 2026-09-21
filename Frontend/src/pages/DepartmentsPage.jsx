import { useEffect, useState } from 'react'
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../api/departmentApi'
import DepartmentList from '../components/departments/DepartmentList'
import DepartmentForm from '../components/departments/DepartmentForm'
import Modal from '../components/Modal'

function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadDepartments = async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const res = await getDepartments(params)
      setDepartments(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDepartments()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    loadDepartments(search ? { search } : {})
  }

  const openCreateModal = () => {
    setEditingDept(null)
    setModalOpen(true)
  }

  const openEditModal = (dept) => {
    setEditingDept(dept)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingDept(null)
  }

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      if (editingDept) {
        await updateDepartment(editingDept._id, payload)
      } else {
        await createDepartment(payload)
      }
      closeModal()
      await loadDepartments()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (dept) => {
    if (!window.confirm(`Delete department "${dept.name}"?`)) return
    try {
      await deleteDepartment(dept._id)
      await loadDepartments()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Manage academic departments</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          + Add Department
        </button>
      </div>

      <form className="toolbar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading departments...</div>
      ) : (
        <DepartmentList departments={departments} onEdit={openEditModal} onDelete={handleDelete} />
      )}

      {modalOpen && (
        <Modal title={editingDept ? 'Edit Department' : 'Add Department'} onClose={closeModal}>
          <DepartmentForm
            initialValues={editingDept || {}}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  )
}

export default DepartmentsPage
