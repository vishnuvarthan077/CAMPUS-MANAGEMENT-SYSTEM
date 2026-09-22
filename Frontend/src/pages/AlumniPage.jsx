import { useEffect, useState } from 'react'
import {
  getAlumniDirectory,
  registerAlumni,
  updateAlumni,
  deleteAlumni,
  toggleVerifyAlumni,
} from '../api/alumniApi'
import { getDepartments } from '../api/departmentApi'
import AlumniCard from '../components/alumni/AlumniCard'
import AlumniForm from '../components/alumni/AlumniForm'
import Modal from '../components/Modal'

const VERIFIED_FILTERS = [
  { id: '', label: 'All' },
  { id: 'true', label: 'Verified' },
  { id: 'false', label: 'Unverified' },
]

function AlumniPage() {
  const [alumni, setAlumni] = useState([])
  const [departments, setDepartments] = useState([])
  const [filters, setFilters] = useState({ search: '', department: '', graduationYear: '', isVerified: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAlumni, setEditingAlumni] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadAlumni = async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const res = await getAlumniDirectory(params)
      setAlumni(res.data)
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
    } catch {
      // department dropdown is optional; ignore failures here
    }
  }

  useEffect(() => {
    loadDepartments()
    loadAlumni()
  }, [])

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const applyFilters = (e) => {
    e.preventDefault()
    loadAlumni(filters)
  }

  const handleVerifiedFilter = (value) => {
    const next = { ...filters, isVerified: value }
    setFilters(next)
    loadAlumni(next)
  }

  const openCreateModal = () => {
    setEditingAlumni(null)
    setModalOpen(true)
  }

  const openEditModal = (profile) => {
    setEditingAlumni(profile)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingAlumni(null)
  }

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      if (editingAlumni) {
        await updateAlumni(editingAlumni._id, payload)
      } else {
        await registerAlumni(payload)
      }
      closeModal()
      await loadAlumni(filters)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (profile) => {
    if (!window.confirm(`Remove alumni profile for "${profile.fullName}"?`)) return
    try {
      await deleteAlumni(profile._id)
      await loadAlumni(filters)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleVerify = async (profile) => {
    try {
      await toggleVerifyAlumni(profile._id)
      await loadAlumni(filters)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Alumni Directory</h1>
          <p className="page-subtitle">Find and connect with graduates of the campus</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          + Register Alumni
        </button>
      </div>

      <div className="notice-filter-bar">
        <div className="category-chips">
          {VERIFIED_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip ${filters.isVerified === f.id ? 'chip-active' : ''}`}
              onClick={() => handleVerifiedFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <form className="toolbar" onSubmit={applyFilters}>
          <input
            type="text"
            name="search"
            placeholder="Search by name, company, skill..."
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
          <input
            type="number"
            name="graduationYear"
            placeholder="Batch year"
            value={filters.graduationYear}
            onChange={handleFilterChange}
            className="year-input"
          />
          <button type="submit" className="btn">
            Search
          </button>
        </form>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading alumni directory...</div>
      ) : alumni.length === 0 ? (
        <div className="empty-state">No alumni found. Register one to get started.</div>
      ) : (
        <div className="alumni-grid">
          {alumni.map((profile) => (
            <AlumniCard
              key={profile._id}
              alumni={profile}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onToggleVerify={handleToggleVerify}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editingAlumni ? 'Edit Alumni Profile' : 'Register Alumni'} onClose={closeModal}>
          <AlumniForm
            initialValues={editingAlumni || {}}
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

export default AlumniPage
