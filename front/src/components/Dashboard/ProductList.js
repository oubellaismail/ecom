import React from 'react';

// Simple icon components
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
    </svg>
);

const ProductList = ({ products, handleEdit, handleDelete, handleAddNew, errorMessage, successMessage, loading }) => {
    // Wrap handleAddNew to ensure it sets the active tab
    const handleAddNewProduct = () => {
        handleAddNew();
    };

    return (
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
                        onClick={handleAddNewProduct}
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
                        disabled={loading}
                    >
                        Add New Product
                    </button>
                </div>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="alert alert-info">No products found. Add your first product!</div>
                ) : (
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
                                    <ProductRow
                                        key={product.slug || product.id}
                                        product={product}
                                        handleEdit={handleEdit}
                                        handleDelete={handleDelete}
                                        loading={loading}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

// ProductRow component for individual product row
const ProductRow = ({ product, handleEdit, handleDelete, loading }) => {
    // Get the identifier (slug or id) to use for actions
    const productId = product.slug || product.id;

    // Handle the product image display properly
    const getImageSource = () => {
        if (!product.product_image) {
            return '/placeholder-image.jpg';
        }

        // Handle if product_image is an object with preview property
        if (typeof product.product_image === 'object' && product.product_image.preview) {
            return product.product_image.preview;
        }

        // Handle if product_image is a string (URL)
        return product.product_image;
    };

    return (
        <tr>
            <td>
                <div style={{ width: '50px', height: '50px' }}>
                    <img
                        src={getImageSource()}
                        alt={product.name}
                        className="rounded"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px'
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                        }}
                    />
                </div>
            </td>
            <td>{product.name}</td>
            <td>{product.category_name || product.category_slug}</td>
            <td>${parseFloat(product.price).toFixed(2)}</td>
            <td>{product.qty_in_stock}</td>
            <td>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => handleEdit(productId)}
                        className="btn btn-sm p-2"
                        style={{
                            background: 'rgba(236, 236, 236, 0.7)',
                            borderRadius: '8px',
                            border: 'none'
                        }}
                        disabled={loading}
                    >
                        <EditIcon />
                    </button>
                    <button
                        onClick={() => handleDelete(productId)}
                        className="btn btn-sm p-2"
                        style={{
                            background: 'rgba(236, 236, 236, 0.7)',
                            color: '#ff4d4d',
                            borderRadius: '8px',
                            border: 'none'
                        }}
                        disabled={loading}
                    >
                        <TrashIcon />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ProductList;

// You'll also need to modify the parent component that manages the state and API calls
// Here's a sample implementation for the handleSubmit method in your parent component

/*
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        // Create a new FormData object for the API request
        const productData = new FormData();
        
        // Add all basic fields
        productData.append('name', formData.name);
        productData.append('category_slug', formData.category_slug);
        productData.append('price', formData.price);
        productData.append('qty_in_stock', formData.qty_in_stock);
        productData.append('description', formData.description);
        
        // Handle image properly
        if (formData.product_image) {
            if (typeof formData.product_image === 'object' && formData.product_image.file) {
                // If it's a File object from input
                productData.append('product_image', formData.product_image.file);
            } else if (typeof formData.product_image === 'string') {
                // If it's a URL string (like in edit mode and image wasn't changed)
                productData.append('product_image_url', formData.product_image);
            }
        }
        
        let response;
        if (isEditing) {
            // Update existing product
            response = await api.put(`/products/${editingProductId}`, productData);
        } else {
            // Create new product
            response = await api.post('/products', productData);
        }
        
        if (response.status === 200 || response.status === 201) {
            setSuccessMessage(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
            resetForm();
            fetchProducts(); // Refresh product list
            setActiveTab('products');
        }
    } catch (error) {
        setErrorMessage(error.response?.data?.message || 'An error occurred');
    } finally {
        setLoading(false);
    }
};
*/