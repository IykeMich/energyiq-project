import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@energyiq/ui';

// Redirects to login if not authenticated
export function RequireAuth() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Redirects to dashboard if already authenticated.
export function RedirectIfAuth() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
