import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../api/orderService';
import { useAuth } from '../context/AuthContext';

const OrderValidation = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Pending');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    // Load orders on mount and when filters change
    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await orderService.getOrders({
                    page,
                    status: statusFilter,
                    sortBy,
                    sortOrder,
                    search: searchTerm
                });
                setOrders(response.data.orders);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                setError('Error loading orders. Please try again.');
                console.error('Orders error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadOrders();
        }
    }, [user, page, statusFilter, sortBy, sortOrder, searchTerm]);

    // Handler for updating order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');
            const response = await orderService.updateOrderStatus(orderId, newStatus);

            setOrders(orders.map(order =>
                order.id === orderId ? response.data : order
            ));

            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }

            setSuccess(`Order #${orderId} status updated to ${newStatus}`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Error updating order status. Please try again.');
            console.error('Order update error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handler for deleting an order
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) {
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');
            await orderService.deleteOrder(orderId);
            setOrders(orders.filter(order => order.id !== orderId));
            setSuccess(`Order #${orderId} deleted successfully`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Error deleting order. Please try again.');
            console.error('Order delete error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Status Badge component (similar to the one in Dashboard)
    const StatusBadge = ({ status }) => {
        const getBadgeStyle = () => {
            switch (status) {
                case 'Delivered':
                    return { background: '#28a745', color: 'white' };
                case 'Processing':
                    return { background: '#ffc107', color: 'black' };
                case 'Shipped':
                    return { background: '#17a2b8', color: 'white' };
                case 'Pending':
                    return { background: '#6c757d', color: 'white' };
                case 'Cancelled':
                    return { background: '#dc3545', color: 'white' };
                case 'Validated':
                    return { background: '#8e44ad', color: 'white' };
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
                {status}
            </span>
        );
    };

    // Filter orders based on search term and status filter
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Icons
    const SearchIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    );

    const BackIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
    );

    // Sort handler
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
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
                <div className="col-md-3 mb-4">
                    <div className="card border-0" style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        borderRadius: '16px'
                    }}>
                        <div className="card-body p-4">
                            {/* Logo */}
                            <div className="text-center mb-4">
                                <h1 style={{
                                    fontWeight: '800',
                                    fontSize: '1.75rem',
                                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    3Ecom Admin
                                </h1>
                                <p className="text-muted">Admin Panel</p>
                            </div>

                            {/* Navigation Menu */}
                            <div className="nav flex-column">
                                <Link
                                    to="/dashboard"
                                    className="nav-link text-start py-3 px-4 mb-2"
                                    style={{
                                        borderRadius: '12px',
                                        background: 'rgba(236, 236, 236, 0.7)',
                                        color: '#333',
                                        fontWeight: '500',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/admin/products"
                                    className="nav-link text-start py-3 px-4 mb-2"
                                    style={{
                                        borderRadius: '12px',
                                        background: 'rgba(236, 236, 236, 0.7)',
                                        color: '#333',
                                        fontWeight: '500',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Products
                                </Link>
                                <Link
                                    to="/order"
                                    className="nav-link text-start py-3 px-4 mb-2"
                                    style={{
                                        borderRadius: '12px',
                                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                        color: 'white',
                                        fontWeight: '500',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Orders
                                </Link>

                                <Link
                                    to="/admin/customers"
                                    className="nav-link text-start py-3 px-4 mb-2"
                                    style={{
                                        borderRadius: '12px',
                                        background: 'rgba(236, 236, 236, 0.7)',
                                        color: '#333',
                                        fontWeight: '500',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Customers
                                </Link>
                                <Link
                                    to="/admin/coupons"
                                    className="nav-link text-start py-3 px-4 mb-2"
                                    style={{
                                        borderRadius: '12px',
                                        background: 'rgba(236, 236, 236, 0.7)',
                                        color: '#333',
                                        fontWeight: '500',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Discount coupons
                                </Link>
                                <Link
                                    to="/logout"
                                    className="nav-link text-start py-3 px-4"
                                    style={{
                                        borderRadius: '12px',
                                        background: 'rgba(236, 236, 236, 0.7)',
                                        color: '#333',
                                        fontWeight: '500',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="card border-0" style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        borderRadius: '16px'
                    }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="mb-0">Order Management</h2>
                                <div className="d-flex gap-2">
                                    <select
                                        className="form-select"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <SearchIcon />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search orders..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">No orders found.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Date</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.map((order) => (
                                                <tr key={order.id}>
                                                    <td>{order.id}</td>
                                                    <td>{order.customer}</td>
                                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                                    <td>${order.amount.toFixed(2)}</td>
                                                    <td><StatusBadge status={order.status} /></td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => setSelectedOrder(order)}
                                                                disabled={loading}
                                                            >
                                                                View Details
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-success"
                                                                onClick={() => updateOrderStatus(order.id, 'Validated')}
                                                                disabled={loading || order.status === 'Validated'}
                                                            >
                                                                Validate
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            <div className="d-flex justify-content-center mt-4">
                                <nav>
                                    <ul className="pagination">
                                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setPage(page - 1)}>
                                                Previous
                                            </button>
                                        </li>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => setPage(i + 1)}>
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setPage(page + 1)}>
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderValidation;