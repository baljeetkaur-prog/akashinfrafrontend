import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("adminToken");

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  // Logged in → allow access
  return <Outlet />;
};

export default AdminProtectedRoute;
