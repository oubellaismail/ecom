import React from 'react';

const Checkout = () => {
  const items = [
    {
      id: 1,
      name: 'Basic Tee 6-Pack',
      price: 50,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Cotton Hoodie',
      price: 70,
      quantity: 2,
    },
  ];

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center fw-bold">Checkout</h2>

      <div className="row">
        {/* Colonne gauche : Formulaire */}
        <div className="col-md-7">
          <h4 className="mb-3">Shipping Information</h4>
          <form>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="John Doe" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input type="text" className="form-control" placeholder="123 Main St" required />
            </div>
            <div className="mb-3">
              <label className="form-label">City</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Postal Code</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Country</label>
              <input type="text" className="form-control" required />
            </div>
          </form>
        </div>

        {/* Colonne droite : Résumé de la commande */}
        <div className="col-md-5">
          <h4 className="mb-3">Order Summary</h4>
          <ul className="list-group mb-3">
            {items.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between">
                <div>
                  <h6 className="my-0">{item.name}</h6>
                  <small className="text-muted">Qty: {item.quantity}</small>
                </div>
                <span>£{item.price * item.quantity}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between">
              <span>Shipping</span>
              <strong>£{shipping}</strong>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span>Total</span>
              <strong>£{total}</strong>
            </li>
          </ul>
          <button className="btn btn-primary w-100">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
