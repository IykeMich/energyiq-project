import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from '@energyiq/ui';
import { BrandingProvider } from '@energyiq/branding';
import { RequireAuth, RedirectIfAuth } from './auth-guard';
import { RegisterPage } from '@/ui/pages/auth/register-page';
import { VerifyPage } from '@/ui/pages/auth/verify-page';
import { LoginPage } from '@/ui/pages/auth/login-page';
import { DashboardPage } from '@/ui/pages/dashboard/dashboard-page';

// Authenticated routes live under flat paths (/dashboard, …).
// Public auth routes (/login, /register, /verify) are reachable until the user
// logs in, after which they're redirected into /dashboard.
function Root() {
  return (
    <BrandingProvider>
      <Outlet />
    </BrandingProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },

      // Public auth routes — redirect to dashboard if already logged in.
      // Each auth page wraps itself with <AuthLayout title="..." subtitle="...">.
      {
        element: <RedirectIfAuth />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/verify', element: <VerifyPage /> },
        ],
      },

      // Protected routes — redirect to login if not authed.
      {
        element: <RequireAuth />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/dashboard', element: <DashboardPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
