import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, handleAddNew, handleAddNewCategory, isEditing, isEditingCategory }) => {
    return (
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
                    <button
                        className={`nav-link text-start py-3 px-4 mb-2 ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                        style={{
                            borderRadius: '12px',
                            background: activeTab === 'categories' ? 'linear-gradient(90deg, #ff4d4d, #f9cb28)' : 'rgba(236, 236, 236, 0.7)',
                            color: activeTab === 'categories' ? 'white' : '#333',
                            fontWeight: '500',
                            border: 'none'
                        }}
                    >
                        Category List
                    </button>
                    <button
                        className={`nav-link text-start py-3 px-4 mb-2 ${activeTab === 'addEditCategory' ? 'active' : ''}`}
                        onClick={() => {
                            handleAddNewCategory();
                            setActiveTab('addEditCategory');
                        }}
                        style={{
                            borderRadius: '12px',
                            background: activeTab === 'addEditCategory' ? 'linear-gradient(90deg, #ff4d4d, #f9cb28)' : 'rgba(236, 236, 236, 0.7)',
                            color: activeTab === 'addEditCategory' ? 'white' : '#333',
                            fontWeight: '500',
                            border: 'none'
                        }}
                    >
                        {isEditingCategory ? 'Edit Category' : 'Add Category'}
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
                </div>
            </div>
        </div>
    );
};

export default Sidebar;