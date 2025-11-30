import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../features/auth/useAuthStore';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.some((r) => user.roles?.includes(r))) {
    return <Navigate to="/" replace />;
  }

  return children;
}
