import React from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("jwtToken");
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default PrivateRoute;
