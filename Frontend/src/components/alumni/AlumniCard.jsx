import { avatarColor } from '../../utils/avatarColor'

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

function AlumniCard({ alumni, onEdit, onDelete, onToggleVerify }) {
  return (
    <div className="alumni-card">
      <div className="alumni-card-top">
        <div className="alumni-avatar" style={{ background: avatarColor(alumni.rollNumber) }}>
          {initials(alumni.fullName)}
        </div>
        <div className="alumni-identity">
          <div className="alumni-name-row">
            <h4 className="alumni-name">{alumni.fullName}</h4>
            {alumni.isVerified && (
              <span className="verified-badge" title="Verified alumni">
                ✓
              </span>
            )}
          </div>
          <div className="alumni-subline">
            {alumni.degree ? `${alumni.degree}, ` : ''}
            {alumni.department?.code} · Class of {alumni.graduationYear}
          </div>
        </div>
      </div>

      {(alumni.designation || alumni.currentCompany) && (
        <div className="alumni-role">
          {alumni.designation}
          {alumni.designation && alumni.currentCompany ? ' at ' : ''}
          {alumni.currentCompany}
        </div>
      )}

      {alumni.currentLocation && <div className="alumni-location">📍 {alumni.currentLocation}</div>}

      {alumni.skills?.length > 0 && (
        <div className="alumni-skills">
          {alumni.skills.map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="alumni-card-footer">
        {alumni.linkedinUrl ? (
          <a href={alumni.linkedinUrl} target="_blank" rel="noreferrer" className="alumni-link">
            LinkedIn ↗
          </a>
        ) : (
          <span />
        )}
        <div className="notice-actions">
          {!alumni.isVerified && (
            <button
              type="button"
              className="btn-icon-sm"
              onClick={() => onToggleVerify(alumni)}
              title="Mark as verified"
            >
              Verify
            </button>
          )}
          <button type="button" className="btn-icon-sm" onClick={() => onEdit(alumni)} title="Edit">
            ✎
          </button>
          <button type="button" className="btn-icon-sm" onClick={() => onDelete(alumni)} title="Delete">
            🗑
          </button>
        </div>
      </div>
    </div>
  )
}

export default AlumniCard
