import axiosInstance from "./axiosInstance";


export const productStore = async (formData) => {
    try {
        const response = await axiosInstance.post('/store', formData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.errors
            ? { message: Object.values(error.response.data.errors).flat().join(', ') }
            : error.response?.data || { message: 'Network Error' };
    }

};