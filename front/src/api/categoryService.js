import axiosInstance from './axiosInstance';

export const categoryApi = {
    // Get all categories
    getAllCategories: async () => {
        try {
            const response = await axiosInstance.get('/categories');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get single category by slug
    getCategory: async (slug) => {
        try {
            const response = await axiosInstance.get(`/categories/${slug}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create a new category
    createCategory: async (categoryData) => {
        try {
            const response = await axiosInstance.post('/categories', categoryData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update an existing category
    updateCategory: async (slug, categoryData) => {
        try {
            const response = await axiosInstance.put(`/categories/${slug}`, categoryData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete a category
    deleteCategory: async (slug) => {
        try {
            const response = await axiosInstance.delete(`/categories/${slug}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default categoryApi;