import { useState } from 'react'

const emptyForm = {
  fullName: '',
  rollNumber: '',
  email: '',
  phone: '',
  department: '',
  degree: '',
  graduationYear: new Date().getFullYear(),
  currentCompany: '',
  designation: '',
  currentLocation: '',
  linkedinUrl: '',
  bio: '',
  skills: '',
}

function AlumniForm({ initialValues, departments, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    ...emptyForm,
    ...initialValues,
    department: initialValues?.department?._id || initialValues?.department || '',
    skills: initialValues?.skills?.join(', ') || '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.fullName.trim() || !form.rollNumber.trim() || !form.email.trim() || !form.department) {
      setError('Full name, roll number, email and department are required')
      return
    }

    try {
      await onSubmit({
        ...form,
        graduationYear: Number(form.graduationYear),
        skills: form.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
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
          <span>Full Name *</span>
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Ravi Teja" />
        </label>

        <label>
          <span>Roll Number *</span>
          <input name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="CSE17045" />
        </label>

        <label>
          <span>Email *</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="ravi@example.com" />
        </label>

        <label>
          <span>Phone</span>
          <input name="phone" value={form.phone} onChange={handleChange} />
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
          <span>Degree</span>
          <input name="degree" value={form.degree} onChange={handleChange} placeholder="B.Tech" />
        </label>

        <label>
          <span>Graduation Year *</span>
          <input
            type="number"
            name="graduationYear"
            value={form.graduationYear}
            onChange={handleChange}
            min={1980}
          />
        </label>

        <label>
          <span>Current Company</span>
          <input name="currentCompany" value={form.currentCompany} onChange={handleChange} placeholder="Google" />
        </label>

        <label>
          <span>Designation</span>
          <input name="designation" value={form.designation} onChange={handleChange} placeholder="SWE II" />
        </label>

        <label>
          <span>Location</span>
          <input name="currentLocation" value={form.currentLocation} onChange={handleChange} placeholder="Bengaluru, India" />
        </label>

        <label>
          <span>LinkedIn URL</span>
          <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
        </label>

        <label>
          <span>Skills (comma separated)</span>
          <input name="skills" value={form.skills} onChange={handleChange} placeholder="Go, Distributed Systems" />
        </label>

        <label className="full-width">
          <span>Bio</span>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="A short bio..." />
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}

export default AlumniForm
