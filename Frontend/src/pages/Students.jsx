import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  GraduationCap,
  Building2,
  AlertCircle,
  Download,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { studentService } from '../student/studentService';
import { authService } from '../services/authService';
import { getDepartments } from '../api/departmentApi';
import StudentSearch from '../student/StudentSearch';
import StudentList from '../student/StudentList';
import StudentForm from '../student/StudentForm';
import Modal from '../components/Modal';

const Students = () => {
  const currentUser = authService.getCurrentUser() || { name: 'Admin User', role: 'admin' };
  const isStudent = currentUser.role === 'student';

  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    department: 'ALL',
    semester: 'ALL',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [myProfile, setMyProfile] = useState(null);
  const [myProfileError, setMyProfileError] = useState('');

  const loadStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await studentService.getStudents(filters);
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isStudent) {
      loadStudents();
    } else {
      setLoading(false);
    }
  }, [filters, isStudent]);

  useEffect(() => {
    getDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isStudent && currentUser.id) {
      studentService
        .getStudentById(currentUser.id)
        .then(setMyProfile)
        .catch((err) => setMyProfileError(err.message || 'No student profile found for this account yet.'));
    }
  }, [isStudent, currentUser.id]);

  /* ==========================================================================
     STUDENT VIEW: READ-ONLY INDIVIDUAL STUDENT PROFILE (NO OTHER STUDENTS VISIBLE)
     ========================================================================== */
  if (isStudent) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', padding: '0.2rem 0.65rem', borderRadius: '9999px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <ShieldCheck size={14} /> Student Confidential Record (View Only)
            </div>
            <h1 className="page-title">My Academic Profile</h1>
            <p className="page-subtitle">Your personal student registration and academic enrollment credentials</p>
          </div>
        </div>

        {myProfileError && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{myProfileError} Contact an administrator to link your account to a student record.</span>
          </div>
        )}

        {!myProfileError && !myProfile && (
          <div className="table-wrapper">
            <div className="empty-state">
              <h3>Loading your profile...</h3>
            </div>
          </div>
        )}

        {myProfile && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.75rem', marginBottom: '1.75rem' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
                }}
              >
                {(myProfile.user?.name || '?').charAt(0)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.625rem', fontWeight: '800' }}>{myProfile.user?.name}</h2>
                  <span className="tag" style={{ fontSize: '0.85rem' }}>{myProfile.rollNumber}</span>
                  <span className="badge badge-active">
                    <CheckCircle2 size={13} /> Enrolled
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Department of {myProfile.department?.name} • Semester {myProfile.semester}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span className="stat-label">Roll Number</span>
                <p style={{ fontSize: '1.125rem', fontWeight: '700', marginTop: '0.25rem' }}>{myProfile.rollNumber}</p>
              </div>

              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span className="stat-label">Batch</span>
                <p style={{ fontSize: '1.125rem', fontWeight: '700', marginTop: '0.25rem' }}>{myProfile.batch || '—'}</p>
              </div>

              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span className="stat-label">Assigned Department</span>
                <p style={{ fontSize: '1.125rem', fontWeight: '700', marginTop: '0.25rem' }}>{myProfile.department?.name}</p>
              </div>

              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span className="stat-label">Current Semester</span>
                <p style={{ fontSize: '1.125rem', fontWeight: '700', marginTop: '0.25rem' }}>Semester {myProfile.semester}</p>
              </div>

              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span className="stat-label">Institutional Email</span>
                <p style={{ fontSize: '0.95rem', fontWeight: '600', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={15} style={{ color: 'var(--text-muted)' }} /> {myProfile.user?.email}
                </p>
              </div>

              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span className="stat-label">Contact Phone</span>
                <p style={{ fontSize: '0.95rem', fontWeight: '600', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={15} style={{ color: 'var(--text-muted)' }} /> {myProfile.user?.phone || '—'}
                </p>
              </div>

              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span className="stat-label">Date of Birth</span>
                <p style={{ fontSize: '0.95rem', fontWeight: '600', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={15} style={{ color: 'var(--text-muted)' }} />{' '}
                  {myProfile.dateOfBirth ? myProfile.dateOfBirth.slice(0, 10) : '—'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ==========================================================================
     ADMIN & FACULTY VIEW: FULL MANAGEMENT DIRECTORY
     ========================================================================== */
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: 'ALL',
      semester: 'ALL',
    });
  };

  const handleOpenAddModal = () => {
    setSelectedStudent(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleOpenDetails = (student) => {
    setSelectedStudent(student);
    setDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (selectedStudent) {
        await studentService.updateStudent(selectedStudent._id, payload);
      } else {
        await studentService.createStudent(payload);
      }
      handleCloseModal();
      await loadStudents();
    } catch (err) {
      setError(err.message || 'Failed to submit student record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to remove student "${student.user?.name}"?`)) {
      try {
        await studentService.deleteStudent(student._id);
        await loadStudents();
      } catch (err) {
        setError(err.message || 'Failed to delete student');
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['Roll Number', 'Name', 'Email', 'Department', 'Semester', 'Batch'];
    const rows = students.map((s) => [
      s.rollNumber,
      `"${s.user?.name || ''}"`,
      s.user?.email || '',
      `"${s.department?.name || ''}"`,
      s.semester,
      s.batch || '',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = studentService.getStats(students);

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Admissions & Directory</h1>
          <p className="page-subtitle">
            Manage student registrations, academic progress, and department distributions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={handleOpenAddModal}>
            <Plus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-primary">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Students</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-success">
            <GraduationCap size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Average Semester</span>
            <span className="stat-value">{stats.avgSemester}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-warning">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Departments Represented</span>
            <span className="stat-value">{stats.departmentsCount}</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <StudentSearch
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        departments={departments}
        totalCount={students.length}
      />

      {/* Error Alert */}
      {error && (
        <div className="alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Student List Table */}
      <StudentList
        students={students}
        loading={loading}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
        onViewDetails={handleOpenDetails}
      />

      {/* Add / Edit Student Modal */}
      {modalOpen && (
        <Modal
          title={selectedStudent ? 'Edit Student Profile' : 'Register New Student'}
          onClose={handleCloseModal}
        >
          <StudentForm
            initialValues={selectedStudent || {}}
            departments={departments}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            submitting={submitting}
          />
        </Modal>
      )}

      {/* View Profile Details Modal */}
      {detailsModalOpen && selectedStudent && (
        <Modal
          title={`Student Profile — ${selectedStudent.user?.name || ''}`}
          onClose={() => setDetailsModalOpen(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: '0.75rem' }}>
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
                  fontWeight: '800'
                }}
              >
                {(selectedStudent.user?.name || '?').charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{selectedStudent.user?.name}</h3>
                <span className="tag" style={{ marginTop: '0.25rem' }}>{selectedStudent.rollNumber}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="card" style={{ padding: '0.875rem' }}>
                <span className="stat-label">Department</span>
                <p style={{ fontWeight: '600', marginTop: '0.25rem' }}>{selectedStudent.department?.name}</p>
              </div>
              <div className="card" style={{ padding: '0.875rem' }}>
                <span className="stat-label">Semester</span>
                <p style={{ fontWeight: '600', marginTop: '0.25rem' }}>Semester {selectedStudent.semester}</p>
              </div>
              <div className="card" style={{ padding: '0.875rem' }}>
                <span className="stat-label">Email Address</span>
                <p style={{ fontWeight: '600', marginTop: '0.25rem' }}>{selectedStudent.user?.email}</p>
              </div>
              <div className="card" style={{ padding: '0.875rem' }}>
                <span className="stat-label">Batch</span>
                <p style={{ fontWeight: '700', marginTop: '0.25rem', color: 'var(--primary)' }}>{selectedStudent.batch || '—'}</p>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setDetailsModalOpen(false);
                  handleOpenEditModal(selectedStudent);
                }}
              >
                Edit Student Details
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Students;
