import React from 'react';
import { 
  Users, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';

const StudentList = ({ students, onEdit, onDelete, onViewDetails, loading }) => {
  if (loading) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Users size={32} />
          </div>
          <h3>Loading student records...</h3>
          <p>Please wait while we retrieve the latest student directory.</p>
        </div>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Users size={32} />
          </div>
          <h3>No Student Records Found</h3>
          <p>No students match your search criteria or no records have been added yet.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getGpaColor = (gpa) => {
    const num = Number(gpa);
    if (num >= 3.8) return 'var(--success)';
    if (num >= 3.5) return 'var(--primary)';
    if (num >= 3.0) return 'var(--info)';
    return 'var(--warning)';
  };

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Student Profile</th>
            <th>Student ID</th>
            <th>Department</th>
            <th>Year & Semester</th>
            <th>CGPA</th>
            <th>Status</th>
            <th className="actions-col" style={{ textAlign: 'right' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id || student.studentId}>
              {/* Student Profile Info */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--primary-gradient)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.875rem',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
                    }}
                  >
                    {getInitials(student.name)}
                  </div>
                  <div>
                    <div className="cell-title">{student.name}</div>
                    <div
                      className="cell-subtitle"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Mail size={12} />
                      <span>{student.email}</span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Student ID */}
              <td>
                <span className="tag">{student.studentId}</span>
              </td>

              {/* Department */}
              <td>
                <div style={{ fontWeight: '500' }}>{student.department}</div>
              </td>

              {/* Year & Semester */}
              <td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{student.year}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {student.semester || 'Semester 1'}
                  </span>
                </div>
              </td>

              {/* CGPA */}
              <td>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontWeight: '800',
                    color: getGpaColor(student.gpa),
                    fontSize: '0.95rem',
                  }}
                >
                  <GraduationCap size={14} />
                  <span>{Number(student.gpa).toFixed(2)}</span>
                </div>
              </td>

              {/* Status */}
              <td>
                <span
                  className={`badge ${
                    student.status === 'Enrolled' ? 'badge-active' : 'badge-inactive'
                  }`}
                >
                  <span className="badge-dot" />
                  {student.status || 'Enrolled'}
                </span>
              </td>

              {/* Action Buttons */}
              <td className="actions-col">
                {onViewDetails && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => onViewDetails(student)}
                    title="View Profile Details"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => onEdit(student)}
                  title="Edit Student"
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(student)}
                  title="Delete Student"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;

