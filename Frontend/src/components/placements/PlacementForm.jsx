import { useState } from 'react'

const emptyForm = {
  drive: '',
  studentName: '',
  rollNumber: '',
  department: '',
  ctcOffered: '',
  status: 'Offered',
}

function PlacementForm({ initialValues, drives, departments, lockDrive, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    ...emptyForm,
    ...initialValues,
    drive: initialValues?.drive?._id || initialValues?.drive || '',
    department: initialValues?.department?._id || initialValues?.department || '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.drive || !form.studentName.trim() || !form.rollNumber.trim() || !form.department || !form.ctcOffered) {
      setError('Drive, student name, roll number, department and CTC are required')
      return
    }

    try {
      await onSubmit({ ...form, ctcOffered: Number(form.ctcOffered) })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <div className="alert-error">{error}</div>}

      <div className="form-grid">
        <label className="full-width">
          <span>Drive *</span>
          <select name="drive" value={form.drive} onChange={handleChange} disabled={lockDrive}>
            <option value="">Select drive</option>
            {drives.map((d) => (
              <option key={d._id} value={d._id}>
                {d.company?.name} — {d.role} ({d.ctc} LPA)
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Student Name *</span>
          <input name="studentName" value={form.studentName} onChange={handleChange} placeholder="Arjun Kumar" />
        </label>

        <label>
          <span>Roll Number *</span>
          <input name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="CSE21001" />
        </label>

        <label>
          <span>Department *</span>
          <select name="department" value={form.department} onChange={handleChange}>
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>CTC Offered (LPA) *</span>
          <input type="number" step="0.1" name="ctcOffered" value={form.ctcOffered} onChange={handleChange} placeholder="12.5" />
        </label>

        <label>
          <span>Status</span>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Offered">Offered</option>
            <option value="Accepted">Accepted</option>
            <option value="Declined">Declined</option>
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Placement'}
        </button>
      </div>
    </form>
  )
}

export default PlacementForm
