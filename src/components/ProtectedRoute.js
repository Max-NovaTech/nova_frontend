import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  // Check if user is authenticated with proper validation
  if (!token || !userRole || !isLoggedIn || isLoggedIn !== 'true') {
    // Clear any corrupted auth data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
