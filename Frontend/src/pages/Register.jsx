import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { GraduationCap, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Register = () => {
  const [userData, setUserData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'student',
    registerNumber: '',
    department: 'Computer Science',
    year: '1st Year',
    agreeTerms: true 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({ ...userData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userData.registerNumber.trim()) {
      setError('Please provide your Register Number / Student ID.');
      return;
    }

    if (!userData.agreeTerms) {
      setError('You must accept the terms of service and academic privacy policy.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(userData);
      // Redirect to Login page with success state
      navigate('/login', {
        replace: true,
        state: {
          registeredEmail: userData.email,
          registeredMessage: `Registration successful for ${userData.name} (${userData.registerNumber})! Please sign in to view your student portal.`,
        },
      });
    } catch (err) {
      setError(err.message || 'Failed to create your account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      {/* Left side: Premium College Imagery & Animations */}
      <div className="auth-image-section">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
          alt="University campus students" 
          className="auth-image"
        />
        <div className="auth-image-overlay"></div>
        <div className="auth-image-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.4rem 1rem', borderRadius: '9999px', backdropFilter: 'blur(10px)', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <GraduationCap size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>EduCampus Registration</span>
          </div>
          <h1 className="auth-image-title">Begin your academic journey with us.</h1>
          <p className="auth-image-subtitle">
            Register your institutional ID and department to access personalized timetables, curriculum materials, and individual performance metrics.
          </p>
        </div>
      </div>

      {/* Right side: Registration Form */}
      <div className="auth-form-section">
        <div className="auth-card" style={{ maxWidth: '460px' }}>
          <div className="auth-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="brand-icon-box">
                <GraduationCap size={24} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>EduCampus</span>
            </div>
            <h2 className="auth-title">Create an Account</h2>
            <p className="auth-subtitle">Fill in your academic profile details to register</p>
          </div>

          {error && (
            <div className="alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="reg-name">Full Legal Name *</label>
              <input
                type="text"
                id="reg-name"
                name="name"
                className="form-control"
                placeholder="e.g. Eleanor Vance"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Campus Email Address *</label>
              <input
                type="email"
                id="reg-email"
                name="email"
                className="form-control"
                placeholder="e.g. eleanor@campus.edu"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Register Number & Role Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="reg-id">
                  {userData.role === 'student' ? 'Register / Roll No. *' : 'Staff / ID Number *'}
                </label>
                <input
                  type="text"
                  id="reg-id"
                  name="registerNumber"
                  className="form-control"
                  placeholder={userData.role === 'student' ? 'e.g. REG-2024-042' : 'e.g. FAC-08'}
                  value={userData.registerNumber}
                  onChange={handleChange}
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-role">Account Role *</label>
                <select
                  id="reg-role"
                  name="role"
                  className="form-control"
                  value={userData.role}
                  onChange={handleChange}
                  style={{ fontWeight: '600' }}
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty Member</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            {/* Department Selection */}
            <div className="form-group">
              <label htmlFor="reg-dept">Academic Department *</label>
              <select
                id="reg-dept"
                name="department"
                className="form-control"
                value={userData.department}
                onChange={handleChange}
                style={{ fontWeight: '600' }}
                required
              >
                <option value="Computer Science">Computer Science & Engineering</option>
                <option value="Electrical Eng">Electrical & Electronics Engineering</option>
                <option value="Mechanical Eng">Mechanical Engineering</option>
                <option value="Civil Eng">Civil & Environmental Engineering</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  name="password"
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={userData.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="agreeTerms" 
                  checked={userData.agreeTerms} 
                  onChange={handleChange} 
                />
                <span>I agree to campus terms & privacy policy</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full" 
              disabled={isLoading}
              style={{ marginTop: '0.5rem' }}
            >
              {isLoading ? 'Registering Account...' : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} style={{ marginLeft: 'auto' }} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer" style={{ marginTop: '1.75rem' }}>
            Already have an account? <Link to="/login" style={{ fontWeight: '700' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
