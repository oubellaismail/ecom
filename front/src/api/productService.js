import axiosInstance from './axiosInstance';

export const productApi = {
    // Get all products with optional filtering
    getProducts: async (filters = {}) => {
        try {
            const response = await axiosInstance.get('/products', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await axiosInstance.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Get single product by slug
    getProduct: async (slug) => {
        try {
            const response = await axiosInstance.get(`/products/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    // Create a new product
    createProduct: async (productData) => {
        try {
            const formData = new FormData();

            // Add all non-file fields to form data
            Object.keys(productData).forEach(key => {
                if (key !== 'product_image') {
                    formData.append(key, productData[key]);
                }
            });

            // Handle product image
            if (productData.product_image) {
                if (productData.product_image instanceof File) {
                    formData.append('product_image', productData.product_image);
                } else if (typeof productData.product_image === 'object' && productData.product_image.file) {
                    formData.append('product_image', productData.product_image.file);
                }
            }

            const response = await axiosInstance.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    // Update an existing product
    updateProduct: async (slug, productData) => {
        try {
            const formData = new FormData();

            // Add all non-file fields to form data
            Object.keys(productData).forEach(key => {
                if (key !== 'product_image') {
                    formData.append(key, productData[key]);
                }
            });

            // Handle product image
            if (productData.product_image) {
                if (productData.product_image instanceof File) {
                    formData.append('product_image', productData.product_image);
                } else if (typeof productData.product_image === 'object' && productData.product_image.file) {
                    formData.append('product_image', productData.product_image.file);
                }
            }

            const response = await axiosInstance.put(`/products/${slug}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    // Delete a product
    deleteProduct: async (slug) => {
        try {
            const response = await axiosInstance.delete(`/products/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
};

export default productApi;