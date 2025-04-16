import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [imageError, setImageError] = useState(false);

    // Log the entire product object to see what we're working with
    console.log('ProductCard received product:', product);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate('/signin');
            return;
        }

        try {
            // Import cart service dynamically to avoid circular dependencies
            const cartService = (await import('../api/cartService')).default;

            const cartItem = {
                productId: product.id || product._id,
                quantity: 1,
                price: product.price,
                image: getImageUrl(), // Use our getImageUrl function for consistency
                name: product.name
            };

            await cartService.addToCart(cartItem);
            alert('Product added to cart successfully!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Error adding product to cart. Please try again.');
        }
    };

    // Enhanced getImageUrl function with better fallbacks and debugging
    const getImageUrl = () => {
        // Debug all possible image sources
        const imageSources = {
            image: product.image,
            product_image: product.product_image,
            productItemImage: product.product_item?.product_image
        };
        console.log('Available image sources:', imageSources);

        // Immediately return fallback if image loading previously failed
        if (imageError) {
            console.log('Using fallback image due to previous error');
            return '/images/1.jpg';
        }

        // Try each image source in order of preference
        if (product.image) {
            console.log('Using product.image:', product.image);
            // If it's a relative URL without a leading slash, add one
            if (!product.image.startsWith('http') && !product.image.startsWith('/')) {
                return `/${product.image}`;
            }
            return product.image;
        }

        if (product.product_image) {
            console.log('Using product.product_image:', product.product_image);
            // If it's a relative URL without a leading slash, add one
            if (!product.product_image.startsWith('http') && !product.product_image.startsWith('/')) {
                return `/${product.product_image}`;
            }
            return product.product_image;
        }

        if (product.product_item?.product_image) {
            console.log('Using product.product_item.product_image:', product.product_item.product_image);
            // If it's a relative URL without a leading slash, add one
            if (!product.product_item.product_image.startsWith('http') && !product.product_item.product_image.startsWith('/')) {
                return `/${product.product_item.product_image}`;
            }
            return product.product_item.product_image;
        }

        // Default fallback
        console.log('No image found, using fallback');
        return '/images/1.jpg';
    };

    // Get the category name with fallback
    const getCategoryName = () => {
        // Check if category is an object (from the API)
        if (product.category && typeof product.category === 'object') {
            return product.category.name || 'Uncategorized';
        }

        // Check direct category properties
        return product.category || product.category_name || product.category_slug || 'Uncategorized';
    };

    return (
        <div className="col">
            <div className="card h-100 border-0" style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
                <div className="position-relative">
                    {product.new_arrival && (
                        <div className="position-absolute top-0 start-0 m-2 px-3 py-1" style={{
                            background: 'linear-gradient(90deg, #f9cb28, #ffdd80)',
                            color: '#333',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                        }}>
                            New
                        </div>
                    )}

                    {/* Add debugging information before the actual image */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '2px 5px',
                        fontSize: '8px',
                        zIndex: 10
                    }}>
                        URL: {getImageUrl().substring(0, 20)}...
                    </div>

                    <img
                        src={getImageUrl()}
                        className="card-img-top"
                        alt={product.name || 'Product'}
                        style={{ height: '220px', objectFit: 'cover' }}
                        onError={(e) => {
                            console.error('Image failed to load:', e.target.src);
                            setImageError(true);
                            // Try with a direct fallback
                            e.target.src = '/images/1.jpg';
                        }}
                    />

                    {product.qte_stock === 0 && (
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
                        {getCategoryName()}
                    </p>
                    <h5 className="card-title" style={{ fontWeight: '600' }}>
                        {product.name || 'Product'}
                    </h5>
                    <p className="card-text my-3" style={{
                        fontWeight: '700',
                        fontSize: '1.2rem',
                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        ${typeof product.price === 'number' ? product.price.toFixed(2) :
                            (typeof product.price === 'string' && !isNaN(parseFloat(product.price))) ?
                                parseFloat(product.price).toFixed(2) : '0.00'}
                    </p>
                    <div className="d-flex gap-2 mt-3">
                        <Link
                            to={`/product/${product.slug || product.id || product._id}`}
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
                            disabled={product.qte_stock === 0}
                            onClick={handleAddToCart}
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
    );
};

export default ProductCard;