import React, { useEffect, useState, useMemo } from 'react';
import {
  UserSquare2,
  Plus,
  Award,
  Building2,
  AlertCircle,
  Download,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';
import { facultyService } from '../faculty/facultyService';
import { authService } from '../services/authService';
import { getDepartments } from '../api/departmentApi';
import FacultySearch from '../faculty/FacultySearch';
import FacultyList from '../faculty/FacultyList';
import FacultyForm from '../faculty/FacultyForm';
import Modal from '../components/Modal';

const Faculty = () => {
  const currentUser = authService.getCurrentUser() || { name: 'Admin User', role: 'admin' };
  const isStudent = currentUser.role === 'student';

  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    department: 'ALL',
    designation: 'ALL',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadFaculty = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await facultyService.getFaculty(filters);
      setFaculty(data);
    } catch (err) {
      setError(err.message || 'Failed to load faculty directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculty();
  }, [filters]);

  useEffect(() => {
    getDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => {});
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: 'ALL',
      designation: 'ALL',
    });
  };

  const handleOpenAddModal = () => {
    setSelectedFaculty(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setSelectedFaculty(member);
    setModalOpen(true);
  };

  const handleOpenDetails = (member) => {
    setSelectedFaculty(member);
    setDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFaculty(null);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (selectedFaculty) {
        await facultyService.updateFaculty(selectedFaculty._id, payload);
      } else {
        await facultyService.createFaculty(payload);
      }
      handleCloseModal();
      await loadFaculty();
    } catch (err) {
      setError(err.message || 'Failed to submit faculty record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (member) => {
    if (window.confirm(`Are you sure you want to remove "${member.user?.name}" from faculty records?`)) {
      try {
        await facultyService.deleteFaculty(member._id);
        await loadFaculty();
      } catch (err) {
        setError(err.message || 'Failed to delete faculty record');
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Specialization', 'Office'];
    const rows = faculty.map((f) => [
      f.employeeId,
      `"${f.user?.name || ''}"`,
      f.user?.email || '',
      f.user?.phone || '',
      `"${f.department?.name || ''}"`,
      `"${f.designation}"`,
      `"${f.specialization || ''}"`,
      `"${f.officeLocation || ''}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Faculty_Directory_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayedFaculty = useMemo(() => {
    if (!filters.designation || filters.designation === 'ALL') return faculty;
    return faculty.filter((f) => f.designation === filters.designation);
  }, [faculty, filters.designation]);

  const stats = facultyService.getStats(faculty);

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          {isStudent && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', padding: '0.2rem 0.65rem', borderRadius: '9999px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <ShieldCheck size={14} /> Faculty & Mentors Directory (View Only)
            </div>
          )}
          <h1 className="page-title">{isStudent ? 'Faculty Mentors & Academic Advisors' : 'Faculty & Academic Leadership'}</h1>
          <p className="page-subtitle">
            {isStudent 
              ? 'Find departmental professors, office room appointments, and research advisors' 
              : 'Manage professors, departmental chairs, research specializations, and office appointments'}
          </p>
        </div>
        {!isStudent && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={handleExportCSV}>
              <Download size={18} />
              <span>Export CSV</span>
            </button>
            <button type="button" className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={18} />
              <span>Add Faculty</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-primary">
            <UserSquare2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Faculty Members</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-success">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Professors & Chairs</span>
            <span className="stat-value">{stats.professors}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-info">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Departments</span>
            <span className="stat-value">{stats.departmentsCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-warning">
            <GraduationCap size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Avg. Experience Level</span>
            <span className="stat-value">{stats.professors} Sr.</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <FacultySearch
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        departments={departments}
      />

      {/* Error Alert */}
      {error && (
        <div className="alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Faculty List */}
      <FacultyList
        faculty={displayedFaculty}
        loading={loading}
        onEdit={!isStudent ? handleOpenEditModal : undefined}
        onDelete={!isStudent ? handleDelete : undefined}
        onViewDetails={handleOpenDetails}
      />

      {/* Add / Edit Faculty Modal (Admin only) */}
      {!isStudent && modalOpen && (
        <Modal
          title={selectedFaculty ? 'Edit Faculty Member' : 'Register New Faculty Member'}
          onClose={handleCloseModal}
        >
          <FacultyForm
            initialValues={selectedFaculty || {}}
            departments={departments}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            submitting={submitting}
          />
        </Modal>
      )}

      {/* Profile Details Modal */}
      {detailsModalOpen && selectedFaculty && (
        <Modal
          title={`Faculty Profile — ${selectedFaculty.user?.name || ''}`}
          onClose={() => setDetailsModalOpen(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: 'var(--primary-light)',
                borderRadius: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                }}
              >
                {(selectedFaculty.user?.name || '').replace(/^Dr\.\s*|^Prof\.\s*/i, '').charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{selectedFaculty.user?.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span className="tag">{selectedFaculty.employeeId}</span>
                  <span className="badge badge-active">{selectedFaculty.designation}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="card" style={{ padding: '0.875rem' }}>
                <span className="stat-label">Department</span>
                <p style={{ fontWeight: '600', marginTop: '0.25rem' }}>{selectedFaculty.department?.name}</p>
              </div>
              <div className="card" style={{ padding: '0.875rem' }}>
                <span className="stat-label">Highest Qualification</span>
                <p style={{ fontWeight: '600', marginTop: '0.25rem' }}>
                  {selectedFaculty.qualification || '—'}
                </p>
              </div>
              <div className="card" style={{ padding: '0.875rem' }}>
                <span className="stat-label">Institutional Email</span>
                <p style={{ fontWeight: '600', marginTop: '0.25rem' }}>{selectedFaculty.user?.email}</p>
              </div>
              <div className="card" style={{ padding: '0.875rem' }}>
                <span className="stat-label">Office / Lab Location</span>
                <p style={{ fontWeight: '600', marginTop: '0.25rem' }}>
                  {selectedFaculty.officeLocation || 'TBA'}
                </p>
              </div>
            </div>

            {selectedFaculty.specialization && (
              <div className="card" style={{ padding: '1rem' }}>
                <span className="stat-label">Research Focus & Specialization</span>
                <p style={{ fontWeight: '500', marginTop: '0.35rem', color: 'var(--text-main)' }}>
                  {selectedFaculty.specialization}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Faculty;
