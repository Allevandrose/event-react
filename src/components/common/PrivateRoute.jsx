import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const { user, accessToken } = useSelector((state) => state.auth); // ✅ Ensure correct state usage

  // ✅ Redirect if not authenticated
  if (!accessToken) return <Navigate to="/login" replace />;

  // ✅ Check role access if specified
  if (role && user?.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default PrivateRoute;
