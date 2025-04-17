import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import orderService from '../api/orderService';

const CheckoutSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const handlePaymentCallback = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const paymentId = searchParams.get('payment_id') || localStorage.getItem('pending_payment_id');
                const token = searchParams.get('token');
                const payerId = searchParams.get('PayerID');

                if (!paymentId) {
                    throw new Error('No payment information found');
                }

                // Clear the stored payment ID
                localStorage.removeItem('pending_payment_id');

                // Handle payment callback
                const response = await orderService.handlePaymentCallback(paymentId, token, payerId);

                if (!response.success) {
                    throw new Error(response.message || 'Payment verification failed');
                }

                setOrder(response.data);
            } catch (error) {
                console.error('Payment callback error:', error);
                setError(error.message || 'Failed to verify payment');
            } finally {
                setLoading(false);
            }
        };

        handlePaymentCallback();
    }, [location]);

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Verifying your payment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Payment Verification Failed</h4>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/cart')}
                        >
                            Return to Cart
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <div className="text-center mb-4">
                                <div className="mb-3">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#28a745" />
                                    </svg>
                                </div>
                                <h2 className="fw-bold">Order Confirmed!</h2>
                                <p className="text-muted">Thank you for your purchase</p>
                            </div>

                            {order && (
                                <div className="mb-4">
                                    <h5 className="fw-bold mb-3">Order Details</h5>
                                    <div className="mb-2">
                                        <span className="text-muted">Order Number:</span>
                                        <span className="ms-2 fw-bold">{order.order_number}</span>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-muted">Total Amount:</span>
                                        <span className="ms-2 fw-bold">${order.total_amount.toFixed(2)}</span>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-muted">Status:</span>
                                        <span className="ms-2 fw-bold">{order.status}</span>
                                    </div>
                                </div>
                            )}

                            <div className="text-center">
                                <button
                                    className="btn btn-primary me-2"
                                    onClick={() => navigate('/orders')}
                                >
                                    View Orders
                                </button>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => navigate('/')}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess; 