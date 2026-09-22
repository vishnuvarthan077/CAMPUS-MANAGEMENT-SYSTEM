import { useState } from 'react'

const emptyForm = {
  title: '',
  content: '',
  category: 'General',
  priority: 'Normal',
  targetAudience: 'All',
  department: '',
  postedBy: '',
  expiryDate: '',
  isPinned: false,
}

function NoticeForm({ initialValues, departments, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    ...emptyForm,
    ...initialValues,
    expiryDate: initialValues?.expiryDate ? initialValues.expiryDate.slice(0, 10) : '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim() || !form.content.trim() || !form.postedBy.trim()) {
      setError('Title, content and posted by are required')
      return
    }

    try {
      await onSubmit({
        ...form,
        department: form.department || undefined,
        expiryDate: form.expiryDate || undefined,
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <div className="alert-error">{error}</div>}

      <div className="form-grid">
        <label className="full-width">
          <span>Title *</span>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Campus Wifi Maintenance" />
        </label>

        <label className="full-width">
          <span>Content *</span>
          <textarea name="content" value={form.content} onChange={handleChange} rows={4} placeholder="Notice details..." />
        </label>

        <label>
          <span>Posted By *</span>
          <input name="postedBy" value={form.postedBy} onChange={handleChange} placeholder="Admin Office" />
        </label>

        <label>
          <span>Department</span>
          <select name="department" value={form.department} onChange={handleChange}>
            <option value="">Campus-wide</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name} ({dept.code})
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Category</span>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="General">General</option>
            <option value="Academic">Academic</option>
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
            <option value="Holiday">Holiday</option>
            <option value="Urgent">Urgent</option>
          </select>
        </label>

        <label>
          <span>Priority</span>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </label>

        <label>
          <span>Target Audience</span>
          <select name="targetAudience" value={form.targetAudience} onChange={handleChange}>
            <option value="All">All</option>
            <option value="Students">Students</option>
            <option value="Faculty">Faculty</option>
            <option value="Staff">Staff</option>
          </select>
        </label>

        <label>
          <span>Expiry Date</span>
          <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
        </label>

        <label className="checkbox-label">
          <input type="checkbox" name="isPinned" checked={form.isPinned} onChange={handleChange} />
          <span>Pin to top</span>
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Notice'}
        </button>
      </div>
    </form>
  )
}

export default NoticeForm
