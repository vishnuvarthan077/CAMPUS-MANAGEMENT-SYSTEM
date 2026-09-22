const MEDALS = ['🥇', '🥈', '🥉']

function PlacementLeaderboard({ placements, onEdit, onDelete }) {
  if (placements.length === 0) {
    return <div className="empty-state">No placement records found yet.</div>
  }

  return (
    <table className="data-table leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Student</th>
          <th>Roll No.</th>
          <th>Department</th>
          <th>Company</th>
          <th>Role</th>
          <th>Package</th>
          <th>Status</th>
          <th className="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {placements.map((p, index) => (
          <tr key={p._id} className={index < 3 ? 'leaderboard-top' : ''}>
            <td>
              <span className="rank-cell">{MEDALS[index] || `#${index + 1}`}</span>
            </td>
            <td className="cell-title">{p.studentName}</td>
            <td>
              <span className="tag">{p.rollNumber}</span>
            </td>
            <td>{p.department?.name || '—'}</td>
            <td>{p.drive?.company?.name || '—'}</td>
            <td>{p.drive?.role || '—'}</td>
            <td className="package-cell">{p.ctcOffered} LPA</td>
            <td>
              <span className={`badge status-${p.status.toLowerCase()}`}>{p.status}</span>
            </td>
            <td className="actions-col">
              <button type="button" className="btn btn-sm" onClick={() => onEdit(p)}>
                Edit
              </button>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => onDelete(p)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default PlacementLeaderboard
