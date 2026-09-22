import React, { useState } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';

const emptyStudent = {
  name: '',
  email: '',
  password: '',
  phone: '',
  rollNumber: '',
  department: '',
  semester: 1,
  batch: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  guardianName: '',
  guardianPhone: '',
};

const StudentForm = ({ initialValues = {}, departments = [], onSubmit, onCancel, submitting }) => {
  const isEdit = Boolean(initialValues._id);
  const [form, setForm] = useState({
    ...emptyStudent,
    ...initialValues,
    name: initialValues.user?.name || '',
    email: initialValues.user?.email || '',
    department: initialValues.department?._id || initialValues.department || '',
    dateOfBirth: initialValues.dateOfBirth ? initialValues.dateOfBirth.slice(0, 10) : '',
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
      setError('Name, email, and password are required to create the student account.');
      return;
    }

    if (!form.rollNumber.trim() || !form.department) {
      setError('Roll number and department are required.');
      return;
    }

    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || 'Failed to save student profile.');
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
              <label htmlFor="stu-name">
                <span>Full Legal Name *</span>
              </label>
              <input
                id="stu-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Alex Johnson"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stu-email">
                <span>Campus Email Address *</span>
              </label>
              <input
                id="stu-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. alex.j@campus.edu"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stu-password">
                <span>Initial Password *</span>
              </label>
              <input
                id="stu-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stu-phone">
                <span>Phone Number</span>
              </label>
              <input
                id="stu-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +1 (555) 019-2834"
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="stu-roll">
            <span>Roll Number *</span>
          </label>
          <input
            id="stu-roll"
            name="rollNumber"
            value={form.rollNumber}
            onChange={handleChange}
            placeholder="e.g. STU-1001"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stu-dept">
            <span>Academic Department *</span>
          </label>
          <select id="stu-dept" name="department" value={form.department} onChange={handleChange} required>
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name} ({dept.code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="stu-sem">
            <span>Current Semester</span>
          </label>
          <select id="stu-sem" name="semester" value={form.semester} onChange={handleChange}>
            {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="stu-batch">
            <span>Batch</span>
          </label>
          <input
            id="stu-batch"
            name="batch"
            value={form.batch}
            onChange={handleChange}
            placeholder="e.g. 2023-2027"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stu-dob">
            <span>Date of Birth</span>
          </label>
          <input
            id="stu-dob"
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="stu-gender">
            <span>Gender</span>
          </label>
          <select id="stu-gender" name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Prefer not to say</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="stu-address">
            <span>Address</span>
          </label>
          <input
            id="stu-address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street, city, state"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stu-guardian-name">
            <span>Guardian Name</span>
          </label>
          <input
            id="stu-guardian-name"
            name="guardianName"
            value={form.guardianName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="stu-guardian-phone">
            <span>Guardian Phone</span>
          </label>
          <input
            id="stu-guardian-phone"
            name="guardianPhone"
            value={form.guardianPhone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>
          <X size={16} /> Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          <Save size={16} /> {submitting ? 'Saving...' : isEdit ? 'Update Student' : 'Register Student'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
