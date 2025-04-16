import React, { useState, useEffect } from 'react';
import discountService from '../api/discountService';
import { useAuth } from '../context/AuthContext';

const DiscountCoupons = () => {
    const { user } = useAuth();
    const [coupons, setCoupons] = useState([]);
    const [newCoupon, setNewCoupon] = useState({
        discount_percentage: '',
        usage_limit: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Load coupons on mount
    useEffect(() => {
        const loadCoupons = async () => {
            try {
                setLoading(true);
                const response = await discountService.getDiscounts();
                setCoupons(response.data);
            } catch (error) {
                setError('Error loading coupons. Please try again.');
                console.error('Coupons error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadCoupons();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCoupon(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate percentage (should be between 0 and 100)
            const discount_percentage = parseFloat(newCoupon.discount_percentage);
            if (isNaN(discount_percentage) || discount_percentage < 0 || discount_percentage > 100) {
                throw new Error('Percentage must be between 0 and 100');
            }

            // Validate usage limit (should be a positive integer)
            const usageLimit = parseInt(newCoupon.usage_limit);
            if (isNaN(usageLimit) || usageLimit < 1) {
                throw new Error('Usage limit must be a positive number');
            }

            const response = await discountService.createDiscount({
                discount_percentage,
                usage_limit: usageLimit
            });

            if (response.success) {
                setSuccess('Discount created successfully!');
                setNewCoupon({
                    discount_percentage: '',
                    usage_limit: ''
                });
                // Refresh the coupons list
                const updatedResponse = await discountService.getDiscounts();
                setCoupons(updatedResponse.data);
            } else {
                setError(response.message || 'Error creating discount');
            }
        } catch (error) {
            setError(error.message || 'Error creating discount');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="container-fluid py-4" style={{
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            minHeight: '100vh'
        }}>
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
            )}

            <div className="row">
                <div className="col-12">
                    <div className="card border-0" style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        borderRadius: '16px'
                    }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold" style={{
                                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Discount Coupons
                                </h3>
                            </div>

                            <div className="card border-0 mb-4" style={{
                                background: 'rgba(236, 236, 236, 0.7)',
                                borderRadius: '12px'
                            }}>
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4">Create New Coupon</h5>
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Discount Percentage</label>
                                                <div className="input-group">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="discount_percentage"
                                                        value={newCoupon.discount_percentage}
                                                        onChange={handleChange}
                                                        placeholder="Enter percentage"
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        required
                                                        style={{
                                                            padding: '12px 16px',
                                                            borderRadius: '12px',
                                                            background: 'rgba(255, 255, 255, 0.7)',
                                                            border: 'none'
                                                        }}
                                                    />
                                                    <span className="input-group-text" style={{
                                                        borderRadius: '12px',
                                                        background: 'rgba(255, 255, 255, 0.7)',
                                                        border: 'none'
                                                    }}>%</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Usage Limit</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="usage_limit"
                                                    value={newCoupon.usage_limit}
                                                    onChange={handleChange}
                                                    placeholder="Enter usage limit"
                                                    min="1"
                                                    required
                                                    style={{
                                                        padding: '12px 16px',
                                                        borderRadius: '12px',
                                                        background: 'rgba(255, 255, 255, 0.7)',
                                                        border: 'none'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-end mt-4">
                                            <button
                                                type="submit"
                                                className="btn"
                                                disabled={loading}
                                                style={{
                                                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                                    color: 'white',
                                                    fontWeight: '500',
                                                    padding: '0.75rem 1.5rem',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                                                }}
                                            >
                                                {loading ? 'Creating...' : 'Create Coupon'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : coupons.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">No coupons found.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Code</th>
                                                <th>Percentage</th>
                                                <th>Usage Limit</th>
                                                <th>Used</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {coupons.map((coupon) => (
                                                <tr key={coupon.id}>
                                                    <td>{coupon.code}</td>
                                                    <td>{coupon.discount_percentage}%</td>
                                                    <td>{coupon.usage_limit}</td>
                                                    <td>{coupon.used_count || 0}</td>
                                                    <td>
                                                        <span className={`badge ${coupon.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                                            {coupon.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscountCoupons;