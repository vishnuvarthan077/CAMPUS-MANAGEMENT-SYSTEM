import React, { useState } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';

const emptyForm = {
  name: '',
  code: '',
  description: '',
  headOfDepartment: '',
  establishedYear: '',
  isActive: true,
};

function DepartmentForm({ initialValues, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.code.trim()) {
      setError('Department name and code are required.');
      return;
    }

    try {
      await onSubmit({
        ...form,
        establishedYear: form.establishedYear ? Number(form.establishedYear) : undefined,
      });
    } catch (err) {
      setError(err.message || 'Failed to save department');
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
        <div className="form-group">
          <label htmlFor="dept-name">
            <span>Department Name *</span>
          </label>
          <input 
            id="dept-name"
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="e.g. Computer Science & Eng" 
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dept-code">
            <span>Department Code *</span>
          </label>
          <input 
            id="dept-code"
            name="code" 
            value={form.code} 
            onChange={handleChange} 
            placeholder="e.g. CSE" 
            style={{ textTransform: 'uppercase' }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dept-hod">
            <span>Head of Department</span>
          </label>
          <input
            id="dept-hod"
            name="headOfDepartment"
            value={form.headOfDepartment}
            onChange={handleChange}
            placeholder="e.g. Dr. Jane Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dept-year">
            <span>Established Year</span>
          </label>
          <input
            id="dept-year"
            type="number"
            name="establishedYear"
            value={form.establishedYear}
            onChange={handleChange}
            placeholder="e.g. 1998"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="dept-desc">
            <span>Description</span>
          </label>
          <textarea
            id="dept-desc"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Brief description about the academic programs and goals..."
          />
        </div>

        <div className="form-group full-width">
          <label className="checkbox-label" style={{ marginTop: '0.25rem' }}>
            <input 
              type="checkbox" 
              name="isActive" 
              checked={form.isActive} 
              onChange={handleChange} 
            />
            <span>Department is actively enrolling students</span>
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>
          <X size={16} /> Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          <Save size={16} /> {submitting ? 'Saving...' : 'Save Department'}
        </button>
      </div>
    </form>
  );
}

export default DepartmentForm;
