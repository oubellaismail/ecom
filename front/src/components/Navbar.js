import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productApi } from '../api/productService';

// Simple SVG icons
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cart, getCartCount } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Helper function to normalize search terms
  const normalizeSearchTerm = (term) => {
    return term
      .toLowerCase()
      .replace(/\s+/g, '') // Remove all spaces
      .replace(/[^a-z0-9]/g, ''); // Remove special characters
  };

  // Helper function to check if a product matches the search term
  const isProductMatch = (product, searchTerm) => {
    const normalizedSearch = normalizeSearchTerm(searchTerm);
    const normalizedName = normalizeSearchTerm(product.name);
    const normalizedDescription = normalizeSearchTerm(product.description || '');

    return normalizedName.includes(normalizedSearch) ||
      normalizedDescription.includes(normalizedSearch);
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    async (term) => {
      if (!term.trim()) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      try {
        setIsSearching(true);
        console.log('Searching for:', term.trim());
        const response = await productApi.getProducts();
        console.log('Search response:', response);

        // Handle different response formats
        let results = [];
        if (response && response.success && response.data) {
          results = response.data;
        } else if (Array.isArray(response)) {
          results = response;
        } else if (response.data) {
          results = Array.isArray(response.data) ? response.data : [response.data];
        }

        // Filter results based on normalized search term
        const filteredResults = results.filter(product =>
          isProductMatch(product, term)
        );

        console.log('Filtered results:', filteredResults);

        // Transform results to ensure consistent structure
        const transformedResults = filteredResults.map(product => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          product_item: {
            price: product.product_item?.price || 0,
            product_image: product.product_item?.product_image || '/placeholder-image.jpg'
          }
        }));

        setSearchResults(transformedResults);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  // Add click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showResults && !event.target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResults]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
          style={{ color: '#333' }}>
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
              <Link className="nav-link px-3" to="/shop" style={{ color: '#333', fontWeight: '500' }}>
                Shop
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link className="nav-link px-3" to="/about" style={{ color: '#333', fontWeight: '500' }}>
                About
              </Link>
            </li>

          </ul>

          {/* Search Bar */}
          <form
            className="d-flex position-relative my-3 my-lg-0 mx-lg-auto search-container"
            style={{ maxWidth: '300px' }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="search"
              className="form-control pe-5"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.trim() === '') {
                  setShowResults(false);
                  setSearchResults([]);
                }
              }}
              style={{
                borderRadius: '25px',
                padding: '10px 15px',
                background: 'rgba(236, 236, 236, 0.7)',
                border: 'none'
              }}
            />
            <button
              className="btn position-absolute end-0 top-0 bottom-0"
              type="button"
              style={{
                border: 'none',
                background: 'transparent',
                color: '#555'
              }}
            >
              {isSearching ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <i className="bi bi-search"></i>
              )}
            </button>
            {showResults && searchResults.length > 0 && (
              <div className="position-absolute top-100 start-0 end-0 mt-1 bg-white rounded shadow-lg" style={{ zIndex: 1000 }}>
                {searchResults.map(product => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className="d-flex align-items-center p-2 text-decoration-none text-dark hover-bg-light"
                    onClick={() => setShowResults(false)}
                  >
                    <img
                      src={product.product_item?.product_image || '/placeholder-image.jpg'}
                      alt={product.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
                    />
                    <div>
                      <div className="fw-bold">{product.name}</div>
                      <div className="text-muted small">${product.product_item?.price || '0.00'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Right actions */}
          <div className="d-flex align-items-center ms-lg-auto mt-3 mt-lg-0">
            {user ? (
              isAdmin ? (
                // Admin buttons
                <>
                  <Link to="/dashboard" className="btn me-2" style={{
                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                    color: 'white',
                    fontWeight: '500',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '25px',
                    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                  }}>
                    Dashboard
                  </Link>
                  <Link onClick={handleLogout} to="/" className="btn" style={{
                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                    color: 'white',
                    fontWeight: '500',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '25px',
                    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                  }}>
                    Logout
                  </Link>
                </>
              ) : (
                // Regular user buttons
                <>
                  <Link to="/profile" className="btn p-2 me-2 rounded-circle" style={{
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
                    {getCartCount() > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{
                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                        fontSize: '0.65rem'
                      }}>
                        {getCartCount()}
                      </span>
                    )}
                  </Link>
                  <Link onClick={handleLogout} to="/" className="btn" style={{
                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                    color: 'white',
                    fontWeight: '500',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '25px',
                    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                  }}>
                    Logout
                  </Link>
                </>
              )
            ) : (
              // Guest buttons
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
