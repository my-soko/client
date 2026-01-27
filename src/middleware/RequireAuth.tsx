import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import type { JSX } from "react";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, initialized } = useSelector(
  (state: RootState) => state.auth
);

if (!initialized) {
  return (
    <div className="h-screen flex items-center justify-center">
      Restoring session…
    </div>
  );
}

if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}

return children;

};

export default RequireAuth;
