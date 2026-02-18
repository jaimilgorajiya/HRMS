import { Navigate } from 'react-router';

export function RoleBasedRedirect() {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};
  const role = user.role?.toLowerCase();

  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'manager') return <Navigate to="/manager" replace />;
  if (role === 'employee') return <Navigate to="/employee" replace />;
  
  // If no role or unknown role, but authenticated (checked by RequireAuth), 
  // maybe default to a common page or back to login?
  // Since RequireAuth checks token, we assume they are logged in.
  // If role is missing, something is wrong with the data.
  // Defaulting to employee for safety, or error page.
  console.warn('RoleBasedRedirect: No valid role found, redirecting to login');
  return <Navigate to="/login" replace />; 
}
