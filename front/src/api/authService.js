import axiosInstance from "./axiosInstance";

export const registerUser = async (userData) => {

  
  try {
    const response = await axiosInstance.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.errors
  ? { message: Object.values(error.response.data.errors).flat().join(', ') }
  : error.response?.data || { message: 'Network Error' };
  }
  
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await axiosInstance.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post('/reset-password', {
      token,
      password: newPassword
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/login', credentials);
    
    // Store token in localStorage if your API returns one
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('authToken');
};
export const AddProducts = async (userData) => {

  
  try {
    const response = await axiosInstance.post('/products', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.errors
  ? { message: Object.values(error.response.data.errors).flat().join(', ') }
  : error.response?.data || { message: 'Network Error' };
  }
  
};

export const AddCategories = async (userData) => {

  
  try {
    const response = await axiosInstance.post('/categories', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.errors
  ? { message: Object.values(error.response.data.errors).flat().join(', ') }
  : error.response?.data || { message: 'Network Error' };
  }
  
};