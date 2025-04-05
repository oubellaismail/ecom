import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../api/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await requestPasswordReset(email);
      setSuccessMessage('Password reset instructions have been sent to your email.');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsSubmitting(false);
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
                <p className="text-muted">Reset your password</p>
              </div>
              
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}
              
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
                
                <p className="text-muted mb-4" style={{ fontSize: '0.85rem' }}>
                  We'll send you an email with instructions to reset your password.
                </p>
                
                {/* Submit button */}
                <button 
                  type="submit" 
                  className="btn w-100 mb-3"
                  disabled={isSubmitting}
                  style={{
                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                    color: 'white',
                    fontWeight: '500',
                    padding: '12px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Reset Password'}
                </button>
                
                {/* Separator */}
                <div className="d-flex align-items-center my-4">
                  <div className="flex-grow-1 border-bottom"></div>
                </div>
                
                {/* Back to sign in */}
                <div className="text-center" style={{ fontSize: '0.9rem' }}>
                  Remember your password?{' '}
                  <Link to="/signin" className="text-decoration-none" style={{ color: '#ff4d4d', fontWeight: '500' }}>
                    Back to Sign In
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

export default ForgotPassword;