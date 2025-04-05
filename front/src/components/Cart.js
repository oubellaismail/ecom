import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      size: 'Standard',
      color: 'Black',
      price: 149.99,
      image: '/images/7.jpg',
      quantity: 1,
    },
    {
      id: 2,
      name: 'Smart Watch Series 5',
      size: 'Medium',
      color: 'Silver',
      price: 299.99,
      image: '/images/6.jpg',
      quantity: 2,
    },
    {
      id: 3,
      name: 'Ultrabook Pro 15',
      size: '15-inch',
      color: 'Space Gray',
      price: 1099.99,
      image: '/images/5.jpg',
      quantity: 1,
    },
  ]);

  const handleDelete = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, value) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? {...item, quantity: parseInt(value)} : item
      )
    );
  };

  // Calculate totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const vat = subtotal * 0.1; // 10% VAT
  const discount = 45.99; // Example discount
  const total = subtotal + vat - discount;

  // Trash icon SVG
  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  // Percent icon SVG
  const PercentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19"></line>
      <circle cx="6.5" cy="6.5" r="2.5"></circle>
      <circle cx="17.5" cy="17.5" r="2.5"></circle>
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
              <div className="card border-0" style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}>
                <div className="card-body p-4">
                  <ul className="list-unstyled mb-0">
                    {items.map((item) => (
                      <li key={item.id} className="d-flex align-items-center gap-3 mb-4 pb-4" style={{
                        borderBottom: item.id !== items[items.length-1].id ? '1px solid rgba(0,0,0,0.1)' : 'none'
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
                            <span className="me-3 text-muted" style={{ fontSize: '0.9rem' }}>Size: {item.size}</span>
                            <span className="text-muted" style={{ fontSize: '0.9rem' }}>Color: {item.color}</span>
                          </div>
                          <span className="fw-bold" style={{ color: '#ff4d4d' }}>${item.price.toFixed(2)}</span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
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
            )}

            {items.length > 0 && (
              <div className="card border-0 mt-4" style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Order Summary</h5>
                  
                  <div className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">VAT (10%)</span>
                    <span>${vat.toFixed(2)}</span>
                  </div>
                  <div className="mb-2 d-flex justify-content-between" style={{ color: '#ff4d4d' }}>
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 pt-3 border-top d-flex justify-content-between">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold" style={{ fontSize: '1.1rem' }}>${total.toFixed(2)}</span>
                  </div>

                  <div className="mt-3 mb-4">
                    <span className="badge py-2 px-3" style={{
                      background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                      color: 'white',
                      fontSize: '0.85rem',
                      borderRadius: '8px'
                    }}>
                      <PercentIcon /> 2 Discounts Applied
                    </span>
                  </div>

                  <div className="d-grid gap-2">
                    <Link to="/checkout" className="btn" style={{
                      background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                      color: 'white',
                      fontWeight: '500',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                    }}>
                      Proceed to Checkout
                    </Link>
                    <Link to="/shop" className="btn btn-outline-dark" style={{
                      borderRadius: '12px',
                      padding: '0.75rem',
                      fontWeight: '500',
                      border: '1px solid #343a40'
                    }}>
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;