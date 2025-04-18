import React, { useState } from 'react';
import Sidebar from './Dashboard/Sidebar';
import ProductList from './Dashboard/ProductList';
import ProductForm from './Dashboard/ProductForm';
import CategoryList from './Dashboard/CategoryList';
import CategoryForm from './Dashboard/CategoryForm';
import useProductManagement from './Dashboard/useProductManagement';
import useCategoryManagement from './Dashboard/useCategoryManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  // Product management
  const {
    products,
    categories,
    formData,
    isEditing,
    errorMessage: productErrorMessage,
    successMessage: productSuccessMessage,
    loading: productLoading,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    handleAddNew,
    setActiveTab: setProductActiveTab
  } = useProductManagement();

  // Category management
  const {
    categories: categoryList,  // Renamed to avoid conflict
    categoryData,
    isEditingCategory,
    errorMessage: categoryErrorMessage,
    successMessage: categorySuccessMessage,
    loading: categoryLoading,
    handleCategoryChange,
    handleCategorySubmit,
    handleEditCategory,
    handleDeleteCategory,
    resetCategoryForm,
    handleAddNewCategory
  } = useCategoryManagement();

  const handleAddNewProduct = () => {
    handleAddNew(); // This is the function from useProductManagement
    setActiveTab('addEdit'); // This updates the local activeTab state in AdminDashboard
  };

  // Modified category submit handler to redirect to category list afterwards
  const handleCategoryFormSubmit = async (e) => {
    await handleCategorySubmit(e);
    // Navigate to categories tab after successful submission
    setActiveTab('categories');
  };

  // Set active tab for both product and category management
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    if (['products', 'addEdit'].includes(tab)) {
      setProductActiveTab(tab);
    }
  };

  // Handle product edit
  const handleProductEdit = async (slug) => {
    await handleEdit(slug);
    setActiveTab('addEdit');
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 p-3" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab}
            handleAddNew={handleAddNewProduct}
            handleAddNewCategory={handleAddNewCategory}
            isEditing={isEditing}
            isEditingCategory={isEditingCategory}
          />
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-3" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
          <div className="row mb-4">
            <div className="col">
              <h1 className="display-5 fw-bold">Admin Dashboard</h1>
              <p className="text-muted">Manage your products and categories</p>
            </div>
          </div>

          {/* Product List */}
          {activeTab === 'products' && (
            <ProductList
              products={products}
              handleEdit={handleProductEdit}
              handleDelete={handleDelete}
              handleAddNew={handleAddNew}
              errorMessage={productErrorMessage}
              successMessage={productSuccessMessage}
              loading={productLoading}
            />
          )}

          {/* Product Form */}
          {activeTab === 'addEdit' && (
            <ProductForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isEditing={isEditing}
              resetForm={resetForm}
              setActiveTab={handleSetActiveTab}
              errorMessage={productErrorMessage}
              successMessage={productSuccessMessage}
              loading={productLoading}
              categories={categories}
            />
          )}

          {/* Category List */}
          {activeTab === 'categories' && (
            <CategoryList
              categories={categoryList}
              handleEditCategory={handleEditCategory}
              handleDeleteCategory={handleDeleteCategory}
              handleAddNewCategory={() => handleSetActiveTab('addEditCategory')}
              errorMessage={categoryErrorMessage}
              successMessage={categorySuccessMessage}
              loading={categoryLoading}
            />
          )}

          {/* Category Form */}
          {activeTab === 'addEditCategory' && (
            <CategoryForm
              categoryData={categoryData}
              handleCategoryChange={handleCategoryChange}
              handleCategorySubmit={handleCategoryFormSubmit}
              isEditingCategory={isEditingCategory}
              resetCategoryForm={resetCategoryForm}
              setActiveTab={handleSetActiveTab}
              errorMessage={categoryErrorMessage}
              successMessage={categorySuccessMessage}
              loading={categoryLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;