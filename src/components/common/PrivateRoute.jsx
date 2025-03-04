import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const { user, accessToken } = useSelector((state) => state.auth);

  if (!accessToken) return <Navigate to="/login" replace />;

  if (!user) return <div>Loading...</div>; // Handle loading state gracefully

  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default PrivateRoute;
