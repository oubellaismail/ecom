import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="col">
      <div className="card h-100 border-0" style={{
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease',
        boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
      }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img 
            src={product.image} 
            className="card-img-top" 
            alt={product.name}
            style={{ height: '250px', objectFit: 'cover' }}
          />
          {product.discount && (
            <span className="position-absolute top-0 start-0 m-3 badge" style={{
              background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
              fontSize: '0.85rem',
              padding: '8px 12px',
              borderRadius: '8px'
            }}>
              {product.discount}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="position-absolute top-0 end-0 m-3 badge bg-success" style={{
              fontSize: '0.85rem',
              padding: '8px 12px',
              borderRadius: '8px'
            }}>
              NEW
            </span>
          )}
          <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-center pb-3 quick-actions" style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }}>
            <button className="btn btn-light btn-sm mx-1 rounded-circle" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-heart"></i>
            </button>
            <button className="btn btn-light btn-sm mx-1 rounded-circle" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-cart-plus"></i>
            </button>
            <button className="btn btn-light btn-sm mx-1 rounded-circle" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-eye"></i>
            </button>
          </div>
        </div>
        <div className="card-body">
          <p className="card-subtitle mb-1 text-muted">{product.category}</p>
          <h5 className="card-title">{product.name}</h5>
          <div className="d-flex align-items-center mb-2">
            <div className="me-2">
              {product.discountPrice ? (
                <>
                  <span className="fw-bold me-2" style={{ color: '#ff4d4d' }}>${product.discountPrice}</span>
                  <span className="text-muted text-decoration-line-through">${product.price}</span>
                </>
              ) : (
                <span className="fw-bold">${product.price}</span>
              )}
            </div>
            {product.rating && (
              <div className="ms-auto d-flex align-items-center">
                <span className="me-1">{product.rating}</span>
                <i className="bi bi-star-fill" style={{ color: '#f9cb28' }}></i>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      category: "Electronics",
      price: 199.99,
      discountPrice: 149.99,
      discount: 25,
      rating: 4.8,
      image: '/images/7.jpg',
      isNew: false
    },
    {
      id: 2,
      name: "Smart Watch Series 5",
      category: "Wearables",
      price: 299.99,
      discountPrice: null,
      discount: null,
      rating: 4.5,
      image: '/images/6.jpg',
      isNew: true
    },
    {
      id: 3,
      name: "Ultrabook Pro 15",
      category: "Computers",
      price: 1299.99,
      discountPrice: 1099.99,
      discount: 15,
      rating: 4.9,
      image:'/images/5.jpg',
      isNew: false
    },
    {
      id: 4,
      name: "Smart Home Camera",
      category: "Smart Home",
      price: 89.99,
      discountPrice: null,
      discount: null,
      rating: 4.3,
      image: '/images/4.jpg',
      isNew: true
    }
  ];

  return (
    <section className="py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-8">
            <h2 className="fw-bold">Featured Products</h2>
            <p className="text-muted">Discover our most popular items</p>
          </div>
          <div className="col-md-4 d-flex justify-content-md-end align-items-center">
            <Link to="/shop" className="btn" style={{
              background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
              color: 'white',
              fontWeight: '500',
              padding: '0.5rem 1.25rem',
              borderRadius: '25px',
              boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
            }}>
              View All Products
            </Link>
          </div>
        </div>
        
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;