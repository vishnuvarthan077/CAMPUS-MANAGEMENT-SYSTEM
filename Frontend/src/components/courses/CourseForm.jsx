import { useState } from 'react'

const emptyForm = {
  name: '',
  code: '',
  department: '',
  description: '',
  credits: 3,
  semester: 1,
  courseType: 'Core',
  seatsAvailable: 60,
  isActive: true,
}

function CourseForm({ initialValues, departments, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.code.trim() || !form.department) {
      setError('Name, code and department are required')
      return
    }

    try {
      await onSubmit({
        ...form,
        credits: Number(form.credits),
        semester: Number(form.semester),
        seatsAvailable: Number(form.seatsAvailable),
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
          <input name="name" value={form.name} onChange={handleChange} placeholder="Data Structures" />
        </label>

        <label>
          <span>Code *</span>
          <input name="code" value={form.code} onChange={handleChange} placeholder="CS201" />
        </label>

        <label>
          <span>Department *</span>
          <select name="department" value={form.department} onChange={handleChange}>
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name} ({dept.code})
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Course Type</span>
          <select name="courseType" value={form.courseType} onChange={handleChange}>
            <option value="Core">Core</option>
            <option value="Elective">Elective</option>
            <option value="Lab">Lab</option>
            <option value="Project">Project</option>
          </select>
        </label>

        <label>
          <span>Credits</span>
          <input type="number" name="credits" min={1} max={10} value={form.credits} onChange={handleChange} />
        </label>

        <label>
          <span>Semester</span>
          <input type="number" name="semester" min={1} max={8} value={form.semester} onChange={handleChange} />
        </label>

        <label>
          <span>Seats Available</span>
          <input
            type="number"
            name="seatsAvailable"
            min={0}
            value={form.seatsAvailable}
            onChange={handleChange}
          />
        </label>

        <label className="full-width">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Short description of the course"
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
          {submitting ? 'Saving...' : 'Save Course'}
        </button>
      </div>
    </form>
  )
}

export default CourseForm
