import React from 'react';
import { Link } from 'react-router-dom';

const NewArrivals = () => {
  const arrivals = [
    {
      id: 1,
      name: "kaliber kronos combat boot",
      category: "Foot wear",
      price: 699.99,
      image: '/images/c2.png',
      dateAdded: "3 days ago"
    },
    {
      id: 2,
      name: "garret superscanner v",
      category: "Detectors",
      price: 129.99,
      image: '/images/b2.png',
      dateAdded: "1 week ago"
    },
    {
      id: 3,
      name: "2l water bottle pouch",
      category: "water bottle ",
      price: 849.99,
      image: '/images/b3.png',
      dateAdded: "5 days ago"
    }
  ];

  return (
    <section className="py-5" style={{
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
    }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2">New Arrivals</h2>
          <p className="text-muted">Be the first to check out our latest products</p>
        </div>

        <div className="row">
          {arrivals.map((item, index) => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="card border-0 h-100" style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                transform: index === 1 ? 'translateY(-20px)' : 'none'
              }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge" style={{
                      background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                      fontSize: '0.85rem',
                      padding: '8px 12px',
                      borderRadius: '8px'
                    }}>
                      NEW
                    </span>
                  </div>
                  <div className="position-absolute bottom-0 start-0 m-3">
                    <span className="badge bg-dark opacity-75" style={{
                      fontSize: '0.85rem',
                      padding: '8px 12px',
                      borderRadius: '8px'
                    }}>
                      Added {item.dateAdded}
                    </span>
                  </div>
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="mb-auto">
                    <p className="card-subtitle mb-1 text-muted">{item.category}</p>
                    <h5 className="card-title fw-bold">{item.name}</h5>
                    <p className="fw-bold mb-3">${item.price}</p>
                  </div>
                  <div className="d-grid">
                    <Link
                      to={`/product/${item.id}`}
                      className="btn"
                      style={{
                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                        color: 'white',
                        fontWeight: '500',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link to="//product/:id" className="btn btn-outline-dark" style={{
            borderRadius: '25px',
            padding: '0.5rem 1.5rem',
            fontWeight: '500'
          }}>
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;