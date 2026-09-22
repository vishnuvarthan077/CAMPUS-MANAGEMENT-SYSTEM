import { formatRelativeTime } from '../../utils/formatRelativeTime'

const CATEGORY_CLASS = {
  General: 'note-general',
  Academic: 'note-academic',
  Exam: 'note-exam',
  Event: 'note-event',
  Holiday: 'note-holiday',
  Urgent: 'note-urgent',
}

function NoticeCard({ notice, tilt, onEdit, onDelete, onTogglePin }) {
  const categoryClass = CATEGORY_CLASS[notice.category] || 'note-general'

  return (
    <article
      className={`notice-note ${categoryClass} ${notice.isPinned ? 'notice-pinned' : ''}`}
      style={{ '--tilt': `${tilt}deg` }}
    >
      <button
        type="button"
        className="pin-marker"
        onClick={() => onTogglePin(notice)}
        title={notice.isPinned ? 'Unpin notice' : 'Pin notice'}
        aria-label={notice.isPinned ? 'Unpin notice' : 'Pin notice'}
      >
        📌
      </button>

      <div className="notice-note-header">
        <span className="notice-category">{notice.category}</span>
        {notice.priority === 'High' && <span className="notice-priority-high">High priority</span>}
      </div>

      <h3 className="notice-title">{notice.title}</h3>
      <p className="notice-content">{notice.content}</p>

      {notice.isExpired && <span className="notice-expired-flag">Expired</span>}

      <div className="notice-note-footer">
        <div className="notice-meta">
          <span className="notice-author">{notice.postedBy}</span>
          <span className="notice-dot">•</span>
          <span>{formatRelativeTime(notice.createdAt)}</span>
          {notice.department && (
            <>
              <span className="notice-dot">•</span>
              <span>{notice.department.name}</span>
            </>
          )}
        </div>
        <div className="notice-actions">
          <button type="button" className="btn-icon-sm" onClick={() => onEdit(notice)} title="Edit">
            ✎
          </button>
          <button
            type="button"
            className="btn-icon-sm"
            onClick={() => onDelete(notice)}
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>
    </article>
  )
}

export default NoticeCard
