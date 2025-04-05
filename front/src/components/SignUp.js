import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../api/authService';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(formData);
      setSuccessMessage('Account created successfully!');
      console.log('Registration successful:', data);
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed');
      console.error('Error:', error);
    }
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
                <p className="text-muted">Create your shopping account</p>
              </div>
              
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              
              <form onSubmit={handleSubmit}>
                {/* First Name field */}
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    First Name
                  </label>
                  <input 
                    type="text" 
                    name="firstName"
                    className="form-control" 
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name" 
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(236, 236, 236, 0.7)',
                      border: 'none'
                    }}
                    required
                  />
                </div>
                
                {/* Last Name field */}
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    name="lastName"
                    className="form-control" 
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name" 
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(236, 236, 236, 0.7)',
                      border: 'none'
                    }}
                    required
                  />
                </div>
                
                {/* Email field */}
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-control" 
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
                
                {/* Password field */}
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    Password
                  </label>
                  <input 
                    type="password" 
                    name="password"
                    className="form-control" 
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password" 
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(236, 236, 236, 0.7)',
                      border: 'none'
                    }}
                    required
                  />
                </div>
                
                {/* Confirm Password field */}
                <div className="mb-4">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    Confirm Password
                  </label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    className="form-control" 
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
                
                {/* Terms checkbox */}
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
                    I agree to the <Link to="/terms" className="text-decoration-none" style={{ color: '#ff4d4d' }}>Terms & Conditions</Link>
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
                
                {/* Separator */}
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