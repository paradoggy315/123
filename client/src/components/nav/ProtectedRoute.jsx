import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../pages/auth/AuthContext';

// This component expects a component to render and a role that is required to access that component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  } else if (requiredRole && user.role !== requiredRole) {
    // User does not have the required role, redirect to home or a "not authorized" page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;