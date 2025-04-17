import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import addressService from '../api/addressService';
import orderService from '../api/orderService';
import countryService from '../api/countryService';
import cartService from '../api/cartService';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    region: '',
    phone: '',
    paymentMethod: 'cod' // Default to COD
  });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 15,
    tax: 0,
    discount: 0,
    total: 0
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load cart items from localStorage
        const items = cartService.getCart();
        if (!items || items.length === 0) {
          setError('Your cart is empty. Please add items before checkout.');
          return;
        }
        setCartItems(items);

        // Calculate order summary
        const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
        const tax = subtotal * 0.1;
        const total = subtotal + orderSummary.shipping + tax - orderSummary.discount;

        setOrderSummary(prev => ({
          ...prev,
          subtotal,
          tax,
          total
        }));

        // Load countries from API
        console.log('Fetching countries from API...');
        const countriesResponse = await countryService.getCountries();
        console.log('Countries API Response:', countriesResponse);

        if (countriesResponse && countriesResponse.data) {
          console.log('Raw countries data:', countriesResponse.data);
          // Convert object to array format
          const formattedCountries = Object.entries(countriesResponse.data).map(([code, name]) => ({
            code,
            name
          }));
          console.log('Formatted countries:', formattedCountries);
          setCountries(formattedCountries);
        } else {
          console.warn('No countries data received from API');
          setCountries([]);
        }

        // Load user's default address if exists
        if (user) {
          try {
            console.log('Fetching user default address...');
            const addressResponse = await addressService.getDefaultAddress();
            console.log('Address API Response:', addressResponse);

            if (addressResponse && addressResponse.data) {
              const { full_name, email, street, city, postal_code, country_code } = addressResponse.data;
              console.log('User address data:', {
                full_name, email, street, city, postal_code, country_code
              });
              setFormData(prev => ({
                ...prev,
                fullName: full_name || '',
                email: email || '',
                address: street || '',
                city: city || '',
                postalCode: postal_code || '',
                country: country_code || '',
                phone: addressResponse.data.phone_number || ''
              }));
            }
          } catch (addressError) {
            console.error('Error loading address:', addressError);
            // Continue without address data
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load checkout data. Please try again.');
      }
    };

    loadData();
  }, [orderSummary.shipping, orderSummary.discount, user]);

  // Add a useEffect to monitor countries state changes
  useEffect(() => {
    console.log('Countries state updated:', countries);
  }, [countries]);

  // Add a useEffect to monitor formData state changes
  useEffect(() => {
    console.log('FormData state updated:', formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    if (!user) {
      console.log('No user found, redirecting to signin');
      navigate('/signin');
      return;
    }

    if (cartItems.length === 0) {
      console.log('Cart is empty');
      setError('Your cart is empty. Please add items before checkout.');
      return;
    }

    // Validate required fields
    const requiredFields = {
      fullName: 'Full Name',
      email: 'Email',
      address: 'Address',
      city: 'City',
      region: 'Region/State',
      postalCode: 'Postal Code',
      phone: 'Phone Number',
      country: 'Country',
      paymentMethod: 'Payment Method'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !formData[field])
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Starting checkout process...');

      // Prepare payment data
      const paymentData = {
        amount_before_discount: orderSummary.subtotal,
        total_amount: orderSummary.total,
        order_lines: cartItems.map(item => ({
          product_item_id: item.id,
          qty: item.quantity
        })),
        shipping_address: {
          address_line1: formData.address,
          address_line2: '',
          city: formData.city,
          region: formData.region,
          postal_code: formData.postalCode,
          phone_number: formData.phone,
          country_code: formData.country
        },
        payment_method_code: formData.paymentMethod,
        notes: formData.notes || ''
      };

      console.log('Submitting payment data:', paymentData);

      // Initiate payment
      const paymentResponse = await orderService.initiatePayment(paymentData);
      console.log('Payment initiation response:', paymentResponse);

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || 'Failed to initiate payment');
      }

      // Handle different payment methods
      if (formData.paymentMethod === 'cod') {
        console.log('Processing COD payment');
        // For COD, no redirect needed
        navigate(`/checkout/success?payment_id=${paymentResponse.data.payment_id}`);
      } else if (formData.paymentMethod === 'paypal') {
        console.log('Processing PayPal payment');
        // For PayPal, redirect to approval URL
        if (paymentResponse.data.redirect_url) {
          console.log('Redirecting to PayPal:', paymentResponse.data.redirect_url);
          // Store payment ID in localStorage for later use
          localStorage.setItem('pending_payment_id', paymentResponse.data.payment_id);
          // Redirect to PayPal
          window.location.href = paymentResponse.data.redirect_url;
        } else {
          throw new Error('No PayPal redirect URL provided');
        }
      } else if (formData.paymentMethod === 'stripe') {
        console.log('Processing Stripe payment');
        // For Stripe, redirect to payment page
        if (paymentResponse.data.redirect_url) {
          console.log('Redirecting to Stripe:', paymentResponse.data.redirect_url);
          localStorage.setItem('pending_payment_id', paymentResponse.data.payment_id);
          window.location.href = paymentResponse.data.redirect_url;
        } else {
          throw new Error('No Stripe redirect URL provided');
        }
      }

      // Clear cart
      cartService.clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.message || 'Error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5" style={{
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
    }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2">Checkout</h2>
          <p className="text-muted">Complete your purchase</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

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
                        Region/State
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        placeholder="Region/State"
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

                  <div className="row">
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
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
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
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="card border-0 mt-4" style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-4">Payment Method</h5>

                      <div className="mb-3">
                        <div className="form-check d-flex align-items-center mb-3 p-3" style={{
                          borderRadius: '12px',
                          background: formData.paymentMethod === 'cod' ? 'rgba(255, 77, 77, 0.1)' : 'rgba(236, 236, 236, 0.7)',
                          border: formData.paymentMethod === 'cod' ? '1px solid rgba(255, 77, 77, 0.3)' : 'none'
                        }}>
                          <input
                            className="form-check-input me-3"
                            type="radio"
                            name="paymentMethod"
                            id="cod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label d-flex align-items-center w-100" htmlFor="cod">
                            <div>
                              <div className="fw-bold">Cash on Delivery (COD)</div>
                              <div className="text-muted" style={{ fontSize: '0.9rem' }}>Pay when you receive your order</div>
                            </div>
                          </label>
                        </div>

                        <div className="form-check d-flex align-items-center mb-3 p-3" style={{
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
                              <div className="text-muted" style={{ fontSize: '0.9rem' }}>Pay securely with PayPal</div>
                            </div>
                            <div className="ms-auto">
                              <img src="/paypal-logo.png" alt="PayPal" style={{ height: '25px' }} />
                            </div>
                          </label>
                        </div>

                        <div className="form-check d-flex align-items-center p-3" style={{
                          borderRadius: '12px',
                          background: formData.paymentMethod === 'stripe' ? 'rgba(255, 77, 77, 0.1)' : 'rgba(236, 236, 236, 0.7)',
                          border: formData.paymentMethod === 'stripe' ? '1px solid rgba(255, 77, 77, 0.3)' : 'none'
                        }}>
                          <input
                            className="form-check-input me-3"
                            type="radio"
                            name="paymentMethod"
                            id="stripe"
                            value="stripe"
                            checked={formData.paymentMethod === 'stripe'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label d-flex align-items-center w-100" htmlFor="stripe">
                            <div>
                              <div className="fw-bold">Credit / Debit Card</div>
                              <div className="text-muted" style={{ fontSize: '0.9rem' }}>Pay securely with your card</div>
                            </div>
                            <div className="ms-auto">
                              <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="25" rx="4" fill="#1A1F71" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.3 16.0H13.9L12.8 12.9C12.7 12.6 12.6 12.4 12.4 12.2C12 11.8 11.4 11.5 10.7 11.5C10.6 11.5 10.4 11.5 10.3 11.5L8.3 16.0H6.8L9.9 9.0H11.4L12.4 11.4C12.7 12.0 12.9 12.6 13.1 13L15.3 16.0Z" fill="#FFFFFF" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M16.4 13.4C16.4 11.9 17.6 10.8 19.1 10.8C20.6 10.8 21.8 11.9 21.8 13.4C21.8 14.9 20.6 16.0 19.1 16.0C17.6 16.0 16.4 14.9 16.4 13.4Z" fill="#FFFFFF" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M27.6 10.9L26.2 14.0C26.0 14.4 25.8 14.9 25.6 15.3L22.9 10.9H21.5L25.2 16.0H26.7L30.4 10.9H28.9H27.6Z" fill="#FFFFFF" />
                              </svg>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 mt-4"
                    style={{
                      background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                      color: 'white',
                      fontWeight: '500',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                    }}
                    disabled={loading || cartItems.length === 0}
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right column: Order Summary */}
          <div className="col-lg-5">
            <div className="card border-0" style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Order Summary</h5>

                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex align-items-center mb-3">
                    <div style={{ width: '60px', height: '60px', marginRight: '1rem' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.name}</h6>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Qty: {item.quantity}</span>
                        <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-top pt-3 mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span>${orderSummary.shipping.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tax (10%)</span>
                    <span>${orderSummary.tax.toFixed(2)}</span>
                  </div>
                  {orderSummary.discount > 0 && (
                    <div className="d-flex justify-content-between mb-2" style={{ color: '#ff4d4d' }}>
                      <span>Discount</span>
                      <span>-${orderSummary.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between fw-bold mt-3 pt-2 border-top">
                    <span>Total</span>
                    <span>${orderSummary.total.toFixed(2)}</span>
                  </div>
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