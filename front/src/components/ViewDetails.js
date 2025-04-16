import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi } from '../api/productService';
import cartService from '../api/cartService';
import { useAuth } from '../context/AuthContext';

const ViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await productApi.getProduct(id);
        // Handle different response formats
        const productData = response.data ? response.data : response;

        console.log("Raw product data:", productData);

        // Transform the data to ensure consistent structure and convert objects to strings
        const transformedProduct = {
          id: productData.id || productData._id,
          name: productData.name || "Product",
          description: productData.description || "No description available",
          // Handle price - ensure it's a number
          price: typeof productData.price === 'number' ? productData.price :
            typeof productData.price === 'string' ? parseFloat(productData.price) :
              (productData.product_item && productData.product_item.price) || 0,
          // Handle category - now properly handling the category object
          category: productData.category ? {
            name: productData.category.name || "Uncategorized",
            slug: productData.category.slug || ""
          } : {
            name: "Uncategorized",
            slug: ""
          },
          // Handle all possible image properties
          image: productData.image ||
            productData.product_image ||
            (productData.product_item && productData.product_item.product_image) ||
            '/placeholder-image.jpg', // Fallback image
          qte_stock: parseInt(productData.qte_stock) ||
            parseInt(productData.qty_in_stock) ||
            (productData.product_item && parseInt(productData.product_item.qty_in_stock)) ||
            0
        };

        console.log('Transformed product data:', transformedProduct);
        setProduct(transformedProduct);
      } catch (error) {
        setError('Error loading product details. Please try again.');
        console.error('Product fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      setAddingToCart(true);
      setError('');
      setSuccess('');

      const cartItem = {
        id: product.id,
        name: product.name,
        quantity: quantity,
        price: product.price,
        image: product.image,
        size: product.category.name
      };

      const result = await cartService.addToCart(cartItem);
      if (result.success) {
        setSuccess('Product added to cart successfully!');
      } else {
        setError(result.error || 'Error adding product to cart. Please try again.');
      }
    } catch (error) {
      setError('Error adding product to cart. Please try again.');
      console.error('Add to cart error:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status" style={{ color: '#ff4d4d' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Product Not Found</h4>
          <p>Sorry, we couldn't find the product you're looking for.</p>
          <Link to="/" className="btn btn-primary mt-3">Return to Home</Link>
        </div>
      </div>
    );
  }

  const stockStatus = product.qte_stock > 10
    ? { text: "In Stock", class: "text-success" }
    : product.qte_stock > 0
      ? { text: "Low Stock", class: "text-warning" }
      : { text: "Out of Stock", class: "text-danger" };

  // Ensure price is displayed correctly
  const displayPrice = parseFloat(product.price).toFixed(2);

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item">
            <Link to={`/category/${product.category.slug}`}>
              {product.category.name}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      <div className="row">
        {/* Product Image */}
        <div className="col-md-6 mb-4">
          <div
            className="bg-light rounded-4 d-flex align-items-center justify-content-center"
            style={{ height: "500px", overflow: "hidden" }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid rounded-4"
                style={{ objectFit: "contain", maxHeight: "100%" }}
                onError={(e) => {
                  console.error('Image failed to load:', product.image);
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            ) : (
              <div className="text-center text-muted">
                <i className="bi bi-image" style={{ fontSize: "5rem" }}></i>
                <p>No image available</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <div className="mb-3">
            <span className="badge bg-gradient mb-2" style={{ background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)' }}>
              {product.category.name}
            </span>
            <h2 className="fw-bold mb-3">{product.name}</h2>
            <p className="h3 mb-4">${displayPrice}</p>

            <div className="mb-4">
              <h6 className="fw-bold mb-2">Description:</h6>
              <p className="text-muted">{product.description}</p>
            </div>

            <div className="d-flex align-items-center mb-4">
              <h6 className="fw-bold me-3 mb-0">Availability:</h6>
              <p className={`mb-0 ${stockStatus.class}`}>
                {stockStatus.text}
                {product.qte_stock > 0 && (
                  <span className="text-muted ms-2">({product.qte_stock} items)</span>
                )}
              </p>
            </div>

            {product.qte_stock > 0 && (
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="input-group" style={{ width: '150px' }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.qte_stock}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity(Math.min(product.qte_stock, quantity + 1))}
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn btn-lg flex-grow-1"
                  style={{
                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                    color: 'white',
                    borderRadius: '12px'
                  }}
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-4">You might also like</h3>
        {/* Related products section could be implemented here */}
        <div className="text-center mt-4">
          <p>Related products would appear here</p>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;