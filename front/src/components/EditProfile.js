import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();
    
    // État initial avec les données de l'utilisateur
    const [formData, setFormData] = useState({
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    
    // État pour les messages de validation/erreur
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Gestion des changements dans les champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrorMessage('');
        setSuccessMessage('');
    };
    
    // Soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Vérification si les mots de passe correspondent
        if (formData.new_password && formData.new_password !== formData.confirm_password) {
            setErrorMessage('New passwords do not match!');
            setIsLoading(false);
            return;
        }
        
        // Simuler une mise à jour réussie
        // Ici vous pourriez appeler une API pour mettre à jour le profil
        setTimeout(() => {
            setSuccessMessage('Profile updated successfully!');
            setIsLoading(false);
            
            // Dans un cas réel, vous pourriez rediriger après un délai
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        }, 1000);
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
                                <p className="text-muted">Edit your profile information</p>
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
                                        name="first_name"
                                        className="form-control" 
                                        value={formData.first_name}
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
                                        name="last_name"
                                        className="form-control" 
                                        value={formData.last_name}
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
                                
                                {/* Separator */}
                                <div className="d-flex align-items-center my-4">
                                    <div className="flex-grow-1 border-bottom"></div>
                                    <div className="px-3 text-muted" style={{ fontSize: '0.9rem' }}>Change Password</div>
                                    <div className="flex-grow-1 border-bottom"></div>
                                </div>
                                
                                {/* Current Password field */}
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                                        Current Password
                                    </label>
                                    <input 
                                        type="password" 
                                        name="current_password"
                                        className="form-control" 
                                        value={formData.current_password}
                                        onChange={handleChange}
                                        placeholder="Enter current password" 
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            background: 'rgba(236, 236, 236, 0.7)',
                                            border: 'none'
                                        }}
                                    />
                                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                                        Leave blank if you don't want to change password
                                    </small>
                                </div>
                                
                                {/* New Password field */}
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                                        New Password
                                    </label>
                                    <input 
                                        type="password" 
                                        name="new_password"
                                        className="form-control" 
                                        value={formData.new_password}
                                        onChange={handleChange}
                                        placeholder="Create a new password" 
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            background: 'rgba(236, 236, 236, 0.7)',
                                            border: 'none'
                                        }}
                                    />
                                </div>
                                
                                {/* Confirm New Password field */}
                                <div className="mb-4">
                                    <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                                        Confirm New Password
                                    </label>
                                    <input 
                                        type="password" 
                                        name="confirm_password"
                                        className="form-control" 
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        placeholder="Confirm your new password" 
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            background: 'rgba(236, 236, 236, 0.7)',
                                            border: 'none'
                                        }}
                                    />
                                </div>
                                
                                {/* Action buttons */}
                                <div className="d-flex justify-content-between gap-3 mb-3">
                                    <Link 
                                        to="/profile" 
                                        className="btn w-50"
                                        style={{
                                            background: 'rgba(236, 236, 236, 0.7)',
                                            color: '#333',
                                            fontWeight: '500',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            border: 'none'
                                        }}
                                    >
                                        Cancel
                                    </Link>
                                    <button 
                                        disabled={isLoading}
                                        type="submit" 
                                        className="btn w-50"
                                        style={{
                                            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                            color: 'white',
                                            fontWeight: '500',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                                        }}
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;