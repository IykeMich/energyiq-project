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

// Redirects to the tenant-scoped dashboard if already authenticated.
// Falls back to 'demo' to match the TEMP login bypass in @energyiq/ui's LoginForm.
export function RedirectIfAuth() {
  const { isAuthenticated, slug } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={`/${slug ?? 'demo'}/dashboard`} replace />;
  }

  return <Outlet />;
}
