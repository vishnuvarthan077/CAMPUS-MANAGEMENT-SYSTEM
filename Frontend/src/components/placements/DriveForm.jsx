import { useState } from 'react'

const emptyForm = {
  company: '',
  role: '',
  driveType: 'On-Campus',
  ctc: '',
  minCgpa: 0,
  maxBacklogs: 0,
  allowedDepartments: [],
  driveDate: '',
  applicationDeadline: '',
  rounds: '',
  status: 'Upcoming',
  description: '',
}

function DriveForm({ initialValues, companies, departments, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    ...emptyForm,
    ...initialValues,
    driveDate: initialValues?.driveDate ? initialValues.driveDate.slice(0, 10) : '',
    applicationDeadline: initialValues?.applicationDeadline
      ? initialValues.applicationDeadline.slice(0, 10)
      : '',
    allowedDepartments: initialValues?.allowedDepartments?.map((d) => d._id || d) || [],
    rounds: initialValues?.rounds?.join(', ') || '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleDeptToggle = (deptId) => {
    setForm((prev) => ({
      ...prev,
      allowedDepartments: prev.allowedDepartments.includes(deptId)
        ? prev.allowedDepartments.filter((id) => id !== deptId)
        : [...prev.allowedDepartments, deptId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.company || !form.role.trim() || !form.ctc || !form.driveDate) {
      setError('Company, role, CTC and drive date are required')
      return
    }

    try {
      await onSubmit({
        ...form,
        ctc: Number(form.ctc),
        minCgpa: Number(form.minCgpa) || 0,
        maxBacklogs: Number(form.maxBacklogs) || 0,
        rounds: form.rounds
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
        applicationDeadline: form.applicationDeadline || undefined,
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
          <span>Company *</span>
          <select name="company" value={form.company} onChange={handleChange}>
            <option value="">Select company</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Role *</span>
          <input name="role" value={form.role} onChange={handleChange} placeholder="SDE-1" />
        </label>

        <label>
          <span>Drive Type</span>
          <select name="driveType" value={form.driveType} onChange={handleChange}>
            <option value="On-Campus">On-Campus</option>
            <option value="Off-Campus">Off-Campus</option>
            <option value="Pool Campus">Pool Campus</option>
          </select>
        </label>

        <label>
          <span>Status</span>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>

        <label>
          <span>CTC (LPA) *</span>
          <input type="number" step="0.1" name="ctc" value={form.ctc} onChange={handleChange} placeholder="12.5" />
        </label>

        <label>
          <span>Min CGPA</span>
          <input type="number" step="0.1" min={0} max={10} name="minCgpa" value={form.minCgpa} onChange={handleChange} />
        </label>

        <label>
          <span>Max Backlogs</span>
          <input type="number" min={0} name="maxBacklogs" value={form.maxBacklogs} onChange={handleChange} />
        </label>

        <label>
          <span>Drive Date *</span>
          <input type="date" name="driveDate" value={form.driveDate} onChange={handleChange} />
        </label>

        <label>
          <span>Application Deadline</span>
          <input
            type="date"
            name="applicationDeadline"
            value={form.applicationDeadline}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Rounds (comma separated)</span>
          <input name="rounds" value={form.rounds} onChange={handleChange} placeholder="Aptitude, Technical, HR" />
        </label>

        <div className="full-width">
          <span className="field-label">Eligible Departments (none = all)</span>
          <div className="dept-checkbox-grid">
            {departments.map((dept) => (
              <label key={dept._id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.allowedDepartments.includes(dept._id)}
                  onChange={() => handleDeptToggle(dept._id)}
                />
                <span>{dept.code}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="full-width">
          <span>Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Drive'}
        </button>
      </div>
    </form>
  )
}

export default DriveForm
