import { Navigate, Outlet } from "react-router-dom";
import React from "react";
import Cookie from "js-cookie";

const ProtectedRoute = () => {
  const token = Cookie.get("trelloToken");
  if (token === undefined) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
