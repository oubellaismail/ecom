import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log(formData);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
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
                <p className="text-muted">Create your account and start shopping</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                {/* Name fields */}
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                      First Name
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John" 
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'rgba(236, 236, 236, 0.7)',
                        border: 'none'
                      }}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                      Last Name
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe" 
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'rgba(236, 236, 236, 0.7)',
                        border: 'none'
                      }}
                      required
                    />
                  </div>
                </div>
                
                {/* Email field */}
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="email"
                    value={formData.email}
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
                
                {/* Password fields */}
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    Password
                  </label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password" 
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(236, 236, 236, 0.7)',
                      border: 'none'
                    }}
                    required
                    minLength="8"
                  />
                  <div className="form-text" style={{ fontSize: '0.8rem' }}>
                    Must be at least 8 characters long
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    Confirm Password
                  </label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password" 
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(236, 236, 236, 0.7)',
                      border: 'none'
                    }}
                    required
                  />
                </div>
                
                {/* Terms and conditions */}
                <div className="form-check mb-4">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="agreeTerms" 
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    style={{
                      borderColor: '#ddd',
                      backgroundColor: 'rgba(236, 236, 236, 0.7)'
                    }}
                    required
                  />
                  <label className="form-check-label" htmlFor="agreeTerms" style={{ fontSize: '0.9rem' }}>
                    I agree to the <Link to="/terms" className="text-decoration-none" style={{ color: '#ff4d4d' }}>Terms of Service</Link> and <Link to="/privacy" className="text-decoration-none" style={{ color: '#ff4d4d' }}>Privacy Policy</Link>
                  </label>
                </div>
                
                {/* Sign up button */}
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
                  Create Account
                </button>
                
                {/* Social login separator */}
                <div className="d-flex align-items-center my-4">
                  <div className="flex-grow-1 border-bottom"></div>
                </div>
                
               
                
                {/* Sign in link */}
                <div className="text-center" style={{ fontSize: '0.9rem' }}>
                  Already have an account?{' '}
                  <Link to="/signin" className="text-decoration-none" style={{ color: '#ff4d4d', fontWeight: '500' }}>
                    Sign in
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

export default SignUp;