import React from 'react';
import { Edit2, Trash2, Building2, UserCheck, Calendar, CheckCircle2, XCircle } from 'lucide-react';

function DepartmentList({ departments, onEdit, onDelete }) {
  if (!departments || departments.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Building2 size={32} />
          </div>
          <h3>No Departments Found</h3>
          <p>There are no departments matching your search or filters.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return '—';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Code</th>
            <th>Head of Dept</th>
            <th>Established</th>
            <th>Status</th>
            <th className="actions-col" style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept._id || dept.code}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div 
                    style={{ 
                      width: '38px', 
                      height: '38px', 
                      borderRadius: '0.5rem', 
                      background: 'var(--primary-light)', 
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.875rem',
                      flexShrink: 0
                    }}
                  >
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="cell-title">{dept.name}</div>
                    {dept.description && <div className="cell-subtitle">{dept.description}</div>}
                  </div>
                </div>
              </td>
              <td>
                <span className="tag">{dept.code}</span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {dept.headOfDepartment ? (
                    <>
                      <div 
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: 'rgba(79, 70, 229, 0.1)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: '700'
                        }}
                      >
                        {getInitials(dept.headOfDepartment)}
                      </div>
                      <span>{dept.headOfDepartment}</span>
                    </>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Not Assigned</span>
                  )}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                  <Calendar size={14} />
                  <span>{dept.establishedYear || '—'}</span>
                </div>
              </td>
              <td>
                <span className={`badge ${dept.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  <span className="badge-dot" />
                  {dept.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="actions-col">
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline" 
                  onClick={() => onEdit(dept)}
                  title="Edit Department"
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(dept)}
                  title="Delete Department"
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
}

export default DepartmentList;
