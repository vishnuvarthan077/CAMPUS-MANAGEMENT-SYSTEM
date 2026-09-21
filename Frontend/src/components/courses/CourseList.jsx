function CourseList({ courses, onEdit, onDelete }) {
  if (courses.length === 0) {
    return <div className="empty-state">No courses found. Add one to get started.</div>
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Department</th>
          <th>Semester</th>
          <th>Credits</th>
          <th>Type</th>
          <th>Seats</th>
          <th>Status</th>
          <th className="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course._id}>
            <td>
              <div className="cell-title">{course.name}</div>
            </td>
            <td>
              <span className="tag">{course.code}</span>
            </td>
            <td>{course.department?.name || '—'}</td>
            <td>{course.semester}</td>
            <td>{course.credits}</td>
            <td>
              <span className="badge badge-type">{course.courseType}</span>
            </td>
            <td>{course.seatsAvailable}</td>
            <td>
              <span className={`badge ${course.isActive ? 'badge-active' : 'badge-inactive'}`}>
                {course.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="actions-col">
              <button type="button" className="btn btn-sm" onClick={() => onEdit(course)}>
                Edit
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(course)}
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

export default CourseList
