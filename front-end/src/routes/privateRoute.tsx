import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
