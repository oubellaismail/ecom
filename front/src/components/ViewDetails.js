import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ViewDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Mock fetch product data - in a real app this would be an API call
  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      // Mock product data with all required fields
      const mockProducts = [
        {
          id: 1,
          name: "Ultra HD Smart TV 55\"",
          category: "Electronics",
          price: 699.99,
          image: '/images/2.jpg',
          description: "Experience crystal-clear visuals with this 55-inch Ultra HD Smart TV. Features include AI-powered upscaling, voice control, and seamless streaming capabilities.",
          qte_stock: 15
        },
        {
          id: 2,
          name: "Premium Wireless Earbuds",
          category: "Audio",
          price: 129.99,
          image: '/images/6.jpg',
          description: "Immerse yourself in premium sound quality with these wireless earbuds. Featuring active noise cancellation, water resistance, and 24-hour battery life.",
          qte_stock: 42
        },
        {
          id: 3,
          name: "Digital SLR Camera Kit",
          category: "Photography",
          price: 849.99,
          image: '/images/5.jpg',
          description: "Capture professional quality images with this DSLR camera kit. Includes an 18-55mm lens, UV filter, and camera bag. Perfect for beginners and enthusiasts alike.",
          qte_stock: 8
        }
      ];

      const foundProduct = mockProducts.find(p => p.id === parseInt(id));
      setProduct(foundProduct);
      setLoading(false);
    }, 800);
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product?.qte_stock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product?.qte_stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
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

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to={`/category/${product.category.toLowerCase()}`}>{product.category}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row">
        {/* Product Image */}
        <div className="col-md-6 mb-4">
          <div 
            className="bg-light rounded-4 d-flex align-items-center justify-content-center"
            style={{ height: "500px", overflow: "hidden" }}
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="img-fluid rounded-4"
              style={{ objectFit: "contain", maxHeight: "100%" }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <div className="mb-3">
            <span className="badge bg-secondary mb-2">{product.category}</span>
            <h2 className="fw-bold mb-3">{product.name}</h2>
            <p className="h3 mb-4">${product.price.toFixed(2)}</p>
            
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
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Quantity:</h6>
                <div className="d-flex align-items-center" style={{ maxWidth: "150px" }}>
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="form-control mx-2 text-center"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.qte_stock}
                  />
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.qte_stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="d-grid gap-2 d-md-flex mt-4">
              <button 
                className="btn btn-lg flex-grow-1" 
                style={{
                  background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                  color: 'white',
                  borderRadius: '12px'
                }}
                disabled={product.qte_stock === 0}
              >
                Add to Cart
              </button>
              <button className="btn btn-outline-dark btn-lg">
                <i className="bi bi-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-4">You might also like</h3>
        {/* Related products section would go here */}
        <div className="text-center mt-4">
          <p>Related products carousel would appear here</p>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;