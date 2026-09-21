function DepartmentList({ departments, onEdit, onDelete }) {
  if (departments.length === 0) {
    return <div className="empty-state">No departments found. Add one to get started.</div>
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Head of Department</th>
          <th>Established</th>
          <th>Status</th>
          <th className="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {departments.map((dept) => (
          <tr key={dept._id}>
            <td>
              <div className="cell-title">{dept.name}</div>
              {dept.description && <div className="cell-subtitle">{dept.description}</div>}
            </td>
            <td>
              <span className="tag">{dept.code}</span>
            </td>
            <td>{dept.headOfDepartment || '—'}</td>
            <td>{dept.establishedYear || '—'}</td>
            <td>
              <span className={`badge ${dept.isActive ? 'badge-active' : 'badge-inactive'}`}>
                {dept.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="actions-col">
              <button type="button" className="btn btn-sm" onClick={() => onEdit(dept)}>
                Edit
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(dept)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DepartmentList
