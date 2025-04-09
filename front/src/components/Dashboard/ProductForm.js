import React from 'react';

const ProductForm = ({ formData, handleChange, handleSubmit, isEditing, resetForm, setActiveTab, errorMessage, successMessage, loading, categories }) => {
    return (
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
                                disabled={loading}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                                Category*
                            </label>
                            <select
                                name="category_slug"
                                className="form-select"
                                value={formData.category_slug}
                                onChange={handleChange}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: 'rgba(236, 236, 236, 0.7)',
                                    border: 'none'
                                }}
                                required
                                disabled={loading}
                            >
                                <option value="">Select a category</option>
                                {categories && categories.map(category => (
                                    <option key={category.slug} value={category.slug}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
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
                                disabled={loading}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                                Inventory
                            </label>
                            <input
                                type="number"
                                name="qty_in_stock"
                                className="form-control"
                                value={formData.qty_in_stock}
                                onChange={handleChange}
                                placeholder="Enter inventory count"
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: 'rgba(236, 236, 236, 0.7)',
                                    border: 'none'
                                }}
                                min="0"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                            Product image
                        </label>
                        <input
                            type="file"
                            name="product_image"
                            className="form-control"
                            accept="image/*"
                            onChange={handleChange}
                            placeholder="Enter image URL"
                            style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: 'rgba(236, 236, 236, 0.7)',
                                border: 'none'
                            }}
                            disabled={loading}
                        />
                        {isEditing && typeof formData.product_image === 'string' && formData.product_image && (
                            <div className="mt-2">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={formData.product_image}
                                        alt="Current product"
                                        className="me-2"
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <p className="text-muted small mb-0">Current image</p>
                                </div>
                            </div>
                        )}
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
                            disabled={loading}
                        ></textarea>
                    </div>

                    <FormActions
                        isEditing={isEditing}
                        resetForm={resetForm}
                        setActiveTab={setActiveTab}
                        loading={loading}
                    />
                </form>
            </div>
        </div>
    );
};

// FormActions component for form buttons
const FormActions = ({ isEditing, resetForm, setActiveTab, loading }) => {
    return (
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
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isEditing ? 'Updating...' : 'Adding...'}
                    </>
                ) : (
                    isEditing ? 'Update Product' : 'Add Product'
                )}
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
                disabled={loading}
            >
                Cancel
            </button>
        </div>
    );
};

export default ProductForm;