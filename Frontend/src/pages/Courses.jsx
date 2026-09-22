import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Layers, 
  Clock,
  X,
  Save,
  ShieldCheck,
  Award
} from 'lucide-react';
import { authService } from '../services/authService';
import Modal from '../components/Modal';

const INITIAL_COURSES = [
  { code: 'CS101', name: 'Introduction to Programming & Problem Solving', credits: 4, department: 'Computer Science', semester: 'Semester 1', instructor: 'Dr. Alan Turing' },
  { code: 'CS204', name: 'Data Structures and Algorithms', credits: 4, department: 'Computer Science', semester: 'Semester 3', instructor: 'Dr. Ada Lovelace' },
  { code: 'CS302', name: 'Database Management Systems & SQL', credits: 4, department: 'Computer Science', semester: 'Semester 5', instructor: 'Dr. Edgar Codd' },
  { code: 'EE201', name: 'Circuit Analysis and Network Theory', credits: 3, department: 'Electrical Eng', semester: 'Semester 2', instructor: 'Prof. Nikola Tesla' },
  { code: 'MA102', name: 'Advanced Engineering Mathematics & Calculus', credits: 4, department: 'Mathematics', semester: 'Semester 2', instructor: 'Dr. John Nash' },
  { code: 'ME305', name: 'Thermodynamics and Heat Transfer', credits: 3, department: 'Mechanical Eng', semester: 'Semester 5', instructor: 'Dr. James Watt' },
];

const Courses = () => {
  const currentUser = authService.getCurrentUser() || { name: 'Admin User', role: 'admin' };
  const isStudent = currentUser.role === 'student';

  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: 3,
    department: 'Computer Science',
    semester: 'Semester 1',
    instructor: ''
  });

  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setFormData({
      code: '',
      name: '',
      credits: 3,
      department: currentUser.department || 'Computer Science',
      semester: 'Semester 1',
      instructor: ''
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingCourse(course);
    setFormData({ ...course });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCourse(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      alert('Please fill in course code and title');
      return;
    }

    if (editingCourse) {
      setCourses(prev => prev.map(c => c.code === editingCourse.code ? { ...formData } : c));
    } else {
      setCourses(prev => [formData, ...prev]);
    }
    handleCloseModal();
  };

  const handleDeleteCourse = (course) => {
    if (window.confirm(`Are you sure you want to delete course "${course.name}"?`)) {
      setCourses(prev => prev.filter(c => c.code !== course.code));
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase()) ||
      (course.instructor && course.instructor.toLowerCase().includes(search.toLowerCase()));
    const matchesDept = departmentFilter === 'ALL' || course.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          {isStudent && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', padding: '0.2rem 0.65rem', borderRadius: '9999px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <ShieldCheck size={14} /> Course Catalog (View Only)
            </div>
          )}
          <h1 className="page-title">{isStudent ? 'Curriculum & Course Catalog' : 'Course Curriculum Management'}</h1>
          <p className="page-subtitle">
            {isStudent 
              ? 'Explore courses offered in your academic department, syllabus credits, and instructors' 
              : 'Manage degree courses, credit systems, and department assignments'}
          </p>
        </div>

        {/* Hide Add Course button for students */}
        {!isStudent && (
          <button type="button" className="btn btn-primary" onClick={handleOpenAddModal}>
            <Plus size={18} />
            <span>Add Course</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-primary">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Available Courses</span>
            <span className="stat-value">{courses.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-success">
            <Layers size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Credit Hours</span>
            <span className="stat-value">
              {courses.reduce((acc, curr) => acc + Number(curr.credits || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div className="toolbar">
          <div className="toolbar-search">
            <Search className="toolbar-search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search course title, code, or instructor..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="toolbar-filters">
            <select 
              className="filter-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Eng">Electrical Eng</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Mechanical Eng">Mechanical Eng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Credits</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Lead Instructor</th>
              {!isStudent && <th className="actions-col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course.code}>
                  <td>
                    <span className="tag">{course.code}</span>
                  </td>
                  <td>
                    <div className="cell-title">{course.name}</div>
                  </td>
                  <td>
                    <strong>{course.credits} Credits</strong>
                  </td>
                  <td>{course.department}</td>
                  <td>
                    <span className="badge badge-active">{course.semester}</span>
                  </td>
                  <td>{course.instructor || 'Unassigned'}</td>

                  {/* Actions Column ONLY for Admin & Faculty */}
                  {!isStudent && (
                    <td className="actions-col">
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline" 
                        onClick={() => handleOpenEditModal(course)}
                        title="Edit Course"
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDeleteCourse(course)}
                        title="Delete Course"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isStudent ? 6 : 7}>
                  <div className="empty-state">
                    <h3>No courses found</h3>
                    <p>No courses match your filter criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal only for Admin/Faculty */}
      {!isStudent && modalOpen && (
        <Modal 
          title={editingCourse ? 'Edit Course Details' : 'Register New Course'} 
          onClose={handleCloseModal}
        >
          <form onSubmit={handleFormSubmit} className="form">
            <div className="form-grid">
              <div className="form-group">
                <label><span>Course Code *</span></label>
                <input 
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. CS101"
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>

              <div className="form-group">
                <label><span>Credit Hours</span></label>
                <input 
                  type="number"
                  min="1"
                  max="6"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label><span>Course Title *</span></label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Object Oriented Programming"
                  required
                />
              </div>

              <div className="form-group">
                <label><span>Department</span></label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Eng">Electrical Eng</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Mechanical Eng">Mechanical Eng</option>
                </select>
              </div>

              <div className="form-group">
                <label><span>Semester</span></label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                >
                  {Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label><span>Assigned Lead Instructor</span></label>
                <input 
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  placeholder="e.g. Dr. Alan Turing"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                <X size={16} /> Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> {editingCourse ? 'Save Changes' : 'Create Course'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Courses;
