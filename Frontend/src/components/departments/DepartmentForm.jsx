import { useState } from 'react'

const emptyForm = {
  name: '',
  code: '',
  description: '',
  headOfDepartment: '',
  establishedYear: '',
  isActive: true,
}

function DepartmentForm({ initialValues, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.code.trim()) {
      setError('Name and code are required')
      return
    }

    try {
      await onSubmit({
        ...form,
        establishedYear: form.establishedYear ? Number(form.establishedYear) : undefined,
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <div className="alert-error">{error}</div>}

      <div className="form-grid">
        <label>
          <span>Name *</span>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Computer Science" />
        </label>

        <label>
          <span>Code *</span>
          <input name="code" value={form.code} onChange={handleChange} placeholder="CSE" />
        </label>

        <label>
          <span>Head of Department</span>
          <input
            name="headOfDepartment"
            value={form.headOfDepartment}
            onChange={handleChange}
            placeholder="Dr. Jane Doe"
          />
        </label>

        <label>
          <span>Established Year</span>
          <input
            type="number"
            name="establishedYear"
            value={form.establishedYear}
            onChange={handleChange}
            placeholder="1998"
          />
        </label>

        <label className="full-width">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Short description of the department"
          />
        </label>

        <label className="checkbox-label">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          <span>Active</span>
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Department'}
        </button>
      </div>
    </form>
  )
}

export default DepartmentForm
