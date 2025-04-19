import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orderService';
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
    const ORDERS_PER_PAGE = 10;

    // Load orders on mount and when filters change
    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                setError('');
                console.log('Loading orders...');
                const response = await orderApi.getMyOrders();
                console.log('Orders response:', response);
                
                if (response.success) {
                    // Transform the data to match our expected format
                    const transformedOrders = response.data.map(order => ({
                        id: order.order_number,
                        customer: order.user ? `${order.user.first_name} ${order.user.last_name}` : 'Unknown Customer',
                        date: order.ordered_at,
                        amount: Number(order.total_amount) || 0,
                        status: order.order_status?.code || 'pending',
                        items: order.order_lines?.map(line => ({
                            name: line.productItem?.product?.name || 'Unknown Product',
                            quantity: line.qty,
                            price: Number(line.subtotal / line.qty) || 0
                        })) || []
                    }));
                    
                    console.log('Transformed orders:', transformedOrders);
                    setOrders(transformedOrders);
                    setTotalPages(Math.ceil(transformedOrders.length / ORDERS_PER_PAGE));
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

        if (user) {
            loadOrders();
        }
    }, [user, page, statusFilter, searchTerm]);

    // Handler for updating order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');
            const response = await orderApi.updateOrderStatus(orderId, { order_status_code: newStatus.toLowerCase() });

            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
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

    // Filter orders based on search term and status filter
    const filteredOrders = orders.filter(order => {
        if (!order) return false;
        
        const searchTermLower = searchTerm.toLowerCase();
        const customerName = (order.customer || '').toLowerCase();
        const orderId = (order.id || '').toString();
        const orderStatus = order.status || '';
        
        const matchesSearch = customerName.includes(searchTermLower) ||
            orderId.includes(searchTermLower);
        const matchesStatus = statusFilter === 'All' || orderStatus === statusFilter.toLowerCase();
        
        return matchesSearch && matchesStatus;
    });

    // Calculate paginated orders
    const startIndex = (page - 1) * ORDERS_PER_PAGE;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

    // Status Badge component
    const StatusBadge = ({ status }) => {
        const getBadgeStyle = () => {
            switch (status) {
                case 'delivered':
                    return { background: '#28a745', color: 'white' };
                case 'processing':
                    return { background: '#ffc107', color: 'black' };
                case 'shipped':
                    return { background: '#17a2b8', color: 'white' };
                case 'pending':
                    return { background: '#6c757d', color: 'white' };
                case 'cancelled':
                    return { background: '#dc3545', color: 'white' };
                case 'validated':
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
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Order Details Modal component
    const OrderDetailsModal = ({ order, onClose }) => {
        if (!order) return null;

        return (
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Order #{order.id} Details</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h6 className="text-muted">Order Date</h6>
                                    <p>{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="text-muted">Status</h6>
                                    <p><StatusBadge status={order.status} /></p>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-12">
                                    <h6 className="text-muted">Customer Information</h6>
                                    <p>{order.customer}</p>
                                </div>
                            </div>

                            <div className="table-responsive mb-4">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.price.toFixed(2)}</td>
                                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="3" className="text-end fw-bold">Total:</td>
                                            <td className="fw-bold">${(order.amount || 0).toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Icons
    const SearchIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    );

    if (!user) {
        return null;
    }

    return (
        <div className="container-fluid py-4" style={{
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            minHeight: '100vh'
        }}>
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{
                    borderRadius: '12px',
                    border: 'none',
                    background: 'rgba(255, 77, 77, 0.1)',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert" style={{
                    borderRadius: '12px',
                    border: 'none',
                    background: 'rgba(40, 167, 69, 0.1)',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)} 
                />
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
                            <div>
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
                                    to="/AdminDashboard"
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
                                    to="/discount"
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
                                <h2 className="mb-0" style={{
                                    fontWeight: '800',
                                    fontSize: '1.75rem',
                                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Order Management
                                </h2>
                                <div className="d-flex gap-2">
                                    <select
                                        className="form-select"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            background: 'rgba(255,255,255,0.9)',
                                            backdropFilter: 'blur(5px)'
                                        }}
                                    >
                                        <option value="All">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="validated">Validated</option>
                                    </select>
                                    <div className="input-group">
                                        <span className="input-group-text" style={{
                                            borderRadius: '12px 0 0 12px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            background: 'rgba(255,255,255,0.9)',
                                            backdropFilter: 'blur(5px)'
                                        }}>
                                            <SearchIcon />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search orders..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{
                                                borderRadius: '0 12px 12px 0',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                background: 'rgba(255,255,255,0.9)',
                                                backdropFilter: 'blur(5px)'
                                            }}
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
                            ) : paginatedOrders.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">No orders found.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th style={{ fontWeight: '500' }}>Order ID</th>
                                                <th style={{ fontWeight: '500' }}>Customer</th>
                                                <th style={{ fontWeight: '500' }}>Date</th>
                                                <th style={{ fontWeight: '500' }}>Amount</th>
                                                <th style={{ fontWeight: '500' }}>Status</th>
                                                <th style={{ fontWeight: '500' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedOrders.map((order) => (
                                                <tr key={order.id}>
                                                    <td>#{order.id}</td>
                                                    <td>{order.customer}</td>
                                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                                    <td>${(order.amount || 0).toFixed(2)}</td>
                                                    <td><StatusBadge status={order.status} /></td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm"
                                                                onClick={() => setSelectedOrder(order)}
                                                                disabled={loading}
                                                                style={{
                                                                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                                                    color: 'white',
                                                                    fontWeight: '500',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.8rem',
                                                                    border: 'none'
                                                                }}
                                                            >
                                                                View Details
                                                            </button>
                                                            <button
                                                                className="btn btn-sm"
                                                                onClick={() => updateOrderStatus(order.id, 'validated')}
                                                                disabled={loading || order.status === 'validated'}
                                                                style={{
                                                                    background: 'rgba(236, 236, 236, 0.7)',
                                                                    color: '#333',
                                                                    fontWeight: '500',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.8rem',
                                                                    border: 'none'
                                                                }}
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
                                            <button className="page-link" onClick={() => setPage(page - 1)} style={{
                                                borderRadius: '8px',
                                                margin: '0 4px',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                background: 'rgba(255,255,255,0.9)',
                                                backdropFilter: 'blur(5px)'
                                            }}>
                                                Previous
                                            </button>
                                        </li>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => setPage(i + 1)} style={{
                                                    borderRadius: '8px',
                                                    margin: '0 4px',
                                                    border: '1px solid rgba(0,0,0,0.1)',
                                                    background: page === i + 1 ? 'linear-gradient(90deg, #ff4d4d, #f9cb28)' : 'rgba(255,255,255,0.9)',
                                                    color: page === i + 1 ? 'white' : '#333',
                                                    backdropFilter: 'blur(5px)'
                                                }}>
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setPage(page + 1)} style={{
                                                borderRadius: '8px',
                                                margin: '0 4px',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                                background: 'rgba(255,255,255,0.9)',
                                                backdropFilter: 'blur(5px)'
                                            }}>
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