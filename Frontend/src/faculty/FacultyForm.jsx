import React, { useState } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';

const emptyFaculty = {
  facultyId: '',
  name: '',
  email: '',
  phone: '',
  department: 'Computer Science',
  designation: 'Assistant Professor',
  specialization: '',
  qualification: 'Ph.D.',
  officeRoom: '',
  status: 'Active',
  joiningYear: new Date().getFullYear(),
};

const FacultyForm = ({ initialValues = {}, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState({ ...emptyFaculty, ...initialValues });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim()) {
      setError('Faculty name and institutional email are mandatory.');
      return;
    }

    try {
      await onSubmit({
        ...form,
        joiningYear: form.joiningYear ? Number(form.joiningYear) : new Date().getFullYear(),
      });
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
        {/* Full Name */}
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

        {/* Faculty ID */}
        <div className="form-group">
          <label htmlFor="fac-id">
            <span>Faculty Identification ID</span>
          </label>
          <input
            id="fac-id"
            name="facultyId"
            value={form.facultyId}
            onChange={handleChange}
            placeholder="e.g. FAC-01 (Auto if blank)"
          />
        </div>

        {/* Email */}
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

        {/* Phone */}
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

        {/* Department */}
        <div className="form-group">
          <label htmlFor="fac-dept">
            <span>Department</span>
          </label>
          <select id="fac-dept" name="department" value={form.department} onChange={handleChange}>
            <option value="Computer Science">Computer Science</option>
            <option value="Physics">Physics</option>
            <option value="Electrical Eng">Electrical Eng</option>
            <option value="Mechanical Eng">Mechanical Eng</option>
            <option value="Civil Eng">Civil Eng</option>
            <option value="Mathematics">Mathematics</option>
          </select>
        </div>

        {/* Designation */}
        <div className="form-group">
          <label htmlFor="fac-role">
            <span>Academic Designation</span>
          </label>
          <select
            id="fac-role"
            name="designation"
            value={form.designation}
            onChange={handleChange}
          >
            <option value="Professor & Chair">Professor & Chair</option>
            <option value="Head of Department">Head of Department</option>
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Lecturer">Lecturer</option>
          </select>
        </div>

        {/* Highest Qualification */}
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

        {/* Office / Room */}
        <div className="form-group">
          <label htmlFor="fac-room">
            <span>Office / Lab Location</span>
          </label>
          <input
            id="fac-room"
            name="officeRoom"
            value={form.officeRoom}
            onChange={handleChange}
            placeholder="e.g. Tech Block 401"
          />
        </div>

        {/* Specialization */}
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
          <Save size={16} /> {submitting ? 'Saving...' : initialValues._id || initialValues.facultyId ? 'Update Faculty' : 'Register Faculty'}
        </button>
      </div>
    </form>
  );
};

export default FacultyForm;

