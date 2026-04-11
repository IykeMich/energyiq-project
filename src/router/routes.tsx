import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/ui/layouts/auth-layout';
import { DashboardLayout } from '@/ui/layouts/dashboard-layout';
import { RequireAuth, RedirectIfAuth } from './auth-guard';
import { RegisterPage } from '@/ui/pages/auth/register-page';
import { VerifyPage } from '@/ui/pages/auth/verify-page';
import { LoginPage } from '@/ui/pages/auth/login-page';
import { DashboardPage } from '@/ui/pages/dashboard/dashboard-page';

export const router = createBrowserRouter([
  // Public auth routes — redirect to dashboard if already logged in
  {
    element: <RedirectIfAuth />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/register', element: <RegisterPage /> },
          { path: '/verify', element: <VerifyPage /> },
          { path: '/login', element: <LoginPage /> },
        ],
      },
    ],
  },

  // Protected routes — redirect to login if not authenticated
  {
    element: <RequireAuth />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          // TODO: Add module pages as they're implemented
        ],
      },
    ],
  },

  // Root redirect
  { path: '/', element: <RedirectToDefault /> },
]);

function RedirectToDefault() {
  return <LoginPage />;
}
