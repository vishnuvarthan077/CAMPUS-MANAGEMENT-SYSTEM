import React, { useState } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';

const emptyStudent = {
  studentId: '',
  name: '',
  email: '',
  phone: '',
  department: 'Computer Science',
  year: '1st Year',
  semester: 'Semester 1',
  gpa: '3.50',
  status: 'Enrolled',
  admissionDate: new Date().toISOString().split('T')[0],
};

const StudentForm = ({ initialValues = {}, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState({ ...emptyStudent, ...initialValues });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim()) {
      setError('Student name and email are mandatory.');
      return;
    }

    try {
      await onSubmit({
        ...form,
        gpa: form.gpa ? Number(form.gpa) : 3.5,
      });
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
        {/* Full Name */}
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

        {/* Student ID */}
        <div className="form-group">
          <label htmlFor="stu-id">
            <span>Student Registration ID</span>
          </label>
          <input
            id="stu-id"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            placeholder="e.g. STU-1001 (Auto if blank)"
          />
        </div>

        {/* Email */}
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

        {/* Phone */}
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

        {/* Department */}
        <div className="form-group">
          <label htmlFor="stu-dept">
            <span>Academic Department</span>
          </label>
          <select id="stu-dept" name="department" value={form.department} onChange={handleChange}>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical Eng">Electrical Eng</option>
            <option value="Mechanical Eng">Mechanical Eng</option>
            <option value="Civil Eng">Civil Eng</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
          </select>
        </div>

        {/* Academic Year */}
        <div className="form-group">
          <label htmlFor="stu-year">
            <span>Academic Year</span>
          </label>
          <select id="stu-year" name="year" value={form.year} onChange={handleChange}>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        {/* Semester */}
        <div className="form-group">
          <label htmlFor="stu-sem">
            <span>Current Semester</span>
          </label>
          <select id="stu-sem" name="semester" value={form.semester} onChange={handleChange}>
            {Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Current CGPA */}
        <div className="form-group">
          <label htmlFor="stu-gpa">
            <span>Current Cumulative GPA (0.0 - 4.0)</span>
          </label>
          <input
            id="stu-gpa"
            type="number"
            step="0.01"
            min="0"
            max="4.0"
            name="gpa"
            value={form.gpa}
            onChange={handleChange}
            placeholder="3.75"
          />
        </div>

        {/* Status */}
        <div className="form-group">
          <label htmlFor="stu-status">
            <span>Enrollment Status</span>
          </label>
          <select id="stu-status" name="status" value={form.status} onChange={handleChange}>
            <option value="Enrolled">Enrolled (Active)</option>
            <option value="Graduated">Graduated</option>
            <option value="On Leave">On Leave</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>
          <X size={16} /> Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          <Save size={16} /> {submitting ? 'Saving...' : initialValues._id || initialValues.studentId ? 'Update Student' : 'Register Student'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;

