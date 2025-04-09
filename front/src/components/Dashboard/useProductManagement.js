import { useState, useEffect } from 'react';
import productApi from '../../api/productService';
import categoryApi from '../../api/categoryService'; // Assuming you have this service

const useProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_slug: '',
        product_image: '',
        qty_in_stock: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(false);

    // Load products and categories on component mount
    useEffect(() => {
        loadProducts();
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
        try {
            const data = await categoryApi.getAllCategories();
            setCategories(data.data || []);
        } catch (error) {
            console.error("API Error loading categories:", error);
            // Not setting error message here to avoid confusion with product errors
        }
    };

    // Load products function
    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await productApi.getAllProducts();

            // Check if response.data is an array or a single product
            let productsArray = [];
            if (Array.isArray(response.data)) {
                productsArray = response.data;
            } else if (response.data && typeof response.data === 'object') {
                // If it's a single product object, convert to array with one element
                productsArray = [response.data];
            }

            // Transform products to flatten structure for easier use in UI
            const flattenedProducts = productsArray.map(product => {
                return {
                    name: product.name,
                    slug: product.slug,
                    description: product.description,
                    category_slug: product.category?.slug || '',
                    category_name: product.category?.name || '',
                    price: product.product_item?.price || '0.00',
                    qty_in_stock: product.product_item?.qty_in_stock || 0,
                    product_image: product.product_item?.product_image || ''
                };
            });

            setProducts(flattenedProducts);
        } catch (error) {
            console.error("API Error:", error);
            setErrorMessage('Failed to load products: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file' && files.length > 0) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    // In handleSubmit in useProductManagement.js
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            // Validate required fields
            if (!formData.name || !formData.category_slug) {
                throw new Error('Name and Category are required fields');
            }

            // Make sure numeric fields are properly formatted
            const preparedData = {
                name: formData.name,
                description: formData.description || '',
                category_slug: formData.category_slug,
                // Convert to number and ensure it's not NaN
                price: parseFloat(formData.price) || 0,
                // Convert to integer and ensure it's not NaN
                qty_in_stock: parseInt(formData.qty_in_stock) || 0,
                product_image: formData.product_image
            };

            if (isEditing) {
                const slug = formData.slug;
                await productApi.updateProduct(slug, preparedData);
                setSuccessMessage('Product updated successfully!');
            } else {
                await productApi.createProduct(preparedData);
                setSuccessMessage('Product added successfully!');
            }
            console.log("Submitting product data:", preparedData);
            await loadProducts();
            resetForm();
            setActiveTab('products');
        } catch (error) {
            console.error("Submission error:", error);
            if (error.response && error.response.data) {
                console.error("Server responded with:", error.response.data);
                setErrorMessage('Error saving product: ' + JSON.stringify(error.response.data.errors || error.response.data));
            } else {
                setErrorMessage('Error saving product: ' + (error.message || 'Unknown error'));
            }
        } finally {
            setLoading(false);
        }
    };


    // Handle edit button click
    const handleEdit = async (slug) => {
        setLoading(true);
        try {
            const response = await productApi.getProduct(slug);
            const productData = response.data;

            if (productData) {
                // Flatten the nested structure for form data
                const flattenedProduct = {
                    name: productData.name,
                    slug: productData.slug,
                    description: productData.description,
                    category_slug: productData.category?.slug || '',
                    price: productData.product_item?.price || '',
                    qty_in_stock: productData.product_item?.qty_in_stock || '',
                    product_image: productData.product_item?.product_image || ''
                };

                setFormData(flattenedProduct);
                setIsEditing(true);
                setActiveTab('addEdit');
            } else {
                throw new Error('Product not found');
            }
        } catch (error) {
            setErrorMessage('Failed to load product: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    // Handle delete button click
    const handleDelete = async (slug) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setLoading(true);
            try {
                await productApi.deleteProduct(slug);
                await loadProducts(); // Reload products after deletion
                setSuccessMessage('Product deleted successfully!');
            } catch (error) {
                setErrorMessage('Failed to delete product: ' + (error.message || 'Unknown error'));
            } finally {
                setLoading(false);
            }
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category_slug: '',
            product_image: '',
            qty_in_stock: ''
        });
        setIsEditing(false);
        setErrorMessage('');
        setSuccessMessage('');
    };

    // Handle add new button click
    const handleAddNew = () => {
        resetForm();
        setActiveTab('addEdit');
    };

    return {
        products,
        categories,
        formData,
        isEditing,
        errorMessage,
        successMessage,
        activeTab,
        loading,
        setActiveTab,
        handleChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        resetForm,
        handleAddNew
    };
};

export default useProductManagement;