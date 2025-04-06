import React from 'react';
import { EditIcon, TrashIcon } from './Icons';

const CategoryList = ({ categories, handleEditCategory, handleDeleteCategory, handleAddNewCategory, errorMessage, successMessage }) => {
    return (
        <div className="card border-0" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px'
        }}>
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0">Category List</h3>
                    <button
                        onClick={handleAddNewCategory}
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
                        Add New Category
                    </button>
                </div>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Products</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <CategoryRow
                                    key={category.id}
                                    category={category}
                                    handleEditCategory={handleEditCategory}
                                    handleDeleteCategory={handleDeleteCategory}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// CategoryRow component for individual category row
const CategoryRow = ({ category, handleEditCategory, handleDeleteCategory }) => {
    return (
        <tr>
            <td>{category.name}</td>
            <td>
                <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {category.description}
                </div>
            </td>
            <td>{category.productCount}</td>
            <td>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => handleEditCategory(category)}
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
                        onClick={() => handleDeleteCategory(category.id)}
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
    );
};

export default CategoryList;