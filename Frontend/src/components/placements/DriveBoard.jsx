import DriveCard from './DriveCard'

const COLUMNS = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled']

function DriveBoard({ drives, onEdit, onDelete, onAddPlacement }) {
  if (drives.length === 0) {
    return <div className="empty-state">No drives found. Schedule one to get started.</div>
  }

  return (
    <div className="drive-board">
      {COLUMNS.map((column) => {
        const columnDrives = drives.filter((drive) => drive.status === column)
        return (
          <div key={column} className="drive-column">
            <div className="drive-column-header">
              <span>{column}</span>
              <span className="drive-column-count">{columnDrives.length}</span>
            </div>
            <div className="drive-column-body">
              {columnDrives.length === 0 ? (
                <div className="drive-column-empty">No drives</div>
              ) : (
                columnDrives.map((drive) => (
                  <DriveCard
                    key={drive._id}
                    drive={drive}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddPlacement={onAddPlacement}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DriveBoard
