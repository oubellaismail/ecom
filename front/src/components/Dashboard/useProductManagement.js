import { useState } from 'react';

const useProductManagement = (initialProducts = []) => {
    const [products, setProducts] = useState(initialProducts);
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


    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData((prev) => ({
                        ...prev,
                        [name]: reader.result, // base64 string
                    }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: name === 'price' || name === 'qty_in_stock' ? parseFloat(value) || '' : value,
            }));
        }
    };

    // Handle form submission for adding/editing products
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.description || !formData.price) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        try {
            if (isEditing) {
                // Update existing product
                setProducts(prevProducts =>
                    prevProducts.map(product =>
                        product.slug === formData.slug ? formData : product
                    )
                );
                setSuccessMessage('Product updated successfully!');
            } else {
                // Add new product with a new ID
                const newProduct = {
                    ...formData
                };
                setProducts([...products, newProduct]);
                setSuccessMessage('Product added successfully!');
            }

            // Reset form after submission
            resetForm();
        } catch (error) {
            setErrorMessage(error.message || 'Operation failed');
            console.error('Error:', error);
        }
    };

    // Function to handle edit button click
    const handleEdit = (product) => {
        setFormData(product);
        setIsEditing(true);
        setActiveTab('addEdit');
        setErrorMessage('');
        setSuccessMessage('');
    };

    // Function to handle delete button click
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
            setSuccessMessage('Product deleted successfully!');
        }
    };

    // Function to reset form
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
    };

    // Handler for Add New Product button
    const handleAddNew = () => {
        resetForm();
        setActiveTab('addEdit');
        setErrorMessage('');
        setSuccessMessage('');
    };

    return {
        products,
        formData,
        isEditing,
        errorMessage,
        successMessage,
        activeTab,
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