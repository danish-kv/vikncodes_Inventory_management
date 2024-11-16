import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthProtection = ({ element, redirectTo }) => {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return element;
};

export default AuthProtection;