import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { GraduationCap, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ 
    email: location.state?.registeredEmail || '', 
    password: '', 
    rememberMe: true 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.registeredMessage || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.registeredEmail) {
      setCredentials((prev) => ({ ...prev, email: location.state.registeredEmail }));
    }
    if (location.state?.registeredMessage) {
      setSuccessMessage(location.state.registeredMessage);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials({ ...credentials, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login(credentials);
      const user = response.user;

      // Role-based routing
      if (user.role === 'student') {
        navigate('/', { replace: true });
      } else if (user.role === 'faculty') {
        navigate('/', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoAccount = (email, password) => {
    setCredentials({ email, password, rememberMe: true });
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="auth-split-container">
      {/* Left side: Premium College Campus with Zoom Animation */}
      <div className="auth-image-section">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" 
          alt="University Campus Architecture" 
          className="auth-image"
        />
        <div className="auth-image-overlay"></div>
        <div className="auth-image-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.4rem 1rem', borderRadius: '9999px', backdropFilter: 'blur(10px)', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <GraduationCap size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Academic Portal</span>
          </div>
          <h1 className="auth-image-title">Welcome to the Next Generation Campus.</h1>
          <p className="auth-image-subtitle">
            Experience intelligent workflows for student progression, faculty administration, and institutional planning.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="auth-form-section">
        <div className="auth-card">
          <div className="auth-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="brand-icon-box">
                <GraduationCap size={24} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>EduCampus</span>
            </div>
            <h2 className="auth-title">Sign In</h2>
            <p className="auth-subtitle">Enter your registered credentials to access your dashboard</p>
          </div>

          {/* Registration / Success Alert */}
          {successMessage && (
            <div className="badge badge-active" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem', width: '100%', fontSize: '0.85rem' }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="alert-error">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                type="email"
                id="login-email"
                name="email"
                className="form-control"
                placeholder="e.g. student@campus.edu or your registered email"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={credentials.password}
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
                  name="rememberMe"
                  checked={credentials.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember this device</span>
              </label>
              <a 
                href="#" 
                className="forgot-password" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  alert('Please contact the campus registrar or admin to reset your credentials.'); 
                }}
              >
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full" 
              disabled={isLoading}
              style={{ marginTop: '0.5rem' }}
            >
              {isLoading ? 'Verifying credentials...' : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} style={{ marginLeft: 'auto' }} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials for Fast Testing */}
          <div style={{ marginTop: '1.75rem', padding: '0.875rem', borderRadius: '0.75rem', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Quick Demo Accounts:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-sm btn-outline" 
                onClick={() => setDemoAccount('student@campus.edu', 'password')}
              >
                Student Demo
              </button>
              <button 
                type="button" 
                className="btn btn-sm btn-outline" 
                onClick={() => setDemoAccount('faculty@campus.edu', 'password')}
              >
                Faculty Demo
              </button>
              <button 
                type="button" 
                className="btn btn-sm btn-outline" 
                onClick={() => setDemoAccount('admin@campus.edu', 'password')}
              >
                Admin Demo
              </button>
            </div>
          </div>

          <div className="auth-footer">
            New to the campus portal? <Link to="/register" style={{ fontWeight: '700' }}>Register an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
