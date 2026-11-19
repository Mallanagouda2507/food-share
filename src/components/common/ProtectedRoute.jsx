import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LoadingSpinner } from "./LoadingSpinner";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Checking authentication & permissions..." />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role) && role !== "Admin") {
    // If user has wrong role, redirect to their role's dashboard
    if (role === "Donor") {
      return <Navigate to="/donor/dashboard" replace />;
    } else {
      return <Navigate to="/receiver/dashboard" replace />;
    }
  }

  return children;
};
