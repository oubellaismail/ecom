import React, { useState, useEffect } from 'react';

const DiscountCoupons = () => {
    // State for coupon list and form
    const [coupons, setCoupons] = useState([
        {
            id: 1,
            code: 'WELCOME25',
            discount: 25,
            type: 'percentage',
            minPurchase: 100,
            validFrom: '2025-04-01',
            validUntil: '2025-05-31',
            usageLimit: 100,
            usageCount: 12,
            status: 'active'
        },
        {
            id: 2,
            code: 'FLASH50',
            discount: 50,
            type: 'fixed',
            minPurchase: 150,
            validFrom: '2025-04-10',
            validUntil: '2025-04-15',
            usageLimit: 50,
            usageCount: 8,
            status: 'active'
        },
        {
            id: 3,
            code: 'SPECIAL10',
            discount: 10,
            type: 'percentage',
            minPurchase: 50,
            validFrom: '2025-03-01',
            validUntil: '2025-04-01',
            usageLimit: 200,
            usageCount: 187,
            status: 'expired'
        }
    ]);

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discount: 10,
        type: 'percentage',
        minPurchase: 0,
        validFrom: '',
        validUntil: '',
        usageLimit: 100,
        status: 'active'
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    // Set today's date as default for form
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthFormatted = nextMonth.toISOString().split('T')[0];

        setNewCoupon(prev => ({
            ...prev,
            validFrom: today,
            validUntil: nextMonthFormatted
        }));
    }, []);

    // Validate form whenever newCoupon changes
    useEffect(() => {
        const isValid =
            newCoupon.code.trim() !== '' &&
            newCoupon.discount > 0 &&
            newCoupon.validFrom !== '' &&
            newCoupon.validUntil !== '' &&
            new Date(newCoupon.validUntil) >= new Date(newCoupon.validFrom);

        setIsFormValid(isValid);
    }, [newCoupon]);

    // Generate random code
    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setNewCoupon(prev => ({ ...prev, code: result }));
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCoupon(prev => ({ ...prev, [name]: value }));
    };

    // Handle number inputs specifically
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setNewCoupon(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    // Submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isFormValid) return;

        if (selectedCoupon) {
            // Edit existing coupon
            setCoupons(coupons.map(coupon =>
                coupon.id === selectedCoupon.id ? { ...newCoupon, id: coupon.id, usageCount: coupon.usageCount } : coupon
            ));
            setSelectedCoupon(null);
        } else {
            // Add new coupon
            setCoupons([...coupons, {
                ...newCoupon,
                id: coupons.length > 0 ? Math.max(...coupons.map(c => c.id)) + 1 : 1,
                usageCount: 0
            }]);
        }

        // Reset form
        setNewCoupon({
            code: '',
            discount: 10,
            type: 'percentage',
            minPurchase: 0,
            validFrom: newCoupon.validFrom,
            validUntil: newCoupon.validUntil,
            usageLimit: 100,
            status: 'active'
        });
    };

    // Edit coupon
    const handleEdit = (coupon) => {
        setSelectedCoupon(coupon);
        setNewCoupon({ ...coupon });
        window.scrollTo(0, 0);
    };

    // Delete coupon
    const handleDelete = (id) => {
        setCoupons(coupons.filter(coupon => coupon.id !== id));
    };

    // Cancel editing
    const handleCancel = () => {
        setSelectedCoupon(null);
        setNewCoupon({
            code: '',
            discount: 10,
            type: 'percentage',
            minPurchase: 0,
            validFrom: newCoupon.validFrom,
            validUntil: newCoupon.validUntil,
            usageLimit: 100,
            status: 'active'
        });
    };

    // Filter and search coupons
    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || coupon.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Status Badge component
    const StatusBadge = ({ status }) => {
        const getBadgeStyle = () => {
            switch (status) {
                case 'active':
                    return { background: '#28a745', color: 'white' };
                case 'expired':
                    return { background: '#dc3545', color: 'white' };
                case 'paused':
                    return { background: '#ffc107', color: 'black' };
                default:
                    return { background: '#6c757d', color: 'white' };
            }
        };

        return (
            <span className="badge px-3 py-2" style={{
                ...getBadgeStyle(),
                borderRadius: '8px',
                fontSize: '0.75rem'
            }}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Icons
    const PercentIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="5" x2="5" y2="19"></line>
            <circle cx="6.5" cy="6.5" r="2.5"></circle>
            <circle cx="17.5" cy="17.5" r="2.5"></circle>
        </svg>
    );

    return (
        <div className="container-fluid py-4" style={{
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            minHeight: '100vh'
        }}>
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
                                <button
                                    className="btn"
                                    onClick={() => setIsGenerating(!isGenerating)}
                                    style={{
                                        background: isGenerating ? 'rgba(236, 236, 236, 0.7)' : 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                        color: isGenerating ? '#333' : 'white',
                                        fontWeight: '500',
                                        padding: '10px 20px',
                                        borderRadius: '12px',
                                        border: 'none'
                                    }}
                                >
                                    {isGenerating ? 'Cancel' : 'Create New Coupon'}
                                </button>
                            </div>

                            {isGenerating && (
                                <div className="card mb-4" style={{
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <div className="card-body p-4">
                                        <h5 className="card-title mb-4">{selectedCoupon ? 'Edit Coupon' : 'Generate New Coupon'}</h5>
                                        <form onSubmit={handleSubmit}>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Coupon Code</label>
                                                        <div className="input-group">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="code"
                                                                value={newCoupon.code}
                                                                onChange={handleChange}
                                                                required
                                                                style={{ borderRadius: '8px 0 0 8px' }}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary"
                                                                onClick={generateRandomCode}
                                                                style={{ borderRadius: '0 8px 8px 0' }}
                                                            >
                                                                Generate
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">Discount Type</label>
                                                        <select
                                                            className="form-select"
                                                            name="type"
                                                            value={newCoupon.type}
                                                            onChange={handleChange}
                                                            style={{ borderRadius: '8px' }}
                                                        >
                                                            <option value="percentage">Percentage (%)</option>
                                                            <option value="fixed">Fixed Amount ($)</option>
                                                        </select>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">
                                                            {newCoupon.type === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount ($)'}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="discount"
                                                            value={newCoupon.discount}
                                                            onChange={handleNumberChange}
                                                            min="0"
                                                            max={newCoupon.type === 'percentage' ? '100' : ''}
                                                            required
                                                            style={{ borderRadius: '8px' }}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">Minimum Purchase Amount ($)</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="minPurchase"
                                                            value={newCoupon.minPurchase}
                                                            onChange={handleNumberChange}
                                                            min="0"
                                                            step="any"
                                                            style={{ borderRadius: '8px' }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Valid From</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="validFrom"
                                                            value={newCoupon.validFrom}
                                                            onChange={handleChange}
                                                            required
                                                            style={{ borderRadius: '8px' }}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">Valid Until</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="validUntil"
                                                            value={newCoupon.validUntil}
                                                            onChange={handleChange}
                                                            required
                                                            style={{ borderRadius: '8px' }}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">Usage Limit</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="usageLimit"
                                                            value={newCoupon.usageLimit}
                                                            onChange={handleNumberChange}
                                                            min="1"
                                                            required
                                                            style={{ borderRadius: '8px' }}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">Status</label>
                                                        <select
                                                            className="form-select"
                                                            name="status"
                                                            value={newCoupon.status}
                                                            onChange={handleChange}
                                                            style={{ borderRadius: '8px' }}
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="paused">Paused</option>
                                                            <option value="expired">Expired</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-end gap-2 mt-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-light"
                                                    onClick={handleCancel}
                                                    style={{ borderRadius: '8px' }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn"
                                                    disabled={!isFormValid}
                                                    style={{
                                                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                                        color: 'white',
                                                        fontWeight: '500',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        opacity: isFormValid ? 1 : 0.6
                                                    }}
                                                >
                                                    {selectedCoupon ? 'Update Coupon' : 'Create Coupon'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            <div className="card" style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                            }}>
                                <div className="card-body p-4">
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <div className="input-group">
                                                <span className="input-group-text" style={{ borderRadius: '8px 0 0 8px', background: '#f8f9fa' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                                    </svg>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search coupons..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    style={{ borderRadius: '0 8px 8px 0' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <select
                                                className="form-select"
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                                style={{ borderRadius: '8px' }}
                                            >
                                                <option value="all">All Status</option>
                                                <option value="active">Active</option>
                                                <option value="paused">Paused</option>
                                                <option value="expired">Expired</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Code</th>
                                                    <th>Discount</th>
                                                    <th>Min Purchase</th>
                                                    <th>Valid Until</th>
                                                    <th>Usage</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredCoupons.length > 0 ? (
                                                    filteredCoupons.map((coupon) => (
                                                        <tr key={coupon.id}>
                                                            <td>
                                                                <span className="fw-bold">{coupon.code}</span>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="me-2 p-1 rounded-circle" style={{
                                                                        background: 'rgba(249, 203, 40, 0.1)',
                                                                        color: '#f9cb28'
                                                                    }}>
                                                                        <PercentIcon />
                                                                    </div>
                                                                    {coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount.toFixed(2)}`}
                                                                </div>
                                                            </td>
                                                            <td>${coupon.minPurchase.toFixed(2)}</td>
                                                            <td>{coupon.validUntil}</td>
                                                            <td>{coupon.usageCount} / {coupon.usageLimit}</td>
                                                            <td><StatusBadge status={coupon.status} /></td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => handleEdit(coupon)}
                                                                        style={{ borderRadius: '6px' }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => handleDelete(coupon.id)}
                                                                        style={{ borderRadius: '6px' }}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="text-center py-4">No coupons found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {filteredCoupons.length > 0 && (
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <div>
                                                <span className="text-muted">Showing {filteredCoupons.length} of {coupons.length} coupons</span>
                                            </div>
                                            <div>
                                                <button className="btn btn-sm" style={{
                                                    background: 'rgba(236, 236, 236, 0.7)',
                                                    color: '#333',
                                                    fontWeight: '500',
                                                    borderRadius: '8px',
                                                    border: 'none'
                                                }}>
                                                    Export CSV
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscountCoupons;