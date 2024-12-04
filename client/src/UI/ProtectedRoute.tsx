// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../Context/userContext";
import { LoadingState } from "./LoadingState";
interface ProtectedRouteProps {
  requiredRole: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  children,
}) => {
  const { user } = useUser();
  const navigate = useNavigate();
  if (user.loading) {
    return <LoadingState />;
  }

  console.log(user, "user in protected route");

  if (!user || user.role !== requiredRole) {
    navigate("/login");
    return <>please authenticate </>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
