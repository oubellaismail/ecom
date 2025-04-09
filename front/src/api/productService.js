import axiosInstance from './axiosInstance';

export const productApi = {
    // Get all products with optional filtering
    getAllProducts: async (filters = {}) => {
        try {
            const response = await axiosInstance.get('/products', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
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
                if (key !== 'product_image' ||
                    !(typeof productData.product_image === 'string' &&
                        productData.product_image.startsWith('data:'))) {
                    formData.append(key, productData[key]);
                }
            });

            // Handle product image
            if (productData.product_image) {
                if (typeof productData.product_image === 'string' &&
                    productData.product_image.startsWith('data:')) {
                    // Convert base64 to blob
                    const response = await fetch(productData.product_image);
                    const blob = await response.blob();
                    formData.append('product_image', blob, 'product_image.jpg');
                } else if (productData.product_image instanceof File) {
                    // It's already a File object
                    formData.append('product_image', productData.product_image);
                }
            }

            // Need to override the Content-Type header for FormData
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
                if (key !== 'product_image' ||
                    !(typeof productData.product_image === 'string' &&
                        productData.product_image.startsWith('data:'))) {
                    formData.append(key, productData[key]);
                }
            });

            // Handle product image
            if (productData.product_image) {
                if (typeof productData.product_image === 'string' &&
                    productData.product_image.startsWith('data:')) {
                    // Convert base64 to blob
                    const response = await fetch(productData.product_image);
                    const blob = await response.blob();
                    formData.append('product_image', blob, 'product_image.jpg');
                } else if (productData.product_image instanceof File) {
                    // It's already a File object
                    formData.append('product_image', productData.product_image);
                }
            }

            // Need to override the Content-Type header for FormData
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