import React from 'react';

const CategoryForm = ({ categoryData, handleCategoryChange, handleCategorySubmit, isEditingCategory, resetCategoryForm, setActiveTab, errorMessage, successMessage, loading }) => {
    return (
        <div className="card border-0" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px'
        }}>
            <div className="card-body p-4">
                <h3 className="fw-bold mb-4">{isEditingCategory ? 'Edit Category' : 'Add New Category'}</h3>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                <form onSubmit={handleCategorySubmit}>
                    <div className="mb-3">
                        <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                            Category Name*
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={categoryData.name}
                            onChange={handleCategoryChange}
                            placeholder="Enter category name"
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

                    <div className="mb-3">
                        <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                            Category Slug*
                        </label>
                        <input
                            type="text"
                            name="slug"
                            className="form-control"
                            value={categoryData.slug}
                            onChange={handleCategoryChange}
                            placeholder="Enter category slug"
                            style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: 'rgba(236, 236, 236, 0.7)',
                                border: 'none'
                            }}
                            required
                            disabled={isEditingCategory || loading}  // Disable editing slug for existing categories
                        />
                        <small className="text-muted">
                            The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.
                        </small>
                    </div>

                    <div className="mb-4">
                        <label className="form-label" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                            Description
                        </label>
                        <textarea
                            name="description"
                            className="form-control"
                            value={categoryData.description}
                            onChange={handleCategoryChange}
                            placeholder="Enter category description"
                            style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: 'rgba(236, 236, 236, 0.7)',
                                border: 'none',
                                minHeight: '120px'
                            }}
                            disabled={loading}
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
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    {isEditingCategory ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                isEditingCategory ? 'Update Category' : 'Add Category'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                resetCategoryForm();
                                setActiveTab('categories');
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
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;