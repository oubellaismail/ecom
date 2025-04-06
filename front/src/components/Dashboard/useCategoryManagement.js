import { useState } from 'react';

const useCategoryManagement = (initialCategories = []) => {
    const [categories, setCategories] = useState(initialCategories);
    const [categoryData, setCategoryData] = useState({
        id: '',
        name: '',
        description: '',
        productCount: 0
    });
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Handle form input changes
    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({
            ...categoryData,
            [name]: value,
        });
    };

    // Handle form submission for adding/editing categories
    const handleCategorySubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!categoryData.name) {
            setErrorMessage('Category name is required.');
            return;
        }

        try {
            if (isEditingCategory) {
                // Update existing category
                setCategories(prevCategories =>
                    prevCategories.map(category =>
                        category.id === categoryData.id ? categoryData : category
                    )
                );
                setSuccessMessage('Category updated successfully!');
            } else {
                // Add new category with a new ID
                const newCategory = {
                    ...categoryData,
                    id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
                    productCount: 0
                };
                setCategories([...categories, newCategory]);
                setSuccessMessage('Category added successfully!');
            }

            // Reset form after submission
            resetCategoryForm();
        } catch (error) {
            setErrorMessage(error.message || 'Operation failed');
            console.error('Error:', error);
        }
    };

    // Function to handle edit button click
    const handleEditCategory = (category) => {
        setCategoryData(category);
        setIsEditingCategory(true);
        setErrorMessage('');
        setSuccessMessage('');
    };

    // Function to handle delete button click
    const handleDeleteCategory = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
            setSuccessMessage('Category deleted successfully!');
        }
    };

    // Function to reset form
    const resetCategoryForm = () => {
        setCategoryData({
            id: '',
            name: '',
            description: '',
            productCount: 0
        });
        setIsEditingCategory(false);
    };

    // Handler for Add New Category button
    const handleAddNewCategory = () => {
        resetCategoryForm();
        setErrorMessage('');
        setSuccessMessage('');
    };

    return {
        categories,
        categoryData,
        isEditingCategory,
        errorMessage,
        successMessage,
        handleCategoryChange,
        handleCategorySubmit,
        handleEditCategory,
        handleDeleteCategory,
        resetCategoryForm,
        handleAddNewCategory
    };
};

export default useCategoryManagement;