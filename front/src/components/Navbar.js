import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Simple SVG icons
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
    }}>
      <div className="container-fluid px-md-5">
        {/* Logo */}
        <Link className="navbar-brand me-4" to="/" style={{
          fontWeight: '800',
          fontSize: '1.6rem',
          background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          3Ecom
        </Link>
        
        {/* Navbar toggler */}
        <button className="navbar-toggler border-0 shadow-none" type="button" 
          data-bs-toggle="collapse" data-bs-target="#navbarContent"
          style={{color: '#333'}}>
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navbar content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Main navigation */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-md-4">
            <li className="nav-item mx-1">
              <Link className="nav-link position-relative px-3" to="/" style={{
                color: '#333',
                fontWeight: '500'
              }}>
                Home
                <span className="position-absolute bottom-0 start-50 translate-middle-x" style={{
                  height: '2px',
                  width: '20px',
                  backgroundColor: '#ff4d4d',
                  display: 'block'
                }}></span>
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link className="nav-link px-3" to="/shop" style={{color: '#333', fontWeight: '500'}}>
                Shop
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link className="nav-link px-3" to="/new" style={{color: '#333', fontWeight: '500'}}>
                New Arrivals
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link className="nav-link px-3" to="/sale" style={{color: '#333', fontWeight: '500'}}>
                Sale
              </Link>
            </li>
          </ul>
          
          {/* Search Bar */}
          <form className="d-flex position-relative my-3 my-lg-0 mx-lg-auto" style={{maxWidth: '300px'}}>
            <input
              type="search"
              className="form-control pe-5"
              placeholder="Search products..."
              style={{
                borderRadius: '25px',
                padding: '10px 15px',
                background: 'rgba(236, 236, 236, 0.7)',
                border: 'none'
              }}
            />
            <button
              className="btn position-absolute end-0 top-0 bottom-0"
              type="submit"
              style={{
                border: 'none',
                background: 'transparent',
                color: '#555'
              }}
            >
              <SearchIcon />
            </button>
          </form>
          
          {/* Right actions */}
          <div className="d-flex align-items-center ms-lg-auto mt-3 mt-lg-0">
            <Link to="/account" className="btn p-2 me-2 rounded-circle" style={{
              background: 'rgba(236, 236, 236, 0.7)',
              color: '#333'
            }}>
              <UserIcon />
            </Link>
            <Link to="/cart" className="btn p-2 me-2 rounded-circle position-relative" style={{
              background: 'rgba(236, 236, 236, 0.7)',
              color: '#333'
            }}>
              <CartIcon />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{
                background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                fontSize: '0.65rem'
              }}>
                3
              </span>
            </Link>
            <Link to="/signup" className="btn ms-2" style={{
              background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
              color: 'white',
              fontWeight: '500',
              padding: '0.5rem 1.25rem',
              borderRadius: '25px',
              boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
            }}>
              Sign Up
            </Link>
            <Link to="/signin" className="btn ms-2" style={{
              background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
              color: 'white',
              fontWeight: '500',
              padding: '0.5rem 1.25rem',
              borderRadius: '25px',
              boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;