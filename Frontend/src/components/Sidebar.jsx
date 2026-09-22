import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  BookOpen,
  CheckSquare,
  Building2,
  LogOut,
  GraduationCap,
  Megaphone,
  Briefcase,
  Contact
} from 'lucide-react';
import { authService } from '../services/authService';

const Sidebar = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser() || { name: 'Admin User', role: 'admin', email: 'admin@campus.edu' };

  // Role-specific navigation menus
  const getNavItems = () => {
    if (currentUser.role === 'student') {
      return [
        { name: 'Student Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'My Courses', path: '/courses', icon: <BookOpen size={20} /> },
        { name: 'My Attendance', path: '/attendance', icon: <CheckSquare size={20} /> },
        { name: 'Faculty & Mentors', path: '/faculty', icon: <UserSquare2 size={20} /> },
        { name: 'Departments', path: '/departments', icon: <Building2 size={20} /> },
        { name: 'Noticeboard', path: '/notices', icon: <Megaphone size={20} /> },
        { name: 'Placements', path: '/placements', icon: <Briefcase size={20} /> },
        { name: 'Alumni', path: '/alumni', icon: <Contact size={20} /> },
      ];
    }

    if (currentUser.role === 'faculty') {
      return [
        { name: 'Faculty Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Class Attendance', path: '/attendance', icon: <CheckSquare size={20} /> },
        { name: 'Courses Offered', path: '/courses', icon: <BookOpen size={20} /> },
        { name: 'Students Directory', path: '/students', icon: <Users size={20} /> },
        { name: 'Departments', path: '/departments', icon: <Building2 size={20} /> },
        { name: 'Noticeboard', path: '/notices', icon: <Megaphone size={20} /> },
        { name: 'Placements', path: '/placements', icon: <Briefcase size={20} /> },
        { name: 'Alumni', path: '/alumni', icon: <Contact size={20} /> },
      ];
    }

    // Default: Admin menu
    return [
      { name: 'Executive Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
      { name: 'Departments', path: '/departments', icon: <Building2 size={20} /> },
      { name: 'Students', path: '/students', icon: <Users size={20} /> },
      { name: 'Faculty', path: '/faculty', icon: <UserSquare2 size={20} /> },
      { name: 'Courses', path: '/courses', icon: <BookOpen size={20} /> },
      { name: 'Attendance', path: '/attendance', icon: <CheckSquare size={20} /> },
      { name: 'Noticeboard', path: '/notices', icon: <Megaphone size={20} /> },
      { name: 'Placements', path: '/placements', icon: <Briefcase size={20} /> },
      { name: 'Alumni', path: '/alumni', icon: <Contact size={20} /> },
    ];
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .replace(/^Dr\.\s*|^Prof\.\s*/i, '')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatRoleName = (role) => {
    if (role === 'student') return 'Enrolled Student';
    if (role === 'faculty') return 'Faculty Member';
    return 'Administrator';
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-box">
          <GraduationCap size={24} />
        </div>
        <div className="brand-text">
          <span className="brand-title">EduCampus</span>
          <span className="brand-badge">{formatRoleName(currentUser.role)}</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation Menu</div>
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <div className="nav-item-content">
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer with User Info & Logout Button */}
      <div className="sidebar-footer">
        <div className="user-profile-card">
          <div className="user-avatar">
            {getInitials(currentUser.name)}
          </div>
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role">{formatRoleName(currentUser.role)}</span>
          </div>
        </div>

        <button 
          type="button" 
          className="sidebar-logout-btn" 
          onClick={handleLogout}
          title="Sign out of system"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
