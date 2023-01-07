import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const useAuth = () => {
    const user = localStorage.getItem("accessToken");
    return user ? true : false;
  };
  const auth = useAuth();

  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
