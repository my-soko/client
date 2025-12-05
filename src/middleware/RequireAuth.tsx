import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import type { JSX } from "react";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
};

export default RequireAuth;
