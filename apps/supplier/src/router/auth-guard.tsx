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
  const { isAuthenticated, user, slug: stateSlug } = useAuth();

  if (isAuthenticated) {
    // Routes are slug-prefixed (/:slug/dashboard). Source the slug the same way
    // the sidebar does. With the temp login bypass this resolves to 'demo';
    // once the real auth endpoint lands it becomes the tenant's actual slug.
    const slug = user?.slug ?? stateSlug ?? 'demo';
    return <Navigate to={`/${slug}/dashboard`} replace />;
  }

  return <Outlet />;
}
