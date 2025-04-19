import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderService';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orders, setOrders] = useState([]);
    const [showAllOrders, setShowAllOrders] = useState(false);

    useEffect(() => {
        const loadOrders = async () => {
            if (!user) return;
            
            try {
                setLoading(true);
                const response = await orderApi.getMyOrders();
                if (response.success) {
                    setOrders(response.data);
                } else {
                    setError(response.message || 'Error loading orders');
                }
            } catch (error) {
                setError('Error loading orders. Please try again.');
                console.error('Orders error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [user]);

    // Orders to display - limited or all
    const displayedOrders = showAllOrders
        ? orders
        : orders.slice(0, 4);

    // Status badge component
    const StatusBadge = ({ status }) => {
        let badgeClass = 'badge ';

        switch (status) {
            case 'completed':
                badgeClass += 'bg-success';
                break;
            case 'pending':
                badgeClass += 'bg-warning text-dark';
                break;
            case 'processing':
                badgeClass += 'bg-info text-dark';
                break;
            default:
                badgeClass += 'bg-secondary';
        }

        return <span className={badgeClass}>{status}</span>;
    };

    // Toggle display function
    const toggleOrdersDisplay = () => {
        setShowAllOrders(!showAllOrders);
    };

    // Logout function
    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
            navigate('/');
        } catch (error) {
            setError('Error logging out. Please try again.');
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="container my-5">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row justify-content-center">
                <div className="col-md-6">
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
                                <h2 className="fw-bold mb-1">Hello, {user.first_name} {user.last_name}</h2>
                                <p className="text-muted">Manage your account</p>
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <Link
                                    to="/edit-profile"
                                    className="btn w-100 me-2"
                                    style={{
                                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                        color: 'white',
                                        fontWeight: '500',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                                    }}
                                >
                                    Edit Profile
                                </Link>
                                <button
                                    className="btn w-100 ms-2"
                                    onClick={handleLogout}
                                    disabled={loading}
                                    style={{
                                        background: 'rgba(236, 236, 236, 0.7)',
                                        color: '#333',
                                        fontWeight: '500',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: 'none'
                                    }}
                                >
                                    {loading ? 'Logging out...' : 'Logout'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="row justify-content-center mt-4">
                <div className="col-12">
                    <div className="card border-0" style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        borderRadius: '16px'
                    }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold mb-0" style={{ fontSize: '1.25rem' }}>Recent Orders</h5>
                                <button
                                    onClick={toggleOrdersDisplay}
                                    className="btn btn-sm"
                                    style={{
                                        background: 'rgba(236, 236, 236, 0.7)',
                                        color: '#333',
                                        fontWeight: '500',
                                        borderRadius: '8px',
                                        border: 'none',
                                        padding: '8px 12px'
                                    }}
                                >
                                    {showAllOrders ? 'View Less' : 'View All'}
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">No orders found.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Order ID</th>
                                                <th scope="col" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Date</th>
                                                <th scope="col" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Amount</th>
                                                <th scope="col" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Status</th>
                                                <th scope="col" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedOrders.map((order) => (
                                                <tr key={order.id}>
                                                    <td>#{order.order_number}</td>
                                                    <td>{new Date(order.ordered_at).toLocaleDateString()}</td>
                                                    <td>${Number(order.total_amount).toFixed(2)}</td>
                                                    <td>
                                                        <StatusBadge status={order.order_status?.code} />
                                                    </td>
                                                    <td>
                                                        <Link
                                                            to={`/order/${order.order_number}`}
                                                            className="btn btn-sm"
                                                            style={{
                                                                background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                                                color: 'white',
                                                                fontWeight: '500',
                                                                padding: '4px 10px',
                                                                borderRadius: '8px',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            Details
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Separator */}
                            <div className="d-flex align-items-center my-4">
                                <div className="flex-grow-1 border-bottom"></div>
                            </div>

                            {/* View all orders link */}
                            <div className="text-center">
                                <Link
                                    to="/orders"
                                    className="text-decoration-none"
                                    style={{
                                        color: '#ff4d4d',
                                        fontWeight: '500',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Manage All Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;