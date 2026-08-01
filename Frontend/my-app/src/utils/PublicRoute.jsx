import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  let isValid = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
        isValid = true;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  // If already logged in & valid token → go to dashboard
  if (isValid) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;