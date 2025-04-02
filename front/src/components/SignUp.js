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
        <div className="col-md-8 col-lg-6">
          <div className="card border-0" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', borderRadius: '16px' }}>
            <div className="card-body p-4 p-md-5">
              <h1 className="text-center mb-4" style={{ fontWeight: '800', fontSize: '2rem' }}>3Ecom</h1>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-check mb-3">
                  <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="form-check-input" required />
                  <label className="form-check-label">I agree to the terms and conditions</label>
                </div>
                <button type="submit" className="btn btn-primary w-100">Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;