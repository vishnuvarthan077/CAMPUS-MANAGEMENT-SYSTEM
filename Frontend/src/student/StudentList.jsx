import React from 'react';
import {
  Users,
  Edit2,
  Trash2,
  Mail,
  GraduationCap,
  Calendar,
  Eye
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

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Student Profile</th>
            <th>Roll Number</th>
            <th>Department</th>
            <th>Semester</th>
            <th>Batch</th>
            <th className="actions-col" style={{ textAlign: 'right' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id || student.rollNumber}>
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
                    {getInitials(student.user?.name)}
                  </div>
                  <div>
                    <div className="cell-title">{student.user?.name || '—'}</div>
                    <div
                      className="cell-subtitle"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Mail size={12} />
                      <span>{student.user?.email || '—'}</span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Roll Number */}
              <td>
                <span className="tag">{student.rollNumber}</span>
              </td>

              {/* Department */}
              <td>
                <div style={{ fontWeight: '500' }}>{student.department?.name || '—'}</div>
              </td>

              {/* Semester */}
              <td>
                <span className="badge badge-active">
                  <GraduationCap size={12} />
                  <span>Semester {student.semester}</span>
                </span>
              </td>

              {/* Batch */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Calendar size={13} />
                  <span>{student.batch || '—'}</span>
                </div>
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

