import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from '@energyiq/ui';
import { BrandingProvider } from '@energyiq/branding';
import { RequireAuth, RedirectIfAuth } from './auth-guard';
import { RegisterPage } from '@/ui/pages/auth/register-page';
import { VerifyPage } from '@/ui/pages/auth/verify-page';
import { LoginPage } from '@/ui/pages/auth/login-page';
import { DashboardPage } from '@/ui/pages/dashboard/dashboard-page';

// Slug-aware routes: every authenticated path is /:slug/<page>.
// Public auth routes (/login, /register, /verify) are tenant-agnostic until
// the user hits the supplier subdomain, after which they're redirected into
// /:slug/dashboard.
//
// BrandingProvider lives at the root so it watches useLocation and applies
// the right CSS vars whenever the slug changes.
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

      // Protected routes under /:slug/* — redirect to login if not authed.
      {
        element: <RequireAuth />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/:slug/dashboard', element: <DashboardPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
