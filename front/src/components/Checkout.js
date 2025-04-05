import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'credit'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process checkout logic here
    console.log('Order submitted:', formData);
  };

  // Sample order items
  const items = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 149.99,
      quantity: 1,
      image: '/images/7.jpg'
    },
    {
      id: 2,
      name: 'Smart Watch Series 5',
      price: 299.99,
      quantity: 2,
      image: '/images/6.jpg'
    },
  ];

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 15;
  const tax = subtotal * 0.1; // 10% tax
  const discount = 45.99;
  const total = subtotal + shipping + tax - discount;

  return (
    <section className="py-5" style={{
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
    }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2">Checkout</h2>
          <p className="text-muted">Complete your purchase</p>
        </div>

        <div className="row g-4">
          {/* Left column: Form */}
          <div className="col-lg-7">
            <div className="card border-0 mb-4" style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Shipping Information</h5>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe" 
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'rgba(236, 236, 236, 0.7)',
                          border: 'none'
                        }}
                        required 
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email"
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
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                      Address
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St" 
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'rgba(236, 236, 236, 0.7)',
                        border: 'none'
                      }}
                      required 
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        City
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'rgba(236, 236, 236, 0.7)',
                          border: 'none'
                        }}
                        required 
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        Postal Code
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Postal Code"
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'rgba(236, 236, 236, 0.7)',
                          border: 'none'
                        }}
                        required 
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                      Country
                    </label>
                    <select 
                      className="form-select" 
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'rgba(236, 236, 236, 0.7)',
                        border: 'none'
                      }}
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </form>
              </div>
            </div>

            <div className="card border-0" style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Payment Method</h5>
                
                <div className="mb-3">
                  <div className="form-check d-flex align-items-center mb-3 p-3" style={{
                    borderRadius: '12px',
                    background: formData.paymentMethod === 'credit' ? 'rgba(255, 77, 77, 0.1)' : 'rgba(236, 236, 236, 0.7)',
                    border: formData.paymentMethod === 'credit' ? '1px solid rgba(255, 77, 77, 0.3)' : 'none'
                  }}>
                    <input 
                      className="form-check-input me-3" 
                      type="radio" 
                      name="paymentMethod" 
                      id="creditCard" 
                      value="credit"
                      checked={formData.paymentMethod === 'credit'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label d-flex align-items-center w-100" htmlFor="creditCard">
                      <div>
                        <div className="fw-bold">Credit / Debit Card</div>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>Pay securely with your card</div>
                      </div>
                      <div className="ms-auto">
                        <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="40" height="25" rx="4" fill="#1A1F71"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M15.3 16.0H13.9L12.8 12.9C12.7 12.6 12.6 12.4 12.4 12.2C12 11.8 11.4 11.5 10.7 11.5C10.6 11.5 10.4 11.5 10.3 11.5L8.3 16.0H6.8L9.9 9.0H11.4L12.4 11.4C12.7 12.0 12.9 12.6 13.1 13L15.3 16.0Z" fill="#FFFFFF"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.4 13.4C16.4 11.9 17.6 10.8 19.1 10.8C20.6 10.8 21.8 11.9 21.8 13.4C21.8 14.9 20.6 16.0 19.1 16.0C17.6 16.0 16.4 14.9 16.4 13.4Z" fill="#FFFFFF"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M27.6 10.9L26.2 14.0C26.0 14.4 25.8 14.9 25.6 15.3L22.9 10.9H21.5L25.2 16.0H26.7L30.4 10.9H28.9H27.6Z" fill="#FFFFFF"/>
                        </svg>
                      </div>
                    </label>
                  </div>
                  
                  <div className="form-check d-flex align-items-center p-3" style={{
                    borderRadius: '12px',
                    background: formData.paymentMethod === 'paypal' ? 'rgba(255, 77, 77, 0.1)' : 'rgba(236, 236, 236, 0.7)',
                    border: formData.paymentMethod === 'paypal' ? '1px solid rgba(255, 77, 77, 0.3)' : 'none'
                  }}>
                    <input 
                      className="form-check-input me-3" 
                      type="radio" 
                      name="paymentMethod" 
                      id="paypal" 
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label d-flex align-items-center w-100" htmlFor="paypal">
                      <div>
                        <div className="fw-bold">PayPal</div>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>Pay with your PayPal account</div>
                      </div>
                      <div className="ms-auto">
                        <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="40" height="25" rx="4" fill="#FFFFFF"/>
                          <path d="M29.4 11.2C29.4 13.3 28.1 14.7 26.1 14.7H24.5C24.3 14.7 24.1 14.9 24.1 15.1L23.6 18.1C23.6 18.2 23.5 18.4 23.3 18.4H20.9C20.7 18.4 20.6 18.3 20.6 18.1L22.2 7.5C22.2 7.3 22.4 7.2 22.6 7.2H26.6C28.2 7.2 29.4 8.6 29.4 10.3V11.2Z" fill="#003087"/>
                          <path d="M16.4 11.2C16.4 13.3 15.1 14.7 13.1 14.7H11.5C11.3 14.7 11.1 14.9 11.1 15.1L10.6 18.1C10.6 18.2 10.5 18.4 10.3 18.4H7.9C7.7 18.4 7.6 18.3 7.6 18.1L9.2 7.5C9.2 7.3 9.4 7.2 9.6 7.2H13.6C15.2 7.2 16.4 8.6 16.4 10.3V11.2Z" fill="#0070E0"/>
                        </svg>
                      </div>
                    </label>
                  </div>
                </div>
                
                {formData.paymentMethod === 'credit' && (
                  <div className="mt-4">
                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        Card Number
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="1234 5678 9012 3456"
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'rgba(236, 236, 236, 0.7)',
                          border: 'none'
                        }} 
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                          Expiration Date
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="MM/YY"
                          style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: 'rgba(236, 236, 236, 0.7)',
                            border: 'none'
                          }} 
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                          CVV
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="123"
                          style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: 'rgba(236, 236, 236, 0.7)',
                            border: 'none'
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column: Order summary */}
          <div className="col-lg-5">
            <div className="card border-0 mb-4" style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              position: 'sticky',
              top: '20px'
            }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Order Summary</h5>
                
                {items.map((item) => (
                  <div key={item.id} className="d-flex align-items-center mb-3 pb-3" style={{
                    borderBottom: item.id !== items[items.length-1].id ? '1px solid rgba(0,0,0,0.1)' : 'none'
                  }}>
                    <div style={{ width: '60px', height: '60px' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <div className="ms-auto fw-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                <div className="mt-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3" style={{ color: '#ff4d4d' }}>
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between pt-3 border-top">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold" style={{ fontSize: '1.2rem' }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button 
                    type="submit" 
                    className="btn w-100 mb-3"
                    onClick={handleSubmit}
                    style={{
                      background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                      color: 'white',
                      fontWeight: '500',
                      padding: '12px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                    }}
                  >
                    Place Order
                  </button>
                  <Link to="/cart" className="btn btn-outline-dark w-100" style={{
                    borderRadius: '12px',
                    padding: '12px',
                    fontWeight: '500'
                  }}>
                    Return to Cart
                  </Link>
                </div>
                
                <div className="mt-4 d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span className="ms-2 text-muted" style={{ fontSize: '0.9rem' }}>
                    Your personal data will be used to process your order, support
                    your experience, and for other purposes described in our privacy policy.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;