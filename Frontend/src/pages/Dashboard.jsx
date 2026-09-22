import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserSquare2, 
  BookOpen, 
  Building2, 
  CheckSquare, 
  ArrowUpRight, 
  TrendingUp, 
  Plus, 
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Award
} from 'lucide-react';
import { authService } from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser() || { name: 'Admin User', role: 'admin' };

  /* ==========================================================================
     1. STUDENT DASHBOARD VIEW
     ========================================================================== */
  if (currentUser.role === 'student') {
    const studentStats = [
      { title: 'Enrolled Courses', value: '5 Courses', change: 'Semester 5', icon: <BookOpen size={24} />, path: '/courses', type: 'primary' },
      { title: 'Attendance Rate', value: '96.2%', change: '24 of 25 Present', icon: <CheckSquare size={24} />, path: '/attendance', type: 'success' },
      { title: 'Cumulative GPA', value: '3.85 / 4.0', change: 'Top 5% in Dept', icon: <GraduationCap size={24} />, path: '/courses', type: 'info' },
      { title: 'Department', value: 'Computer Science', change: 'Prof. Alan Turing (HOD)', icon: <Building2 size={24} />, path: '/faculty', type: 'warning' },
    ];

    const todaySchedule = [
      { time: '09:00 AM - 10:30 AM', course: 'CS101 - Intro to Programming', room: 'Hall B-201', instructor: 'Dr. Alan Turing', status: 'Completed' },
      { time: '11:00 AM - 12:30 PM', course: 'CS204 - Data Structures & Algorithms', room: 'Lab 4', instructor: 'Dr. Ada Lovelace', status: 'In Progress' },
      { time: '02:00 PM - 03:30 PM', course: 'MA102 - Engineering Mathematics', room: 'Hall A-102', instructor: 'Dr. John Nash', status: 'Upcoming' },
    ];

    const myCourses = [
      { code: 'CS101', title: 'Introduction to Programming', credits: 4, grade: 'A', progress: 85 },
      { code: 'CS204', title: 'Data Structures and Algorithms', credits: 4, grade: 'A+', progress: 92 },
      { code: 'EE201', title: 'Circuit Analysis & Theory', credits: 3, grade: 'A-', progress: 78 },
      { code: 'MA102', title: 'Calculus & Linear Algebra', credits: 4, grade: 'A', progress: 88 },
    ];

    return (
      <div className="page">
        {/* Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', padding: '0.25rem 0.75rem', borderRadius: '9999px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <GraduationCap size={14} /> Student Academic Portal
            </div>
            <h1 className="page-title">Welcome back, {currentUser.name}!</h1>
            <p className="page-subtitle">Here is your academic progression, today's timetable, and enrolled courses.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/attendance')}>
              <CheckSquare size={18} />
              <span>My Attendance</span>
            </button>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/courses')}>
              <BookOpen size={18} />
              <span>Browse Curriculum</span>
            </button>
          </div>
        </div>

        {/* Student Stats Grid */}
        <div className="stats-grid">
          {studentStats.map((stat, idx) => (
            <div 
              key={idx} 
              className="stat-card" 
              onClick={() => navigate(stat.path)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`stat-icon-wrapper stat-icon-${stat.type}`}>
                {stat.icon}
              </div>
              <div className="stat-content" style={{ flex: 1 }}>
                <span className="stat-label">{stat.title}</span>
                <span className="stat-value">{stat.value}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.2rem' }}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule & Course Progression */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
          {/* Today's Schedule */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} style={{ color: 'var(--primary)' }} />
                <span>Today's Class Timetable</span>
              </h3>
              <span className="tag">Live Schedule</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {todaySchedule.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '0.75rem', 
                    backgroundColor: item.status === 'In Progress' ? 'var(--primary-light)' : 'rgba(0,0,0,0.02)',
                    border: item.status === 'In Progress' ? '1px solid rgba(79, 70, 229, 0.3)' : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{item.course}</strong>
                    <span 
                      className={`badge ${item.status === 'In Progress' ? 'badge-active' : 'badge-inactive'}`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {item.time}
                    </span>
                    <span>• {item.room}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instructor: {item.instructor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolled Courses & Progress */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} style={{ color: 'var(--success)' }} />
                <span>My Course Performance</span>
              </h3>
              <span className="badge badge-active">Semester 5</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myCourses.map((c, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingBottom: idx !== myCourses.length - 1 ? '0.75rem' : '0', borderBottom: idx !== myCourses.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="tag" style={{ marginRight: '0.5rem' }}>{c.code}</span>
                      <strong style={{ fontSize: '0.875rem' }}>{c.title}</strong>
                    </div>
                    <span className="badge badge-active">{c.grade}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    <span>Syllabus Covered: {c.progress}%</span>
                    <span>{c.credits} Credits</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', borderRadius: '999px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
                    <div style={{ width: `${c.progress}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     2. ADMIN / EXECUTIVE DASHBOARD VIEW
     ========================================================================== */
  const stats = [
    { 
      title: 'Total Enrolled Students', 
      count: '1,245', 
      change: '+8.4% this term', 
      icon: <Users size={24} />, 
      path: '/students', 
      type: 'primary' 
    },
    { 
      title: 'Academic Departments', 
      count: '12', 
      change: '+2 this year', 
      icon: <Building2 size={24} />, 
      path: '/departments', 
      type: 'success' 
    },
    { 
      title: 'Active Faculty Staff', 
      count: '124', 
      change: '98% active', 
      icon: <UserSquare2 size={24} />, 
      path: '/faculty', 
      type: 'info' 
    },
    { 
      title: 'Approved Courses', 
      count: '86', 
      change: 'Across 8 Semesters', 
      icon: <BookOpen size={24} />, 
      path: '/courses', 
      type: 'warning' 
    },
  ];

  const recentActivities = [
    { title: 'Computer Science Department added new elective CS402', time: '20 mins ago' },
    { title: 'Attendance record submitted for CS101 (94% turnout)', time: '1 hour ago' },
    { title: 'Dr. Ada Lovelace appointed as Research Chair', time: '3 hours ago' },
    { title: 'New student registration batch imported for 2026-27', time: 'Yesterday' },
  ];

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Campus Dashboard</h1>
          <p className="page-subtitle">Welcome back, {currentUser.name}! Here is the administrative overview for today.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/attendance')}
          >
            <CheckSquare size={18} />
            <span>Attendance Log</span>
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => navigate('/departments')}
          >
            <Plus size={18} />
            <span>Manage Departments</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid with Hover & Click Navigation */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div 
            className="stat-card" 
            key={index} 
            onClick={() => navigate(stat.path)}
            style={{ cursor: 'pointer' }}
          >
            <div className={`stat-icon-wrapper stat-icon-${stat.type}`}>
              {stat.icon}
            </div>
            <div className="stat-content" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="stat-label">{stat.title}</span>
                <ArrowUpRight size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
              <span className="stat-value">{stat.count}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '600', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <TrendingUp size={12} /> {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Launch & Recent Activity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
        {/* Quick Management Hub */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Quick Navigation</h3>
            <span className="tag">Shortcuts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ justifyContent: 'space-between', padding: '0.875rem 1rem' }}
              onClick={() => navigate('/departments')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Building2 size={18} style={{ color: 'var(--primary)' }} />
                <span>Academic Departments Directory</span>
              </div>
              <ArrowUpRight size={16} />
            </button>

            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ justifyContent: 'space-between', padding: '0.875rem 1rem' }}
              onClick={() => navigate('/students')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users size={18} style={{ color: 'var(--success)' }} />
                <span>Student Admissions & Records</span>
              </div>
              <ArrowUpRight size={16} />
            </button>

            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ justifyContent: 'space-between', padding: '0.875rem 1rem' }}
              onClick={() => navigate('/faculty')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <UserSquare2 size={18} style={{ color: 'var(--info)' }} />
                <span>Faculty & Research Profiles</span>
              </div>
              <ArrowUpRight size={16} />
            </button>

            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ justifyContent: 'space-between', padding: '0.875rem 1rem' }}
              onClick={() => navigate('/courses')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BookOpen size={18} style={{ color: 'var(--warning)' }} />
                <span>Course Curriculum Catalog</span>
              </div>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Recent System Activities</h3>
            <span className="badge badge-active">Live Feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivities.map((act, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.875rem', 
                  paddingBottom: idx !== recentActivities.length - 1 ? '1rem' : '0', 
                  borderBottom: idx !== recentActivities.length - 1 ? '1px solid var(--border-color)' : 'none' 
                }}
              >
                <div 
                  style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary)', 
                    marginTop: '6px',
                    flexShrink: 0
                  }} 
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>{act.title}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
