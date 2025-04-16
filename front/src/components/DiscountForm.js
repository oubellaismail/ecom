import React, { useState } from 'react';
import discountService from '../api/discountService';

const DiscountForm = () => {
    const [formData, setFormData] = useState({
        percentage: '',
        usage_limit: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
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
            const percentage = parseFloat(formData.percentage);
            if (isNaN(percentage) || percentage < 0 || percentage > 100) {
                throw new Error('Percentage must be between 0 and 100');
            }

            // Validate usage limit (should be a positive integer)
            const usageLimit = parseInt(formData.usage_limit);
            if (isNaN(usageLimit) || usageLimit < 1) {
                throw new Error('Usage limit must be a positive number');
            }

            // Send only percentage and usage_limit to the backend
            const response = await discountService.createDiscount({
                percentage,
                usage_limit: usageLimit
            });

            if (response.success) {
                setSuccess('Discount created successfully!');
                setFormData({
                    percentage: '',
                    usage_limit: ''
                });
            } else {
                setError(response.message || 'Error creating discount');
            }
        } catch (error) {
            setError(error.message || 'Error creating discount');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card border-0" style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div className="card-body p-4">
                            <h4 className="fw-bold mb-4">Create Discount</h4>

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

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                                        Discount Percentage
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="percentage"
                                            value={formData.percentage}
                                            onChange={handleChange}
                                            placeholder="Enter percentage"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            style={{
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                background: 'rgba(236, 236, 236, 0.7)',
                                                border: 'none'
                                            }}
                                            required
                                        />
                                        <span className="input-group-text" style={{
                                            borderRadius: '12px',
                                            background: 'rgba(236, 236, 236, 0.7)',
                                            border: 'none'
                                        }}>%</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                                        Usage Limit
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="usage_limit"
                                        value={formData.usage_limit}
                                        onChange={handleChange}
                                        placeholder="Enter usage limit"
                                        min="1"
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            background: 'rgba(236, 236, 236, 0.7)',
                                            border: 'none'
                                        }}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn w-100"
                                    style={{
                                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                        color: 'white',
                                        fontWeight: '500',
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Discount'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscountForm; 