import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="pt-5 pb-4" style={{
      background: 'linear-gradient(to right, #2c3e50, #1a2533)',
      color: '#f8f9fa'
    }}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h2 style={{
              fontWeight: '800',
              fontSize: '1.8rem',
              background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              3Ecom
            </h2>
            <p className="text-light-emphasis mb-4">
              Your one-stop shop for all your electronic needs. We provide the latest and most innovative products with excellent customer service.
            </p>
            <div className="d-flex gap-3 mb-4">
              <a href="https://facebook.com" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: '38px', height: '38px' }}>
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="https://instagram.com" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: '38px', height: '38px' }}>
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="https://twitter.com" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: '38px', height: '38px' }}>
                <i className="bi bi-twitter-x fs-5"></i>
              </a>
              <a href="https://youtube.com" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: '38px', height: '38px' }}>
                <i className="bi bi-youtube fs-5"></i>
              </a>
            </div>
          </div>
          
          <div className="col-sm-6 col-md-4 col-lg-2 mb-4 mb-lg-0">
            <h5 className="fw-bold mb-3">Shop</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/shop" className="text-decoration-none text-light-emphasis">All Products</Link>
              </li>
              <li className="mb-2">
                <Link to="/new" className="text-decoration-none text-light-emphasis">New Arrivals</Link>
              </li>
              <li className="mb-2">
                <Link to="/featured" className="text-decoration-none text-light-emphasis">Featured</Link>
              </li>
              <li className="mb-2">
                <Link to="/sale" className="text-decoration-none text-light-emphasis">Discounts</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-sm-6 col-md-4 col-lg-2 mb-4 mb-lg-0">
            <h5 className="fw-bold mb-3">Account</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/signin" className="text-decoration-none text-light-emphasis">Sign In</Link>
              </li>
              <li className="mb-2">
                <Link to="/signup" className="text-decoration-none text-light-emphasis">Create Account</Link>
              </li>
              <li className="mb-2">
                <Link to="/account" className="text-decoration-none text-light-emphasis">My Account</Link>
              </li>
              <li className="mb-2">
                <Link to="/orders" className="text-decoration-none text-light-emphasis">Order History</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-sm-6 col-md-4 col-lg-2 mb-4 mb-lg-0">
            <h5 className="fw-bold mb-3">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/contact" className="text-decoration-none text-light-emphasis">Contact Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-decoration-none text-light-emphasis">FAQs</Link>
              </li>
              <li className="mb-2">
                <Link to="/shipping" className="text-decoration-none text-light-emphasis">Shipping Info</Link>
              </li>
              <li className="mb-2">
                <Link to="/returns" className="text-decoration-none text-light-emphasis">Returns & Refunds</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-sm-6 col-lg-2">
            <h5 className="fw-bold mb-3">Newsletter</h5>
            <p className="text-light-emphasis mb-3">Subscribe to get special offers, free giveaways, and more.</p>
            <form>
              <div className="input-group mb-3">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Your email" 
                  style={{
                    borderTopLeftRadius: '10px',
                    borderBottomLeftRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white'
                  }}
                />
                <button 
                  className="btn" 
                  type="submit"
                  style={{
                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                    color: 'white',
                    borderTopRightRadius: '10px',
                    borderBottomRightRadius: '10px'
                  }}
                >
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <hr className="my-4" style={{ opacity: 0.1 }} />
        
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-md-0 text-light-emphasis">
              &copy; 2025 3Ecom. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <Link to="/terms" className="text-decoration-none text-light-emphasis">Terms of Service</Link>
              <Link to="/privacy" className="text-decoration-none text-light-emphasis">Privacy Policy</Link>
              <Link to="/cookies" className="text-decoration-none text-light-emphasis">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;