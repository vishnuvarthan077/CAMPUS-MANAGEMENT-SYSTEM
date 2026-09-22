import React from 'react';
import { 
  UserSquare2, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  Award, 
  MapPin, 
  Eye,
  GraduationCap
} from 'lucide-react';

const FacultyList = ({ faculty, onEdit, onDelete, onViewDetails, loading }) => {
  if (loading) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">
          <div className="empty-state-icon">
            <UserSquare2 size={32} />
          </div>
          <h3>Loading faculty directory...</h3>
          <p>Please wait while we retrieve the latest faculty profiles.</p>
        </div>
      </div>
    );
  }

  if (!faculty || faculty.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">
          <div className="empty-state-icon">
            <UserSquare2 size={32} />
          </div>
          <h3>No Faculty Profiles Found</h3>
          <p>No faculty members match your filter criteria.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'F';
    return name
      .replace(/^Dr\.\s*|^Prof\.\s*/i, '')
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
            <th>Faculty Member</th>
            <th>Faculty ID</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Research Specialization</th>
            <th>Office / Room</th>
            <th className="actions-col" style={{ textAlign: 'right' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {faculty.map((member) => (
            <tr key={member._id || member.facultyId}>
              {/* Faculty Name & Email */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '0.75rem',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.875rem',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(79, 70, 229, 0.15)',
                    }}
                  >
                    {getInitials(member.name)}
                  </div>
                  <div>
                    <div className="cell-title">{member.name}</div>
                    <div
                      className="cell-subtitle"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Mail size={12} />
                      <span>{member.email}</span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Faculty ID */}
              <td>
                <span className="tag">{member.facultyId}</span>
              </td>

              {/* Department */}
              <td>
                <div style={{ fontWeight: '500' }}>{member.department}</div>
              </td>

              {/* Designation Badge */}
              <td>
                <span className="badge badge-active">
                  <Award size={12} />
                  <span>{member.designation}</span>
                </span>
              </td>

              {/* Specialization */}
              <td>
                <div style={{ maxWidth: '240px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {member.specialization || 'General Studies & Research'}
                </div>
              </td>

              {/* Office Room */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <MapPin size={13} />
                  <span>{member.officeRoom || 'TBA'}</span>
                </div>
              </td>

              {/* Action Buttons */}
              <td className="actions-col">
                {onViewDetails && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => onViewDetails(member)}
                    title="View Profile Details"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => onEdit(member)}
                  title="Edit Faculty"
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(member)}
                  title="Delete Faculty"
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

export default FacultyList;

