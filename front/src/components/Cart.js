import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cartService from '../api/cartService';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    try {
      const cartItems = cartService.getCart();
      setItems(cartItems);
      setError('');
    } catch (err) {
      setError('Error loading cart items. Please refresh the page.');
      console.error('Cart loading error:', err);
    }
  };

  const handleDelete = (itemId) => {
    try {
      const result = cartService.removeFromCart(itemId);
      if (result.success) {
        setItems(result.cart);
        setError('');
      } else {
        setError(result.error || 'Error removing item. Please try again.');
      }
    } catch (err) {
      setError('Error removing item. Please try again.');
      console.error('Delete error:', err);
    }
  };

  const handleQuantityChange = (itemId, value) => {
    try {
      const qty = parseInt(value);
      if (isNaN(qty) || qty < 1) return;

      const result = cartService.updateQuantity(itemId, qty);
      if (result.success) {
        setItems(result.cart);
        setError('');
      } else {
        setError(result.error || 'Error updating quantity. Please try again.');
      }
    } catch (err) {
      setError('Error updating quantity. Please try again.');
      console.error('Quantity update error:', err);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault(); // Prevent form submission and page refresh

    if (!coupon.trim()) {
      setCouponMessage('Please enter a coupon code');
      setCouponSuccess(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setCouponMessage('');

      const result = await cartService.validateCoupon(coupon);
      console.log('Coupon validation result:', result); // Debug log

      if (result.success && result.data) {
        const discountPercentage = parseFloat(result.data.discount_percentage);
        console.log('Discount percentage:', discountPercentage); // Debug log

        if (isNaN(discountPercentage)) {
          throw new Error('Invalid discount percentage received');
        }

        const discountAmount = (subtotal * discountPercentage) / 100;
        console.log('Discount amount:', discountAmount); // Debug log

        setDiscount(discountAmount);
        setCouponMessage(`Coupon "${result.data.code}" applied! ${discountPercentage}% discount ($${discountAmount.toFixed(2)})`);
        setCouponSuccess(true);
      } else {
        setDiscount(0);
        setCouponMessage(result.message || 'Invalid coupon code');
        setCouponSuccess(false);
      }
    } catch (error) {
      console.error('Coupon error:', error); // Debug log
      setDiscount(0);
      setCouponMessage(error.message || 'Error applying coupon. Please try again.');
      setCouponSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty. Please add items before proceeding to checkout.');
      return;
    }

    navigate('/checkout');
  };

  // Totals
  const subtotal = items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  const vat = subtotal * 0.1;
  const total = subtotal + vat - discount;

  // Trash icon SVG
  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  return (
    <section className="py-5" style={{
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
    }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2">Your Shopping Cart</h2>
          <p className="text-muted">Review your items before checkout</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {error && <div className="alert alert-danger">{error}</div>}

            {items.length === 0 ? (
              <div className="card border-0 text-center p-5" style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}>
                <h5>Your cart is empty</h5>
                <p className="text-muted mb-4">Looks like you haven't added any products to your cart yet.</p>
                <div className="text-center">
                  <Link to="/shop" className="btn" style={{
                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                    color: 'white',
                    fontWeight: '500',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                  }}>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="card border-0" style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="card-body p-4">
                    <ul className="list-unstyled mb-0">
                      {items.map((item) => (
                        <li key={item.id} className="d-flex align-items-center gap-3 mb-4 pb-4" style={{
                          borderBottom: item.id !== items[items.length - 1].id ? '1px solid rgba(0,0,0,0.1)' : 'none'
                        }}>
                          <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="rounded"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                              }}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="mb-1 fw-bold">{item.name}</h5>
                            <div className="d-flex mb-2">
                              <span className="me-3 text-muted" style={{ fontSize: '0.9rem' }}>category: {item.size}</span>
                            </div>
                            <span className="fw-bold" style={{ color: '#ff4d4d' }}>${item.price ? parseFloat(item.price).toFixed(2) : '0.00'}</span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <div className="input-group" style={{ width: '100px' }}>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                className="form-control text-center"
                                style={{
                                  padding: '0.5rem',
                                  borderRadius: '8px',
                                  background: 'rgba(236, 236, 236, 0.7)',
                                  border: 'none'
                                }}
                              />
                            </div>
                            <button
                              className="btn p-2 rounded-circle"
                              onClick={() => handleDelete(item.id)}
                              style={{
                                background: 'rgba(236, 236, 236, 0.7)',
                                color: '#ff4d4d',
                                border: 'none'
                              }}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="card border-0 mt-4" style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="card-body p-4">
                    <form onSubmit={handleApplyCoupon} className="mb-4">
                      <label className="form-label fw-semibold">Have a coupon?</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          placeholder="Enter coupon code"
                        />
                        <button
                          type="submit"
                          className="btn"
                          style={{
                            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                            color: 'white',
                            fontWeight: '500'
                          }}
                          disabled={loading}
                        >
                          {loading ? 'Applying...' : 'Apply'}
                        </button>
                      </div>
                      {couponMessage && (
                        <div className={`mt-2 ${couponSuccess ? 'text-success' : 'text-danger'}`}>
                          {couponMessage}
                        </div>
                      )}
                    </form>

                    <h5 className="fw-bold mb-3">Order Summary</h5>

                    <div className="mb-2 d-flex justify-content-between">
                      <span className="text-muted">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="mb-2 d-flex justify-content-between">
                      <span className="text-muted">VAT (10%)</span>
                      <span>${vat.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <>
                        <div className="mb-2 d-flex justify-content-between text-success">
                          <span>Discount Applied</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                        <div className="mb-2 d-flex justify-content-between text-success">
                          <span>New Subtotal</span>
                          <span>${(subtotal - discount).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    <div className="mb-3 d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="btn w-100"
                      style={{
                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                        color: 'white',
                        fontWeight: '500',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                      }}
                      disabled={loading || items.length === 0}
                    >
                      {loading ? 'Processing...' : 'Proceed to Checkout'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;