import { Navigate, Outlet, useLocation } from 'react-router';

export function RequireAuth() {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirect to the login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
