import React, { useEffect, useState, useMemo } from 'react';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../api/departmentApi';
import { authService } from '../services/authService';
import DepartmentList from '../components/departments/DepartmentList';
import DepartmentForm from '../components/departments/DepartmentForm';
import Modal from '../components/Modal';
import { 
  Building2, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Users, 
  AlertCircle,
  RotateCcw,
  BookOpen,
  Calendar,
  GraduationCap,
  ShieldCheck,
  Award
} from 'lucide-react';

const INITIAL_MOCK_DEPARTMENTS = [
  {
    _id: 'dept-1',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    description: 'Focuses on computing algorithms, software systems, and AI technologies.',
    headOfDepartment: 'Dr. Alan Turing',
    establishedYear: 1995,
    isActive: true,
  },
  {
    _id: 'dept-2',
    name: 'Electrical & Electronics Engineering',
    code: 'EEE',
    description: 'Core studies in electronics, power grids, robotics, and circuit design.',
    headOfDepartment: 'Dr. Nikola Tesla',
    establishedYear: 1998,
    isActive: true,
  },
  {
    _id: 'dept-3',
    name: 'Mechanical Engineering',
    code: 'MECH',
    description: 'Thermo-fluids, manufacturing, mechanics, and automotive systems.',
    headOfDepartment: 'Dr. James Watt',
    establishedYear: 2002,
    isActive: true,
  },
  {
    _id: 'dept-4',
    name: 'Civil & Environmental Engineering',
    code: 'CIVIL',
    description: 'Structural engineering, geotechnics, and urban environment solutions.',
    headOfDepartment: 'Dr. Arthur Casagrande',
    establishedYear: 2005,
    isActive: false,
  },
  {
    _id: 'dept-5',
    name: 'Mathematics',
    code: 'MATH',
    description: 'Pure and applied mathematics, numerical analysis, statistics, and discrete models.',
    headOfDepartment: 'Dr. John Nash',
    establishedYear: 1990,
    isActive: true,
  },
  {
    _id: 'dept-6',
    name: 'Physics',
    code: 'PHYS',
    description: 'Applied physics, electromagnetics, quantum mechanics, and experimental labs.',
    headOfDepartment: 'Dr. Marie Curie',
    establishedYear: 1992,
    isActive: true,
  },
];

function DepartmentsPage() {
  const currentUser = authService.getCurrentUser() || { name: 'Admin User', role: 'admin' };
  const isStudent = currentUser.role === 'student';

  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [usingMock, setUsingMock] = useState(false);

  const loadDepartments = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const res = await getDepartments(params);
      if (res && res.data) {
        setDepartments(res.data);
        setUsingMock(false);
      } else {
        throw new Error('No data received from API');
      }
    } catch {
      setUsingMock(true);
      if (departments.length === 0) {
        setDepartments(INITIAL_MOCK_DEPARTMENTS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  /* ==========================================================================
     STUDENT VIEW: ONLY THE PARTICULAR STUDENT'S DEPARTMENT (VIEW-ONLY)
     ========================================================================== */
  if (isStudent) {
    const studentDeptName = currentUser.department || 'Computer Science';
    
    // Find matching department record
    const myDept = departments.find(
      (d) =>
        d.name.toLowerCase().includes(studentDeptName.toLowerCase()) ||
        studentDeptName.toLowerCase().includes(d.name.toLowerCase()) ||
        (d.code && studentDeptName.toLowerCase().includes(d.code.toLowerCase()))
    ) || {
      name: studentDeptName,
      code: 'CSE',
      description: 'Undergraduate and postgraduate curriculum specialized in foundational and advanced computational engineering.',
      headOfDepartment: 'Dr. Alan Turing',
      establishedYear: 1995,
      isActive: true,
    };

    return (
      <div className="page">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', padding: '0.2rem 0.65rem', borderRadius: '9999px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <ShieldCheck size={14} /> My Department Profile (View Only)
            </div>
            <h1 className="page-title">Department of {myDept.name}</h1>
            <p className="page-subtitle">Academic leadership, faculty coordinators, and departmental curriculum</p>
          </div>
        </div>

        {/* Department Overview Banner */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div 
              style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '1rem', 
                background: 'var(--primary-gradient)', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
              }}
            >
              <Building2 size={32} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{myDept.name}</h2>
                <span className="tag" style={{ fontSize: '0.85rem' }}>{myDept.code}</span>
                <span className="badge badge-active">Active Curriculum</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                {myDept.description || 'Center of excellence in engineering, curriculum standards, and student research.'}
              </p>
            </div>
          </div>

          {/* Department Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
              <span className="stat-label">Head of Department (HOD)</span>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={18} style={{ color: 'var(--primary)' }} /> {myDept.headOfDepartment || 'Dr. Alan Turing'}
              </p>
            </div>

            <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
              <span className="stat-label">Department Code</span>
              <p style={{ fontSize: '1.1rem', fontWeight: '800', marginTop: '0.25rem', color: 'var(--primary)' }}>
                {myDept.code}
              </p>
            </div>

            <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
              <span className="stat-label">Established Year</span>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={18} style={{ color: 'var(--text-muted)' }} /> {myDept.establishedYear || '1995'}
              </p>
            </div>

            <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
              <span className="stat-label">My Enrollment Status</span>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.25rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={18} /> Active Scholar ({currentUser.year || '3rd Year'})
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     ADMIN & FACULTY VIEW: FULL DEPARTMENT MANAGEMENT
     ========================================================================== */
  const openCreateModal = () => {
    setEditingDept(null);
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingDept(null);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (!usingMock) {
        if (editingDept) {
          await updateDepartment(editingDept._id, payload);
        } else {
          await createDepartment(payload);
        }
        await loadDepartments();
      } else {
        if (editingDept) {
          setDepartments((prev) =>
            prev.map((d) => (d._id === editingDept._id ? { ...d, ...payload } : d))
          );
        } else {
          const newDept = {
            ...payload,
            _id: `dept-${Date.now()}`,
          };
          setDepartments((prev) => [newDept, ...prev]);
        }
      }
      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to submit department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dept) => {
    if (!window.confirm(`Are you sure you want to delete "${dept.name}"?`)) return;
    try {
      if (!usingMock) {
        await deleteDepartment(dept._id);
        await loadDepartments();
      } else {
        setDepartments((prev) => prev.filter((d) => d._id !== dept._id));
      }
    } catch (err) {
      setError(err.message || 'Failed to delete department');
    }
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const matchesSearch =
        dept.name.toLowerCase().includes(search.toLowerCase()) ||
        dept.code.toLowerCase().includes(search.toLowerCase()) ||
        (dept.headOfDepartment && dept.headOfDepartment.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && dept.isActive) ||
        (statusFilter === 'INACTIVE' && !dept.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [departments, search, statusFilter]);

  const totalCount = departments.length;
  const activeCount = departments.filter((d) => d.isActive).length;
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">
            Manage academic departments, faculty leadership, and curriculum standards
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          <span>Add Department</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-primary">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Departments</span>
            <span className="stat-value">{totalCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-success">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Enrolling</span>
            <span className="stat-value">{activeCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-warning">
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Inactive</span>
            <span className="stat-value">{inactiveCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-info">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Leadership Heads</span>
            <span className="stat-value">
              {departments.filter((d) => d.headOfDepartment).length}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div className="toolbar">
          <div className="toolbar-search">
            <Search className="toolbar-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by department name, code, or HOD..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="toolbar-filters">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses ({totalCount})</option>
              <option value="ACTIVE">Active Only ({activeCount})</option>
              <option value="INACTIVE">Inactive Only ({inactiveCount})</option>
            </select>

            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => { setSearch(''); setStatusFilter('ALL'); }}
              title="Reset Filters"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Departments Table */}
      {loading ? (
        <div className="table-wrapper">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Building2 size={32} />
            </div>
            <h3>Loading departments...</h3>
            <p>Please wait while we fetch the latest department records.</p>
          </div>
        </div>
      ) : (
        <DepartmentList
          departments={filteredDepartments}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <Modal
          title={editingDept ? 'Edit Academic Department' : 'Create New Department'}
          onClose={closeModal}
        >
          <DepartmentForm
            initialValues={editingDept || {}}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  );
}

export default DepartmentsPage;
