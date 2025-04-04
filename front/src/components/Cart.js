import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Ajoute ceci

const Cart = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Basic Tee 6-Pack',
      size: 'XXS',
      color: 'White',
      image:
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=830&q=80',
      quantity: 1,
    },
    {
      id: 2,
      name: 'Basic Tee 6-Pack',
      size: 'XXS',
      color: 'White',
      image:
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=830&q=80',
      quantity: 1,
    },
    {
      id: 3,
      name: 'Basic Tee 6-Pack',
      size: 'XXS',
      color: 'White',
      image:
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=830&q=80',
      quantity: 1,
    },
  ]);

  const handleDelete = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = 250;
  const vat = 25;
  const discount = 20;
  const total = subtotal + vat - discount;

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <header className="text-center mb-4">
            <h2 className="fw-bold">Your Shopping Cart</h2>
          </header>

          {items.length === 0 ? (
            <p className="text-center">You currently have no items in your cart.</p>
          ) : (
            <>
              <ul className="list-unstyled">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded object-fit-cover"
                      style={{ width: '64px', height: '64px' }}
                    />
                    <div>
                      <h5 className="mb-1">{item.name}</h5>
                      <small className="text-muted d-block">Size: {item.size}</small>
                      <small className="text-muted">Color: {item.color}</small>
                    </div>
                    <div className="ms-auto d-flex align-items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        defaultValue={item.quantity}
                        className="form-control form-control-sm text-center"
                        style={{ width: '60px' }}
                      />
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4 border-top">
                <div className="text-end">
                  <div className="mb-2 d-flex justify-content-between">
                    <span>Subtotal</span>
                    <strong>£{subtotal}</strong>
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <span>VAT</span>
                    <strong>£{vat}</strong>
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <span>Discount</span>
                    <strong>-£{discount}</strong>
                  </div>
                  <div className="mb-3 d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <strong>£{total}</strong>
                  </div>

                  <div className="mb-3">
                    <span className="badge text-bg-info">
                      <i className="bi bi-percent me-1"></i>2 Discounts Applied
                    </span>
                  </div>

                  {/* ✅ Remplacement du bouton */}
                  <Link to="/checkout" className="btn btn-dark">
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cart;
