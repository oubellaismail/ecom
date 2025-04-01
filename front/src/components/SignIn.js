import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log({ email, password, rememberMe });
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
              
              <form onSubmit={handleSubmit}>
                {/* Email field */}
                <div className="mb-4">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                
                {/* Remember me checkbox */}
                <div className="form-check mb-4">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="rememberMe" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    style={{
                      borderColor: '#ddd',
                      backgroundColor: 'rgba(236, 236, 236, 0.7)'
                    }}
                  />
                  <label className="form-check-label" htmlFor="rememberMe" style={{ fontSize: '0.9rem' }}>
                    Remember me for 30 days
                  </label>
                </div>
                
                {/* Sign in button */}
                <button 
                  type="submit" 
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
                  Sign In
                </button>
                
                {/* Social login separator */}
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