import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  // Redux se auth state fetch karo
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    // Agar authenticated nahi hai, to login pe bhej do
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role allowed nahi hai to unauthorized page dikhao (or redirect to home)
    return <Navigate to="/signup" replace />;
  }

  // Sab sahi hai to andar ka component dikhaye
  return <Outlet />;
};

export default PrivateRoute;
