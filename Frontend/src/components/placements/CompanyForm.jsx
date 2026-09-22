import { useState } from 'react'

const emptyForm = {
  name: '',
  industry: '',
  website: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  description: '',
  isActive: true,
}

function CompanyForm({ initialValues, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Company name is required')
      return
    }

    try {
      await onSubmit(form)
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
          <input name="name" value={form.name} onChange={handleChange} placeholder="TechNova Inc" />
        </label>

        <label>
          <span>Industry</span>
          <input name="industry" value={form.industry} onChange={handleChange} placeholder="Software" />
        </label>

        <label>
          <span>Contact Email</span>
          <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="hr@technova.com" />
        </label>

        <label>
          <span>Contact Phone</span>
          <input name="contactPhone" value={form.contactPhone} onChange={handleChange} />
        </label>

        <label>
          <span>Website</span>
          <input name="website" value={form.website} onChange={handleChange} placeholder="https://technova.com" />
        </label>

        <label>
          <span>Address</span>
          <input name="address" value={form.address} onChange={handleChange} />
        </label>

        <label className="full-width">
          <span>Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
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
          {submitting ? 'Saving...' : 'Save Company'}
        </button>
      </div>
    </form>
  )
}

export default CompanyForm
