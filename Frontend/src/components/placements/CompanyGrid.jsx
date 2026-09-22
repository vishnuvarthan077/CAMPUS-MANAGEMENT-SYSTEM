function CompanyGrid({ companies, onEdit, onDelete }) {
  if (companies.length === 0) {
    return <div className="empty-state">No companies found. Add one to get started.</div>
  }

  return (
    <div className="company-grid">
      {companies.map((company) => (
        <div key={company._id} className="company-card">
          <div className="company-avatar">{company.name.charAt(0).toUpperCase()}</div>
          <div className="company-body">
            <h4 className="company-name">{company.name}</h4>
            {company.industry && <div className="company-industry">{company.industry}</div>}
            {company.contactEmail && <div className="company-contact">{company.contactEmail}</div>}
            <div className="company-meta">
              <span className="tag">{company.driveCount || 0} drives</span>
              <span className={`badge ${company.isActive ? 'badge-active' : 'badge-inactive'}`}>
                {company.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="notice-actions">
            <button type="button" className="btn-icon-sm" onClick={() => onEdit(company)} title="Edit">
              ✎
            </button>
            <button type="button" className="btn-icon-sm" onClick={() => onDelete(company)} title="Delete">
              🗑
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CompanyGrid
