import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem',
                color: '#6b7280'
            }}>
                Cargando...
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page but save the attempted url
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        return <Navigate to="/crm/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
