import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../api/productService';
import cartService from '../api/cartService';
import { useAuth } from '../context/AuthContext';
import Notification from './Notification';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [categories, setCategories] = useState([]);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleAddToCart = async (product) => {
        if (!user) {
            navigate('/signin');
            return;
        }

        try {
            const cartItem = {
                id: product.id || product._id,
                name: product.name,
                quantity: 1,
                price: product.product_item?.price || product.price,
                image: product.product_item?.product_image || product.image,
                size: product.category?.name || product.category_name || product.category_slug
            };

            const result = await cartService.addToCart(cartItem);
            if (result.success) {
                setNotification({
                    message: 'Product added to cart successfully!',
                    type: 'success'
                });
            } else {
                setNotification({
                    message: result.error || 'Error adding product to cart. Please try again.',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setNotification({
                message: 'Error adding product to cart. Please try again.',
                type: 'error'
            });
        }
    };

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch products with filters
            const response = await productService.getProducts({
                page,
                search: searchTerm,
                category: categoryFilter === 'All' ? '' : categoryFilter,
                sortBy,
                sortOrder
            });

            console.log('API Response:', response); // Debug log

            // Handle the response based on its structure
            if (response && response.success && response.data) {
                setProducts(response.data);
                setTotalPages(1); // Since we're not implementing pagination yet
            } else {
                setProducts([]);
                setTotalPages(1);
            }

            // Fetch categories if not already loaded
            if (categories.length === 0) {
                const categoriesResponse = await productService.getCategories();
                console.log('Categories Response:', categoriesResponse); // Debug log

                if (categoriesResponse && categoriesResponse.success && categoriesResponse.data) {
                    setCategories(categoriesResponse.data);
                }
            }
        } catch (error) {
            setError('Error loading products. Please try again.');
            console.error('Products error:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, categoryFilter, sortBy, sortOrder, categories.length]);

    // Load products and categories
    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setPage(1); // Reset to first page when searching
            loadData();
        }
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert"
                    style={{ borderRadius: '12px', border: 'none', background: 'rgba(255, 77, 77, 0.1)' }}>
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="row mb-4">
                <div className="col-md-6">
                    <h2 className="mb-0" style={{
                        fontWeight: '700',
                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        All Products
                    </h2>
                </div>
                <div className="col-md-6">
                    <div className="d-flex gap-2">
                        <select
                            className="form-select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: 'rgba(236, 236, 236, 0.7)',
                                border: 'none'
                            }}
                        >
                            <option value="All">All Categories</option>
                            {categories && categories.map(category => (
                                <option key={category.slug} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="form-select"
                            value={sortBy}
                            onChange={(e) => handleSort(e.target.value)}
                            style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: 'rgba(236, 236, 236, 0.7)',
                                border: 'none'
                            }}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="price">Sort by Price</option>
                            <option value="createdAt">Sort by Date</option>
                        </select>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleSearch}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: 'rgba(236, 236, 236, 0.7)',
                                    border: 'none'
                                }}
                            />
                            <button
                                className="btn"
                                type="button"
                                onClick={() => {
                                    setPage(1);
                                    loadData();
                                }}
                                style={{
                                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                    color: 'white',
                                    fontWeight: '500',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                                }}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {products && products.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    {products.map(product => (
                        <div key={product.id} className="col">
                            <div className="card h-100 border-0" style={{
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}>
                                <div className="position-relative">
                                    <img
                                        src={product.product_item?.product_image || '/placeholder.png'}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{ height: '220px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/1.jpg';
                                        }}
                                    />
                                    {product.product_item?.qty_in_stock === 0 && (
                                        <div className="position-absolute top-0 end-0 m-2 px-3 py-1" style={{
                                            background: 'linear-gradient(90deg, #ff4d4d, #ff8080)',
                                            color: 'white',
                                            borderRadius: '8px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600'
                                        }}>
                                            Out of Stock
                                        </div>
                                    )}
                                </div>
                                <div className="card-body p-4">
                                    <p className="text-muted mb-1" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                        {product.category?.name}
                                    </p>
                                    <h5 className="card-title" style={{ fontWeight: '600' }}>
                                        {product.name}
                                    </h5>
                                    <p className="card-text my-3" style={{
                                        fontWeight: '700',
                                        fontSize: '1.2rem',
                                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        ${product.product_item?.price ? parseFloat(product.product_item.price).toFixed(2) : '0.00'}
                                    </p>
                                    <div className="d-flex gap-2">
                                        <Link
                                            to={`/product/${product.slug}`}
                                            className="btn flex-grow-1"
                                            style={{
                                                background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                                color: 'white',
                                                fontWeight: '500',
                                                padding: '10px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                                            }}
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            className="btn"
                                            disabled={product.product_item?.qty_in_stock === 0}
                                            onClick={() => handleAddToCart(product)}
                                            style={{
                                                border: '1px solid #ddd',
                                                borderRadius: '12px',
                                                fontWeight: '500',
                                                padding: '10px 15px'
                                            }}
                                        >
                                            <i className="bi bi-cart-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <h3 style={{
                        fontWeight: '700',
                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        No products found
                    </h3>
                    <p className="text-muted">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPage(page - 1)}
                                    style={{
                                        background: 'rgba(236, 236, 236, 0.7)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        margin: '0 4px'
                                    }}>
                                    Previous
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(i + 1)}
                                        style={{
                                            background: page === i + 1 ? 'linear-gradient(90deg, #ff4d4d, #f9cb28)' : 'rgba(236, 236, 236, 0.7)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            margin: '0 4px',
                                            color: page === i + 1 ? 'white' : 'inherit'
                                        }}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPage(page + 1)}
                                    style={{
                                        background: 'rgba(236, 236, 236, 0.7)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        margin: '0 4px'
                                    }}>
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default AllProducts; 