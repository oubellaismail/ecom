import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="col">
      <div className="card border-0 h-100 product-card">
        <Link to="#" className="text-decoration-none text-dark">
          <div className="position-relative card-img-container">
            <img
              src={product.image}
              className="card-img-top product-img"
              alt={product.name}
            />
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
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </Link>
        <div className="action-buttons">
          <button className="action-btn wishlist-btn" onClick={(e) => e.stopPropagation()}>
            <i className="bi bi-heart"></i>
          </button>
          <button className="action-btn cart-btn" onClick={(e) => e.stopPropagation()}>
            <i className="bi bi-cart-plus"></i>
          </button>
          <Link to="#" className="action-btn view-btn" onClick={(e) => e.stopPropagation()}>
            <i className="bi bi-eye"></i>
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
      name: "TX-8 Two-Way Radio",
      category: "Communication",
      price: 89.99,
      discountPrice: 69.99,
      discount: 22,
      rating: 4.7,
      image: '/images/a1.png',
      isNew: true
    },
    {
      id: 2,
      name: "ZA-758 PMR UHF HANDHELD TRANSCEIVER",
      category: "Communication",
      price: 129.99,
      discountPrice: null,
      discount: null,
      rating: 4.5,
      image: '/images/a2.png',
      isNew: false
    },
    {
      id: 3,
      name: "YJ-2820",
      category: "Spot lights",
      price: 39.99,
      discountPrice: 29.99,
      discount: 25,
      rating: 4.8,
      image: '/images/a3.png',
      isNew: false
    },
    {
      id: 4,
      name: "za-457 EXTREME BRIGHT FLASHLIGHT",
      category: "FLASHLIGHT",
      price: 199.99,
      discountPrice: null,
      discount: null,
      rating: 4.6,
      image: '/images/a4.png',
      isNew: true
    }
  ];

  return (
    <section className="featured-products py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-8">
            <h2 className="section-title">Security Guard Essentials</h2>
            <p className="section-subtitle">Equip your team with reliable gear</p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
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
