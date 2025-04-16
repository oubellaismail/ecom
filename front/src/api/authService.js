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

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/login', credentials);

    // Store the authToken for backward compatibility with your existing code
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    // Store the access_token for the new authorization header system
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);

    }

    // Return the full response data with tokens and user info
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Login failed. Please try again.');
    }
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post('/logout');
    // Clear all auth-related items from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');
    return true;
  } catch (error) {
    // Even if the API call fails, clear the local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');
    throw error.response?.data || { message: 'Logout failed' };
  }
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
