import React, { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authService';

const SignIn = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await loginUser(credentials);
      setSuccessMessage('Login successful!');
      console.log('Login success:', data);
      setTimeout(() => navigate('/dashboard'), 1500); 
    } catch (error) {
      setErrorMessage(error.message || 'Login failed');
      console.error('Login error:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px'
          }}>
            <div className="card-body p-4 p-md-5">
              {/* Logo */}
              <div className="text-center mb-4">
                <h1 style={{
                  fontWeight: '800',
                  fontSize: '2rem',
                  background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  3Ecom
                </h1>
                <p className="text-muted">Welcome back to your shopping journey</p>
              </div>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <form onSubmit={handleSubmit}>
                {/* Email field */}
                <div className="mb-4">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    className="form-control"
                    name='email' 
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="your@email.com" 
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(236, 236, 236, 0.7)',
                      border: 'none'
                    }}
                    required
                  />
                </div>
                
                {/* Password field */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label mb-0" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-decoration-none" style={{ 
                      fontSize: '0.85rem',
                      color: '#ff4d4d'
                    }}>
                      Forgot password?
                    </Link>
                  </div>
                  <input 
                    type="password" 
                    className="form-control"
                    name='password' 
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter your password" 
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(236, 236, 236, 0.7)',
                      border: 'none'
                    }}
                    required
                  />
                </div>
                
                {/* Sign in button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn w-100 mb-3"
                  style={{
                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                    color: 'white',
                    fontWeight: '500',
                    padding: '12px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                  }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
                
                {/* separator */}
                <div className="d-flex align-items-center my-4">
                  <div className="flex-grow-1 border-bottom"></div>
                </div>
                
               
                
                {/* Sign up link */}
                <div className="text-center" style={{ fontSize: '0.9rem' }}>
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-decoration-none" style={{ color: '#ff4d4d', fontWeight: '500' }}>
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;