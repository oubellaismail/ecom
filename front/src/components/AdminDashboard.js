import React from 'react';
import Sidebar from './Dashboard/Sidebar';
import ProductList from './Dashboard/ProductList';
import ProductForm from './Dashboard/ProductForm';
import CategoryList from './Dashboard/CategoryList';
import CategoryForm from './Dashboard/CategoryForm';
import useProductManagement from './Dashboard/useProductManagement';
import useCategoryManagement from './Dashboard/useCategoryManagement';

const AdminDashboard = () => {
  // Initial product data
  const initialProducts = [
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
  ];

  // Initial category data
  const initialCategories = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      productCount: 1
    },
    {
      id: 2,
      name: 'Wearables',
      description: 'Wearable technology devices',
      productCount: 1
    },
    {
      id: 3,
      name: 'Computers',
      description: 'Laptops, desktops, and computing accessories',
      productCount: 1
    }
  ];

  // Use custom hooks for product and category management
  const {
    products,
    formData,
    isEditing,
    errorMessage: productErrorMessage,
    successMessage: productSuccessMessage,
    activeTab,
    setActiveTab,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    handleAddNew
  } = useProductManagement(initialProducts);

  const {
    categories,
    categoryData,
    isEditingCategory,
    errorMessage: categoryErrorMessage,
    successMessage: categorySuccessMessage,
    handleCategoryChange,
    handleCategorySubmit,
    handleEditCategory,
    handleDeleteCategory,
    resetCategoryForm,
    handleAddNewCategory
  } = useCategoryManagement(initialCategories);

  // Function to determine which component to render based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <ProductList
            products={products}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleAddNew={handleAddNew}
            errorMessage={productErrorMessage}
            successMessage={productSuccessMessage}
          />
        );
      case 'addEdit':
        return (
          <ProductForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isEditing={isEditing}
            resetForm={resetForm}
            setActiveTab={setActiveTab}
            errorMessage={productErrorMessage}
            successMessage={productSuccessMessage}
          />
        );
      case 'categories':
        return (
          <CategoryList
            categories={categories}
            handleEditCategory={handleEditCategory}
            handleDeleteCategory={handleDeleteCategory}
            handleAddNewCategory={() => {
              handleAddNewCategory();
              setActiveTab('addEditCategory');
            }}
            errorMessage={categoryErrorMessage}
            successMessage={categorySuccessMessage}
          />
        );
      case 'addEditCategory':
        return (
          <CategoryForm
            categoryData={categoryData}
            handleCategoryChange={handleCategoryChange}
            handleCategorySubmit={handleCategorySubmit}
            isEditingCategory={isEditingCategory}
            resetCategoryForm={resetCategoryForm}
            setActiveTab={setActiveTab}
            errorMessage={categoryErrorMessage}
            successMessage={categorySuccessMessage}
          />
        );
      default:
        return <ProductList products={products} handleEdit={handleEdit} handleDelete={handleDelete} />;
    }
  };

  return (
    <div className="container-fluid py-4" style={{
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
      minHeight: '100vh'
    }}>
      <div className="row">
        <div className="col-md-3 mb-4">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleAddNew={handleAddNew}
            handleAddNewCategory={handleAddNewCategory}
            isEditing={isEditing}
            isEditingCategory={isEditingCategory}
          />
        </div>

        <div className="col-md-9">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;