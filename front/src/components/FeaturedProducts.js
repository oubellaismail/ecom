import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="col">
      <div className="card border-0 h-100 product-card">
        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
          {/* Image container */}
          <div className="position-relative card-img-container">
            <img 
              src={product.image} 
              className="card-img-top product-img" 
              alt={product.name}
            />
            
            {/* Badge overlays */}
            {product.discount && (
              <span className="position-absolute discount-badge">
                {product.discount}% OFF
              </span>
            )}
            
            {product.isNew && (
              <span className="position-absolute new-badge">
                NEW
              </span>
            )}
          </div>

          {/* Product info */}
          <div className="card-body">
            <p className="card-subtitle mb-1 text-muted">{product.category}</p>
            <h3 className="card-title product-title">{product.name}</h3>
            
            <div className="d-flex align-items-center justify-content-between mt-2">
              <div className="price-container">
                {product.discountPrice ? (
                  <>
                    <span className="sale-price me-2">${product.discountPrice}</span>
                    <span className="original-price text-decoration-line-through">${product.price}</span>
                  </>
                ) : (
                  <span className="regular-price">${product.price}</span>
                )}
              </div>
              
              {product.rating && (
                <div className="rating-container">
                  <span className="rating-text me-1">{product.rating}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFB800" className="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </Link>
        
        {/* Quick action buttons */}
        <div className="action-buttons">
          <button 
            className="action-btn wishlist-btn"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Added to wishlist:', product.name);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
            </svg>
          </button>
          
          <button 
            className="action-btn cart-btn"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Added to cart:', product.name);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cart-plus" viewBox="0 0 16 16">
              <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z"/>
              <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </button>
          
          <Link 
            to={`/product/${product.id}`}
            className="action-btn view-btn"
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
            </svg>
          </Link>
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
    <section className="featured-products py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-8">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Discover our most popular items</p>
          </div>
          <div className="col-md-4 d-flex justify-content-md-end align-items-center">
            <Link 
              to="/shop" 
              className="btn ms-2" 
              style={{
                background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                color: 'white',
                fontWeight: '500',
                padding: '0.5rem 1.25rem',
                borderRadius: '25px',
                boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 77, 77, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 77, 77, 0.2)';
              }}
            >
              View All Products
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right ms-2" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .featured-products {
          background-color: #f8f9fa;
        }
        
        .section-title {
          font-weight: 700;
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .section-subtitle {
          color: #6c757d;
          font-size: 1rem;
        }
        
        .product-card {
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          position: relative;
        }
        
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
        }
        
        .card-img-container {
          overflow: hidden;
          height: 240px;
        }
        
        .product-img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .product-card:hover .product-img {
          transform: scale(1.08);
        }
        
        .discount-badge {
          top: 10px;
          left: 10px;
          background: linear-gradient(90deg, #ff4d4d, #f9cb28);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          z-index: 2;
        }
        
        .new-badge {
          top: 10px;
          right: 10px;
          background-color: #4CAF50;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          z-index: 2;
        }
        
        .product-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          transition: color 0.3s ease;
        }
        
        .product-card:hover .product-title {
          color: #ff4d4d;
        }
        
        .sale-price {
          font-weight: 700;
          font-size: 1.1rem;
          color: #ff4d4d;
        }
        
        .original-price {
          color: #adb5bd;
          font-size: 0.9rem;
        }
        
        .regular-price {
          font-weight: 700;
          font-size: 1.1rem;
          color: #343a40;
        }
        
        .rating-container {
          display: flex;
          align-items: center;
          background-color: #fff9e6;
          padding: 0.25rem 0.5rem;
          border-radius: 50px;
        }
        
        .rating-text {
          font-weight: 600;
          color: #ffb800;
          font-size: 0.9rem;
        }
        
        .action-buttons {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          padding-bottom: 1rem;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
          z-index: 3;
        }
        
        .product-card:hover .action-buttons {
          opacity: 1;
          transform: translateY(0);
        }
        
        .action-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 5px;
          color: #343a40;
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .action-btn:hover {
          background-color: #ff4d4d;
          color: white;
          transform: translateY(-3px);
        }
        
        .wishlist-btn {
          transition-delay: 0s;
        }
        
        .cart-btn {
          transition-delay: 0.1s;
        }
        
        .view-btn {
          transition-delay: 0.2s;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;