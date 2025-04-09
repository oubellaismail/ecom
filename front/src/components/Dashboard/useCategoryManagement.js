import { useState, useEffect } from 'react';
import categoryApi from '../../api/categoryService';

const useCategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [categoryData, setCategoryData] = useState({
        name: '',
        slug: '',
        description: ''
    });
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Load categories on component mount
    useEffect(() => {
        loadCategories();
    }, []);

    // Clear messages after delay
    useEffect(() => {
        if (errorMessage || successMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
                setSuccessMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage, successMessage]);

    // Load categories function
    const loadCategories = async () => {
        setLoading(true);
        try {
            const response = await categoryApi.getAllCategories();

            // Check if response.data is an array or wrap a single item in an array
            let categoriesArray = [];
            if (Array.isArray(response.data)) {
                categoriesArray = response.data;
            } else if (response.data && typeof response.data === 'object') {
                categoriesArray = [response.data];
            }

            setCategories(categoriesArray);
        } catch (error) {
            console.error("API Error:", error);
            setErrorMessage('Failed to load categories: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({ ...categoryData, [name]: value });

        // Auto-generate slug from name if this is a new category
        if (name === 'name' && !isEditingCategory) {
            const slug = value.toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text

            setCategoryData(prev => ({ ...prev, slug }));
        }
    };

    // Handle form submission
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            if (isEditingCategory) {
                await categoryApi.updateCategory(categoryData.slug, categoryData);
                setSuccessMessage('Category updated successfully!');
            } else {
                await categoryApi.createCategory(categoryData);
                setSuccessMessage('Category added successfully!');
            }

            // Reload categories from API after changes
            await loadCategories();
            resetCategoryForm();
        } catch (error) {
            setErrorMessage('Error saving category: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    // Handle edit button click
    const handleEditCategory = async (slug) => {
        setLoading(true);
        try {
            const response = await categoryApi.getCategory(slug);
            const category = response.data;

            if (category) {
                setCategoryData(category);
                setIsEditingCategory(true);
            } else {
                throw new Error('Category not found');
            }
        } catch (error) {
            setErrorMessage('Failed to load category: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    // Handle delete button click
    const handleDeleteCategory = async (slug) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setLoading(true);
            try {
                await categoryApi.deleteCategory(slug);
                await loadCategories(); // Reload categories after deletion
                setSuccessMessage('Category deleted successfully!');
            } catch (error) {
                setErrorMessage('Failed to delete category: ' + (error.message || 'Unknown error'));
            } finally {
                setLoading(false);
            }
        }
    };

    // Reset form
    const resetCategoryForm = () => {
        setCategoryData({
            name: '',
            slug: '',
            description: ''
        });
        setIsEditingCategory(false);
        setErrorMessage('');
        setSuccessMessage('');
    };

    // Handle add new button click
    const handleAddNewCategory = () => {
        resetCategoryForm();
    };

    return {
        categories,
        categoryData,
        isEditingCategory,
        errorMessage,
        successMessage,
        loading,
        handleCategoryChange,
        handleCategorySubmit,
        handleEditCategory,
        handleDeleteCategory,
        resetCategoryForm,
        handleAddNewCategory
    };
};

export default useCategoryManagement;