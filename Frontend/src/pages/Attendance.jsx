import React, { useState } from 'react';
import { 
  CheckSquare, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Save, 
  Users,
  Check,
  ShieldCheck,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { authService } from '../services/authService';
import Modal from '../components/Modal';

const INITIAL_ATTENDANCE_STUDENTS = [
  { id: 'STU-1001', name: 'Alex Johnson', roll: '01', status: 'Present' },
  { id: 'STU-1002', name: 'Sophia Martinez', roll: '02', status: 'Present' },
  { id: 'STU-1003', name: 'Michael Chang', roll: '03', status: 'Absent' },
  { id: 'STU-1004', name: 'Emily Davis', roll: '04', status: 'Present' },
  { id: 'STU-1005', name: 'David Wilson', roll: '05', status: 'Late' },
];

const Attendance = () => {
  const currentUser = authService.getCurrentUser() || { name: 'Admin User', role: 'admin' };
  const isStudent = currentUser.role === 'student';

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('CS101');
  const [studentList, setStudentList] = useState(INITIAL_ATTENDANCE_STUDENTS);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  /* ==========================================================================
     STUDENT VIEW: INDIVIDUAL ATTENDANCE TRANSCRIPT (VIEW-ONLY)
     ========================================================================== */
  if (isStudent) {
    const studentSubjects = [
      { code: 'CS101', name: 'Introduction to Programming', total: 30, attended: 29, percentage: 96.6, status: 'Regular' },
      { code: 'CS204', name: 'Data Structures and Algorithms', total: 28, attended: 27, percentage: 96.4, status: 'Regular' },
      { code: 'CS302', name: 'Database Management Systems', total: 24, attended: 23, percentage: 95.8, status: 'Regular' },
      { code: 'EE201', name: 'Circuit Analysis and Theory', total: 26, attended: 24, percentage: 92.3, status: 'Regular' },
      { code: 'MA102', name: 'Calculus & Differential Equations', total: 32, attended: 32, percentage: 100.0, status: 'Perfect' },
    ];

    const recentLogs = [
      { date: 'Today (2026-09-22)', course: 'CS101', time: '09:00 AM', status: 'Present' },
      { date: 'Today (2026-09-22)', course: 'CS204', time: '11:00 AM', status: 'Present' },
      { date: 'Yesterday (2026-09-21)', course: 'EE201', time: '02:00 PM', status: 'Present' },
      { date: '2026-09-18', course: 'MA102', time: '10:00 AM', status: 'Present' },
      { date: '2026-09-15', course: 'CS302', time: '01:30 PM', status: 'Late' },
    ];

    const totalLectures = studentSubjects.reduce((a, b) => a + b.total, 0);
    const totalAttended = studentSubjects.reduce((a, b) => a + b.attended, 0);
    const overallRate = ((totalAttended / totalLectures) * 100).toFixed(1);

    return (
      <div className="page">
        {/* Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', padding: '0.2rem 0.65rem', borderRadius: '9999px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <ShieldCheck size={14} /> Student Attendance Transcript (View Only)
            </div>
            <h1 className="page-title">My Attendance Record</h1>
            <p className="page-subtitle">Track your subject-wise classroom turnout and minimum eligibility requirements</p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => alert('Attendance Certificate downloaded!')}>
            <FileText size={18} />
            <span>Download Certificate</span>
          </button>
        </div>

        {/* Attendance Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-success">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Overall Turnout</span>
              <span className="stat-value">{overallRate}%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-primary">
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Attended Classes</span>
              <span className="stat-value">{totalAttended} / {totalLectures}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper stat-icon-warning">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Eligible for Exams</span>
              <span className="stat-value" style={{ color: 'var(--success)' }}>Yes (Above 75%)</span>
            </div>
          </div>
        </div>

        {/* Subject-Wise Attendance Breakdown */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Course Name</th>
                <th>Classes Conducted</th>
                <th>Classes Attended</th>
                <th>Attendance %</th>
                <th>Eligibility Status</th>
              </tr>
            </thead>
            <tbody>
              {studentSubjects.map((sub) => (
                <tr key={sub.code}>
                  <td>
                    <span className="tag">{sub.code}</span>
                  </td>
                  <td>
                    <div className="cell-title">{sub.name}</div>
                  </td>
                  <td>{sub.total} Sessions</td>
                  <td>{sub.attended} Sessions</td>
                  <td>
                    <strong style={{ color: sub.percentage >= 90 ? 'var(--success)' : 'var(--primary)' }}>
                      {sub.percentage}%
                    </strong>
                  </td>
                  <td>
                    <span className="badge badge-active">
                      <CheckCircle2 size={12} /> Eligible
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Day-by-Day Log */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Attendance Verification Logs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentLogs.map((log, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <div>
                  <strong style={{ fontSize: '0.875rem' }}>{log.course}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.date} • {log.time}</div>
                </div>
                <span className={`badge ${log.status === 'Present' ? 'badge-active' : 'badge-inactive'}`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     ADMIN & FACULTY VIEW: INTERACTIVE ATTENDANCE REGISTER
     ========================================================================== */
  const toggleStatus = (id, newStatus) => {
    setStudentList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    setSavedSuccess(false);
  };

  const markAll = (status) => {
    setStudentList(prev => prev.map(s => ({ ...s, status })));
    setSavedSuccess(false);
  };

  const handleSaveAttendance = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  const total = studentList.length;
  const presentCount = studentList.filter(s => s.status === 'Present').length;
  const absentCount = studentList.filter(s => s.status === 'Absent').length;
  const lateCount = studentList.filter(s => s.status === 'Late').length;
  const attendanceRate = Math.round(((presentCount + lateCount * 0.5) / total) * 100);

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Classroom Attendance Register</h1>
          <p className="page-subtitle">Record and audit classroom attendance logs and student presence</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setReportModalOpen(true)}
          >
            <FileText size={18} />
            <span>Attendance Summary</span>
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleSaveAttendance}
          >
            <Save size={18} />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="badge badge-active" style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem', width: 'fit-content' }}>
          <CheckCircle2 size={18} /> Attendance records saved successfully for {selectedDate} ({selectedCourse})!
        </div>
      )}

      {/* Stats row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-success">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Present</span>
            <span className="stat-value">{presentCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-warning">
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Absent</span>
            <span className="stat-value">{absentCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-info">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Late Arrival</span>
            <span className="stat-value">{lateCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-primary">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Turnout Rate</span>
            <span className="stat-value">{attendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div className="toolbar" style={{ margin: 0 }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date</label>
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: 'auto', marginTop: '0.25rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Course Module</label>
              <select
                className="filter-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={{ marginTop: '0.25rem' }}
              >
                <option value="CS101">CS101 - Intro to Programming</option>
                <option value="CS204">CS204 - Data Structures</option>
                <option value="EE201">EE201 - Circuit Analysis</option>
                <option value="MA102">MA102 - Calculus II</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              type="button" 
              className="btn btn-sm btn-outline" 
              onClick={() => markAll('Present')}
            >
              <Check size={14} /> Mark All Present
            </button>
            <button 
              type="button" 
              className="btn btn-sm btn-outline-danger" 
              onClick={() => markAll('Absent')}
            >
              <XCircle size={14} /> Mark All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Attendance List Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Roll #</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Status</th>
              <th className="actions-col" style={{ textAlign: 'center' }}>Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((student) => (
              <tr key={student.id}>
                <td>
                  <strong>#{student.roll}</strong>
                </td>
                <td>
                  <div className="cell-title">{student.name}</div>
                </td>
                <td>
                  <span className="tag">{student.id}</span>
                </td>
                <td>
                  <span 
                    className={`badge ${
                      student.status === 'Present' 
                        ? 'badge-active' 
                        : student.status === 'Late' 
                        ? 'badge-inactive' 
                        : 'badge-inactive'
                    }`}
                    style={student.status === 'Absent' ? { color: 'var(--danger)', backgroundColor: 'var(--danger-light)' } : {}}
                  >
                    <span className="badge-dot" />
                    {student.status}
                  </span>
                </td>
                <td className="actions-col" style={{ justifyContent: 'center' }}>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${student.status === 'Present' ? 'btn-success' : 'btn-outline'}`}
                    onClick={() => toggleStatus(student.id, 'Present')}
                  >
                    Present
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${student.status === 'Late' ? 'btn-secondary' : 'btn-outline'}`}
                    onClick={() => toggleStatus(student.id, 'Late')}
                  >
                    Late
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${student.status === 'Absent' ? 'btn-danger' : 'btn-outline'}`}
                    onClick={() => toggleStatus(student.id, 'Absent')}
                  >
                    Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <Modal title="Attendance Summary Report" onClose={() => setReportModalOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              Summary report generated for <strong>{selectedCourse}</strong> on <strong>{selectedDate}</strong>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="card" style={{ padding: '1rem' }}>
                <span className="stat-label">Total Registered</span>
                <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{total}</p>
              </div>
              <div className="card" style={{ padding: '1rem' }}>
                <span className="stat-label">Turnout Efficiency</span>
                <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{attendanceRate}%</p>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  alert('Report successfully downloaded to CSV / PDF format!');
                  setReportModalOpen(false);
                }}
              >
                Download Export (CSV)
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Attendance;
