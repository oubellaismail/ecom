import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // State for product list
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 149.99,
      category: 'Electronics',
      image: '/images/7.jpg',
      inventory: 45
    },
    {
      id: 2,
      name: 'Smart Watch Series 5',
      description: 'Feature-rich smartwatch with health tracking capabilities',
      price: 299.99,
      category: 'Wearables',
      image: '/images/6.jpg',
      inventory: 32
    },
    {
      id: 3,
      name: 'Ultrabook Pro 15',
      description: 'Powerful laptop with high performance specs',
      price: 1099.99,
      category: 'Computers',
      image: '/images/5.jpg',
      inventory: 18
    },
  ]);

  // State for form data
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    inventory: ''
  });

  // State for tracking whether we are editing or adding
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('products');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'inventory' ? parseFloat(value) || '' : value,
    });
  };

  // Handle form submission for adding/editing products
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.price) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      if (isEditing) {
        // Update existing product
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === formData.id ? formData : product
          )
        );
        setSuccessMessage('Product updated successfully!');
      } else {
        // Add new product with a new ID
        const newProduct = {
          ...formData,
          id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
        };
        setProducts([...products, newProduct]);
        setSuccessMessage('Product added successfully!');
      }
      
      // Reset form after submission
      resetForm();
    } catch (error) {
      setErrorMessage(error.message || 'Operation failed');
      console.error('Error:', error);
    }
  };

  // Function to handle edit button click
  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
    setActiveTab('addEdit');
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Function to handle delete button click
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      setSuccessMessage('Product deleted successfully!');
    }
  };

  // Function to reset form
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      inventory: ''
    });
    setIsEditing(false);
  };

  // Handler for Add New Product button
  const handleAddNew = () => {
    resetForm();
    setActiveTab('addEdit');
    setErrorMessage('');
    setSuccessMessage('');
  };

  // TrashIcon component
  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  // EditIcon component
  const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );

  return (
    <div className="container-fluid py-4" style={{
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
      minHeight: '100vh'
    }}>
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card border-0" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px'
          }}>
            <div className="card-body p-4">
              {/* Logo */}
              <div className="text-center mb-4">
                <h1 style={{
                  fontWeight: '800',
                  fontSize: '1.75rem',
                  background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  3Ecom Admin
                </h1>
                <p className="text-muted">Product Management</p>
              </div>

              {/* Navigation Menu */}
              <div className="nav flex-column">
                <button 
                  className={`nav-link text-start py-3 px-4 mb-2 ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveTab('products')}
                  style={{
                    borderRadius: '12px',
                    background: activeTab === 'products' ? 'linear-gradient(90deg, #ff4d4d, #f9cb28)' : 'rgba(236, 236, 236, 0.7)',
                    color: activeTab === 'products' ? 'white' : '#333',
                    fontWeight: '500',
                    border: 'none'
                  }}
                >
                  Product List
                </button>
                <button 
                  className={`nav-link text-start py-3 px-4 mb-2 ${activeTab === 'addEdit' ? 'active' : ''}`}
                  onClick={handleAddNew}
                  style={{
                    borderRadius: '12px',
                    background: activeTab === 'addEdit' ? 'linear-gradient(90deg, #ff4d4d, #f9cb28)' : 'rgba(236, 236, 236, 0.7)',
                    color: activeTab === 'addEdit' ? 'white' : '#333',
                    fontWeight: '500',
                    border: 'none'
                  }}
                >
                  {isEditing ? 'Edit Product' : 'Add Product'}
                </button>
                <Link 
                  to="/dashboard" 
                  className="nav-link text-start py-3 px-4 mb-2"
                  style={{
                    borderRadius: '12px',
                    background: 'rgba(236, 236, 236, 0.7)',
                    color: '#333',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/logout" 
                  className="nav-link text-start py-3 px-4"
                  style={{
                    borderRadius: '12px',
                    background: 'rgba(236, 236, 236, 0.7)',
                    color: '#333',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          {activeTab === 'products' ? (
            <div className="card border-0" style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px'
            }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold mb-0">Product List</h3>
                  <button 
                    onClick={handleAddNew}
                    className="btn"
                    style={{
                      background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                      color: 'white',
                      fontWeight: '500',
                      padding: '10px 20px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)',
                      border: 'none'
                    }}
                  >
                    Add New Product
                  </button>
                </div>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Price</th>
                        <th scope="col">Inventory</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div style={{ width: '50px', height: '50px' }}>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="rounded"
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover',
                                  borderRadius: '8px'
                                }}
                              />
                            </div>
                          </td>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>{product.inventory}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="btn btn-sm p-2"
                                style={{
                                  background: 'rgba(236, 236, 236, 0.7)',
                                  borderRadius: '8px',
                                  border: 'none'
                                }}
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="btn btn-sm p-2"
                                style={{
                                  background: 'rgba(236, 236, 236, 0.7)',
                                  color: '#ff4d4d',
                                  borderRadius: '8px',
                                  border: 'none'
                                }}
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-0" style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px'
            }}>
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        Product Name*
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        className="form-control" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name" 
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'rgba(236, 236, 236, 0.7)',
                          border: 'none'
                        }}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        Category
                      </label>
                      <input 
                        type="text" 
                        name="category"
                        className="form-control" 
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Enter product category" 
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'rgba(236, 236, 236, 0.7)',
                          border: 'none'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        Price*
                      </label>
                      <input 
                        type="number" 
                        name="price"
                        className="form-control" 
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price" 
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'rgba(236, 236, 236, 0.7)',
                          border: 'none'
                        }}
                        required
                        step="0.01"
                        min="0"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                        Inventory
                      </label>
                      <input 
                        type="number" 
                        name="inventory"
                        className="form-control" 
                        value={formData.inventory}
                        onChange={handleChange}
                        placeholder="Enter inventory count" 
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'rgba(236, 236, 236, 0.7)',
                          border: 'none'
                        }}
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                      Image URL
                    </label>
                    <input 
                      type="text" 
                      name="image"
                      className="form-control" 
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Enter image URL" 
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'rgba(236, 236, 236, 0.7)',
                        border: 'none'
                      }}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                      Description*
                    </label>
                    <textarea 
                      name="description"
                      className="form-control" 
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter product description" 
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'rgba(236, 236, 236, 0.7)',
                        border: 'none',
                        minHeight: '120px'
                      }}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="d-flex gap-3">
                    <button 
                      type="submit" 
                      className="btn"
                      style={{
                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                        color: 'white',
                        fontWeight: '500',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)',
                        border: 'none'
                      }}
                    >
                      {isEditing ? 'Update Product' : 'Add Product'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        resetForm();
                        setActiveTab('products');
                      }}
                      className="btn"
                      style={{
                        background: 'rgba(236, 236, 236, 0.7)',
                        color: '#333',
                        fontWeight: '500',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        border: 'none'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;