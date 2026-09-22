function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function DriveCard({ drive, onEdit, onDelete, onAddPlacement }) {
  return (
    <div className="drive-card">
      <div className="drive-card-top">
        <span className="drive-company">{drive.company?.name}</span>
        <span className="drive-ctc">{drive.ctc} LPA</span>
      </div>

      <h4 className="drive-role">{drive.role}</h4>

      <div className="drive-tags">
        <span className="drive-tag">{drive.driveType}</span>
        {drive.minCgpa > 0 && <span className="drive-tag">CGPA ≥ {drive.minCgpa}</span>}
        <span className="drive-tag">{formatDate(drive.driveDate)}</span>
      </div>

      {drive.allowedDepartments?.length > 0 && (
        <div className="drive-depts">
          {drive.allowedDepartments.map((dept) => (
            <span key={dept._id} className="tag">
              {dept.code}
            </span>
          ))}
        </div>
      )}

      <div className="drive-card-footer">
        <span className="drive-placed-count">{drive.placementCount || 0} placed</span>
        <div className="notice-actions">
          <button type="button" className="btn-icon-sm" onClick={() => onAddPlacement(drive)} title="Add placement">
            + Place
          </button>
          <button type="button" className="btn-icon-sm" onClick={() => onEdit(drive)} title="Edit">
            ✎
          </button>
          <button type="button" className="btn-icon-sm" onClick={() => onDelete(drive)} title="Delete">
            🗑
          </button>
        </div>
      </div>
    </div>
  )
}

export default DriveCard
