import React from 'react';
import { EditIcon, TrashIcon } from './Icons';

const ProductList = ({ products, handleEdit, handleDelete, handleAddNew, errorMessage, successMessage }) => {
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
                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ProductRow component for individual product row
const ProductRow = ({ product, handleEdit, handleDelete }) => {
    return (
        <tr>
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
    );
};

export default ProductList;