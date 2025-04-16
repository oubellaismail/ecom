import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrderValidation = () => {
    // Sample order data
    const [orders, setOrders] = useState([
        {
            id: 2456,
            customer: "Maria Rodriguez",
            email: "maria.r@example.com",
            date: "2025-04-10",
            amount: 429.99,
            status: "Pending",
            paymentMethod: "Credit Card",
            items: [
                { id: 112, name: "Wireless Headphones", price: 199.99, quantity: 1 },
                { id: 87, name: "Smart Watch", price: 230.00, quantity: 1 }
            ],
            shippingAddress: "123 Pine Street, Apt 4B, New York, NY 10001",
            notes: "Please leave package at the door"
        },
        {
            id: 2455,
            customer: "David Johnson",
            email: "david.j@example.com",
            date: "2025-04-10",
            amount: 89.95,
            status: "Pending",
            paymentMethod: "PayPal",
            items: [
                { id: 43, name: "Premium T-Shirt", price: 29.99, quantity: 2 },
                { id: 65, name: "Baseball Cap", price: 29.97, quantity: 1 }
            ],
            shippingAddress: "456 Maple Avenue, Portland, OR 97201",
            notes: ""
        },
        {
            id: 2454,
            customer: "Susan Williams",
            email: "susan.w@example.com",
            date: "2025-04-09",
            amount: 1299.99,
            status: "Pending",
            paymentMethod: "Credit Card",
            items: [
                { id: 99, name: "Premium Laptop", price: 1299.99, quantity: 1 }
            ],
            shippingAddress: "789 Oak Drive, Austin, TX 78701",
            notes: "Call before delivery"
        },
        {
            id: 2453,
            customer: "James Anderson",
            email: "james.a@example.com",
            date: "2025-04-09",
            amount: 152.97,
            status: "Pending",
            paymentMethod: "Debit Card",
            items: [
                { id: 23, name: "Running Shoes", price: 89.99, quantity: 1 },
                { id: 76, name: "Fitness Tracker", price: 62.98, quantity: 1 }
            ],
            shippingAddress: "321 Cedar Road, Chicago, IL 60601",
            notes: ""
        }
    ]);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Pending');

    // Handler for updating order status
    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));

        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
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

    return (
        <div className="container-fluid py-4" style={{
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            minHeight: '100vh'
        }}>
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
                    {selectedOrder ? (
                        // Order Detail View
                        <div className="card border-0" style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                            borderRadius: '16px'
                        }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center">
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            className="btn me-3"
                                            style={{
                                                background: 'rgba(236, 236, 236, 0.7)',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: 'none'
                                            }}
                                        >
                                            <BackIcon />
                                        </button>
                                        <h4 className="fw-bold mb-0">Order #{selectedOrder.id}</h4>
                                    </div>
                                    <StatusBadge status={selectedOrder.status} />
                                </div>

                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="card border-0 h-100" style={{
                                            background: 'rgba(236, 236, 236, 0.4)',
                                            borderRadius: '12px'
                                        }}>
                                            <div className="card-body p-4">
                                                <h5 className="fw-bold mb-3">Customer Information</h5>
                                                <p className="mb-2"><strong>Name:</strong> {selectedOrder.customer}</p>
                                                <p className="mb-2"><strong>Email:</strong> {selectedOrder.email}</p>
                                                <p className="mb-4"><strong>Order Date:</strong> {selectedOrder.date}</p>

                                                <h5 className="fw-bold mb-3">Shipping Information</h5>
                                                <p className="mb-2"><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
                                                {selectedOrder.notes && (
                                                    <p className="mb-0"><strong>Notes:</strong> {selectedOrder.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="card border-0 h-100" style={{
                                            background: 'rgba(236, 236, 236, 0.4)',
                                            borderRadius: '12px'
                                        }}>
                                            <div className="card-body p-4">
                                                <h5 className="fw-bold mb-3">Payment Information</h5>
                                                <p className="mb-2"><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                                                <p className="mb-2"><strong>Amount:</strong> ${selectedOrder.amount.toFixed(2)}</p>

                                                <h5 className="fw-bold mt-4 mb-3">Order Items</h5>
                                                {selectedOrder.items.map((item) => (
                                                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-2 pb-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                                        <div>
                                                            <p className="fw-bold mb-0">{item.name}</p>
                                                            <p className="text-muted mb-0">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="fw-bold mb-0">${item.price.toFixed(2)}</p>
                                                    </div>
                                                ))}

                                                <div className="d-flex justify-content-between mt-3">
                                                    <h5 className="fw-bold">Total:</h5>
                                                    <h5 className="fw-bold">${selectedOrder.amount.toFixed(2)}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5 className="fw-bold mb-3">Validation Actions</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'Validated')}
                                            className="btn"
                                            style={{
                                                background: selectedOrder.status === 'Validated' ? '#8e44ad' : 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                                color: 'white',
                                                fontWeight: '500',
                                                padding: '10px 20px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                opacity: selectedOrder.status === 'Validated' ? 0.7 : 1
                                            }}
                                            disabled={selectedOrder.status === 'Validated'}
                                        >
                                            {selectedOrder.status === 'Validated' ? 'Order Validated' : 'Validate Order'}
                                        </button>

                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'Processing')}
                                            className="btn"
                                            style={{
                                                background: selectedOrder.status === 'Processing' ? '#ffc107' : 'rgba(236, 236, 236, 0.7)',
                                                color: selectedOrder.status === 'Processing' ? 'black' : '#333',
                                                fontWeight: '500',
                                                padding: '10px 20px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                opacity: selectedOrder.status === 'Processing' ? 0.7 : 1
                                            }}
                                            disabled={selectedOrder.status === 'Processing'}
                                        >
                                            {selectedOrder.status === 'Processing' ? 'Processing' : 'Mark as Processing'}
                                        </button>

                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'Shipped')}
                                            className="btn"
                                            style={{
                                                background: selectedOrder.status === 'Shipped' ? '#17a2b8' : 'rgba(236, 236, 236, 0.7)',
                                                color: selectedOrder.status === 'Shipped' ? 'white' : '#333',
                                                fontWeight: '500',
                                                padding: '10px 20px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                opacity: selectedOrder.status === 'Shipped' ? 0.7 : 1
                                            }}
                                            disabled={selectedOrder.status === 'Shipped'}
                                        >
                                            {selectedOrder.status === 'Shipped' ? 'Shipped' : 'Mark as Shipped'}
                                        </button>

                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'Cancelled')}
                                            className="btn"
                                            style={{
                                                background: selectedOrder.status === 'Cancelled' ? '#dc3545' : 'rgba(236, 236, 236, 0.7)',
                                                color: selectedOrder.status === 'Cancelled' ? 'white' : '#333',
                                                fontWeight: '500',
                                                padding: '10px 20px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                opacity: selectedOrder.status === 'Cancelled' ? 0.7 : 1
                                            }}
                                            disabled={selectedOrder.status === 'Cancelled'}
                                        >
                                            {selectedOrder.status === 'Cancelled' ? 'Cancelled' : 'Cancel Order'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Orders List View
                        <div className="card border-0" style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                            borderRadius: '16px'
                        }}>
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-4">Order Validation</h4>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <div className="position-relative">
                                            <input
                                                type="text"
                                                className="form-control ps-5"
                                                placeholder="Search by customer name or order ID"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{
                                                    background: 'rgba(236, 236, 236, 0.7)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    padding: '12px 20px'
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                left: '15px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: '#6c757d'
                                            }}>
                                                <SearchIcon />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <select
                                            className="form-select"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            style={{
                                                background: 'rgba(236, 236, 236, 0.7)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '12px 20px'
                                            }}
                                        >
                                            <option value="All">All Statuses</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Validated">Validated</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Order ID</th>
                                                <th scope="col">Customer</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Amount</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.map((order) => (
                                                <tr key={order.id}>
                                                    <td>#{order.id}</td>
                                                    <td>{order.customer}</td>
                                                    <td>{order.date}</td>
                                                    <td>${order.amount.toFixed(2)}</td>
                                                    <td>
                                                        <StatusBadge status={order.status} />
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                onClick={() => setSelectedOrder(order)}
                                                                className="btn btn-sm"
                                                                style={{
                                                                    background: 'rgba(236, 236, 236, 0.7)',
                                                                    color: '#333',
                                                                    fontWeight: '500',
                                                                    borderRadius: '8px',
                                                                    border: 'none'
                                                                }}
                                                            >
                                                                View Details
                                                            </button>
                                                            {order.status === 'Pending' && (
                                                                <button
                                                                    onClick={() => updateOrderStatus(order.id, 'Validated')}
                                                                    className="btn btn-sm"
                                                                    style={{
                                                                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                                                        color: 'white',
                                                                        fontWeight: '500',
                                                                        borderRadius: '8px',
                                                                        border: 'none'
                                                                    }}
                                                                >
                                                                    Validate
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {filteredOrders.length === 0 && (
                                        <div className="text-center py-4">
                                            <p className="text-muted mb-0">No orders match your filter criteria</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderValidation;