import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (isAuthenticated) {
    // If user is already logged in, redirect to home or dashboard
    const redirectPath = user?.role === 'admin' ? '/admin/product' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  // If not logged in, allow access to auth pages (Signin/Signup)
  return <Outlet />;
};

export default AuthRoute;
