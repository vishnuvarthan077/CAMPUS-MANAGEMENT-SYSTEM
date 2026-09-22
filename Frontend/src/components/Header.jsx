import React, { useState } from 'react';
import { Sun, Moon, Bell, Search, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const currentUser = authService.getCurrentUser() || { name: 'Admin User', role: 'Administrator' };

  return (
    <header className="app-header">
      {/* Search Bar in Header */}
      <div className="header-search">
        <Search className="header-search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Quick search (Ctrl + K)..." 
          className="header-search-input"
        />
      </div>
      
      {/* Action buttons */}
      <div className="header-actions">
        {/* Theme Toggle Button with Hover Animation */}
        <button 
          className="icon-button" 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications Button */}
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-button" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="notification-badge" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div 
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 10px)',
                width: '320px',
                padding: '1rem',
                zIndex: 50,
                boxShadow: 'var(--shadow-xl)',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.9rem' }}>Recent Notifications</strong>
                <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>2 New</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.5rem', borderRadius: '0.5rem', background: 'var(--primary-light)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--primary)', marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: '600' }}>Semester 1 grades published</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>10 minutes ago</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.02)' }}>
                  <Bell size={16} style={{ color: 'var(--warning)', marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: '600' }}>Faculty meeting at 3:00 PM</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.625rem', 
            padding: '0.35rem 0.75rem', 
            borderRadius: '9999px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer'
          }}
          title={`Signed in as ${currentUser.name}`}
        >
          <div 
            style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              background: 'var(--primary-gradient)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.75rem'
            }}
          >
            {currentUser.name ? currentUser.name.charAt(0) : 'A'}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
            {currentUser.name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
