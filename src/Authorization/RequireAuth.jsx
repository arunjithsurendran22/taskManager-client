import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const isAuthenticated = localStorage.getItem("accessTokenUser");

  if (!isAuthenticated) {
    
    return <Navigate to="/" />;
  }
  // Render the child components if the user is authenticated
  return <>{children}</>;
};

export default RequireAuth;
