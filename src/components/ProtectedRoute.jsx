import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));

  if (!authenticatedUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.includes(authenticatedUser.role)) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;