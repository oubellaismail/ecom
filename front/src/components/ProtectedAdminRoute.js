import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
    const { isLoggedIn, isAdmin } = useAuth();

    if (!isLoggedIn || !isAdmin) {
        // If not authenticated or not admin, redirect to home
        return <Navigate to="/" replace />;
    }

    // If authenticated and admin, render the children
    return children;
};

export default ProtectedAdminRoute; 