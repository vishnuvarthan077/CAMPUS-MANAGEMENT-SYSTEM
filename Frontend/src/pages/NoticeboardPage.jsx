import { useEffect, useState } from 'react'
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePinNotice,
} from '../api/noticeApi'
import { getDepartments } from '../api/departmentApi'
import NoticeCard from '../components/notices/NoticeCard'
import NoticeForm from '../components/notices/NoticeForm'
import Modal from '../components/Modal'

const CATEGORIES = ['All', 'General', 'Academic', 'Exam', 'Event', 'Holiday', 'Urgent']

function tiltForId(id) {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1000
  }
  return (hash % 5) - 2
}

function NoticeboardPage() {
  const [notices, setNotices] = useState([])
  const [departments, setDepartments] = useState([])
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadNotices = async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const res = await getNotices(params)
      setNotices(res.data)
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
    loadNotices()
  }, [])

  const buildParams = (overrides = {}) => {
    const params = { search, ...overrides }
    const activeCategory = overrides.category ?? category
    if (activeCategory && activeCategory !== 'All') params.category = activeCategory
    return params
  }

  const handleCategoryClick = (cat) => {
    setCategory(cat)
    loadNotices(buildParams({ category: cat }))
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadNotices(buildParams())
  }

  const openCreateModal = () => {
    setEditingNotice(null)
    setModalOpen(true)
  }

  const openEditModal = (notice) => {
    setEditingNotice({ ...notice, department: notice.department?._id || '' })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingNotice(null)
  }

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      if (editingNotice) {
        await updateNotice(editingNotice._id, payload)
      } else {
        await createNotice(payload)
      }
      closeModal()
      await loadNotices(buildParams())
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (notice) => {
    if (!window.confirm(`Delete notice "${notice.title}"?`)) return
    try {
      await deleteNotice(notice._id)
      await loadNotices(buildParams())
    } catch (err) {
      setError(err.message)
    }
  }

  const handleTogglePin = async (notice) => {
    try {
      await togglePinNotice(notice._id)
      await loadNotices(buildParams())
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Noticeboard</h1>
          <p className="page-subtitle">Campus announcements, pinned to the top</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          + Post Notice
        </button>
      </div>

      <div className="notice-filter-bar">
        <div className="category-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip ${category === cat ? 'chip-active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <form className="toolbar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn">
            Search
          </button>
        </form>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading notices...</div>
      ) : notices.length === 0 ? (
        <div className="empty-state">No notices found. Post one to get started.</div>
      ) : (
        <div className="notice-board">
          {notices.map((notice) => (
            <NoticeCard
              key={notice._id}
              notice={notice}
              tilt={tiltForId(notice._id)}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editingNotice ? 'Edit Notice' : 'Post Notice'} onClose={closeModal}>
          <NoticeForm
            initialValues={editingNotice || {}}
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

export default NoticeboardPage
