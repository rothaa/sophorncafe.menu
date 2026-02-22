import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useStore();

    if (loading) {
        return <div className="container section-padding text-center">Checking Authentication...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
