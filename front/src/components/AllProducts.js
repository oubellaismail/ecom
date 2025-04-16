import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../api/productService';
import { useAuth } from '../context/AuthContext';

const AllProducts = () => {
    const { user } = useAuth();
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

    // Load products and categories
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');

                // Fetch products with filters
                const response = await productService.getProducts({
                    page,
                    search: searchTerm,
                    category: categoryFilter,
                    sortBy,
                    sortOrder
                });
                setProducts(response.data.products);
                setTotalPages(response.data.totalPages);

                // Fetch categories if not already loaded
                if (categories.length === 0) {
                    const categoriesResponse = await productService.getCategories();
                    setCategories(categoriesResponse.data);
                }
            } catch (error) {
                setError('Error loading products. Please try again.');
                console.error('Products error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [page, searchTerm, categoryFilter, sortBy, sortOrder]);

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
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="row mb-4">
                <div className="col-md-6">
                    <h2 className="mb-0">All Products</h2>
                </div>
                <div className="col-md-6">
                    <div className="d-flex gap-2">
                        <select
                            className="form-select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="form-select"
                            value={sortBy}
                            onChange={(e) => handleSort(e.target.value)}
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
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {products.map(product => (
                    <div key={product.id} className="col">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="position-relative">
                                <img
                                    src={product.image}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                {product.qte_stock === 0 && (
                                    <div className="position-absolute top-0 end-0 bg-danger text-white p-2">
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text text-muted">{product.category}</p>
                                <p className="card-text h5">${product.price.toFixed(2)}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="btn btn-primary"
                                    >
                                        View Details
                                    </Link>
                                    <button
                                        className="btn btn-outline-primary"
                                        disabled={product.qte_stock === 0}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page - 1)}>
                                Previous
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default AllProducts; 