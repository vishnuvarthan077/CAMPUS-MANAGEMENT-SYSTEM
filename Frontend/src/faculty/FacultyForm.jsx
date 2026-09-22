import React, { useState } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';

const emptyFaculty = {
  name: '',
  email: '',
  password: '',
  phone: '',
  employeeId: '',
  department: '',
  designation: 'Assistant Professor',
  specialization: '',
  qualification: '',
  officeLocation: '',
};

const FacultyForm = ({ initialValues = {}, departments = [], onSubmit, onCancel, submitting }) => {
  const isEdit = Boolean(initialValues._id);
  const [form, setForm] = useState({
    ...emptyFaculty,
    ...initialValues,
    name: initialValues.user?.name || '',
    email: initialValues.user?.email || '',
    department: initialValues.department?._id || initialValues.department || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEdit && (!form.name.trim() || !form.email.trim() || !form.password.trim())) {
      setError('Name, email, and password are required to create the faculty account.');
      return;
    }

    if (!form.employeeId.trim() || !form.department) {
      setError('Employee ID and department are required.');
      return;
    }

    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || 'Failed to save faculty record.');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && (
        <div className="alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-grid">
        {!isEdit && (
          <>
            <div className="form-group full-width">
              <label htmlFor="fac-name">
                <span>Full Name & Honorific *</span>
              </label>
              <input
                id="fac-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Dr. Alan Turing"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fac-email">
                <span>Campus Email Address *</span>
              </label>
              <input
                id="fac-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. a.turing@campus.edu"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fac-password">
                <span>Initial Password *</span>
              </label>
              <input
                id="fac-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fac-phone">
                <span>Contact Phone</span>
              </label>
              <input
                id="fac-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +1 (555) 901-2345"
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="fac-id">
            <span>Employee ID *</span>
          </label>
          <input
            id="fac-id"
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            placeholder="e.g. FAC-01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fac-dept">
            <span>Department *</span>
          </label>
          <select id="fac-dept" name="department" value={form.department} onChange={handleChange} required>
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name} ({dept.code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fac-role">
            <span>Academic Designation</span>
          </label>
          <select id="fac-role" name="designation" value={form.designation} onChange={handleChange}>
            <option value="Professor & Chair">Professor & Chair</option>
            <option value="Head of Department">Head of Department</option>
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Lecturer">Lecturer</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fac-qual">
            <span>Highest Qualification</span>
          </label>
          <input
            id="fac-qual"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            placeholder="e.g. Ph.D. in Artificial Intelligence"
          />
        </div>

        <div className="form-group">
          <label htmlFor="fac-room">
            <span>Office / Lab Location</span>
          </label>
          <input
            id="fac-room"
            name="officeLocation"
            value={form.officeLocation}
            onChange={handleChange}
            placeholder="e.g. Tech Block 401"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="fac-spec">
            <span>Research Focus & Specialization</span>
          </label>
          <textarea
            id="fac-spec"
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            rows={2}
            placeholder="e.g. Machine Learning, Distributed Computing, Cryptography"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>
          <X size={16} /> Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          <Save size={16} /> {submitting ? 'Saving...' : isEdit ? 'Update Faculty' : 'Register Faculty'}
        </button>
      </div>
    </form>
  );
};

export default FacultyForm;
