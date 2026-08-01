import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

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

  if (!isValid) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;