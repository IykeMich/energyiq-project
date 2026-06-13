import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { BrandingProvider } from '@energyiq/branding';
import { DashboardLayout } from '@/ui/layouts/dashboard-layout';
import { RequireAuth, RedirectIfAuth } from './auth-guard';
import { RegisterPage } from '@/ui/pages/auth/register-page';
import { VerifyPage } from '@/ui/pages/auth/verify-page';
import { LoginPage } from '@/ui/pages/auth/login-page';
import { DashboardPage } from '@/ui/pages/dashboard/dashboard-page';
import { OrdersPage } from '@/ui/pages/orders/orders-page';
import { CreateOrderPage } from '@/ui/pages/orders/create-order-page';
import { EditOrderPage } from '@/ui/pages/orders/edit-order-page';
import { OrderDetailPage } from '@/ui/pages/orders/order-detail-page';
import { ComplaintsPage } from '@/ui/pages/complaints/complaints-page';

// Authenticated routes live under tenant-slug paths (/:slug/dashboard, …).
// Public auth routes (/login, /register, /verify) are reachable until the user
// logs in, after which they're redirected into the dashboard.
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
              { path: '/:slug/dashboard', element: <DashboardPage /> },
              { path: '/:slug/orders', element: <OrdersPage /> },
              { path: '/:slug/orders/new', element: <CreateOrderPage /> },
              { path: '/:slug/orders/:id', element: <OrderDetailPage /> },
              { path: '/:slug/orders/:id/edit', element: <EditOrderPage /> },
              { path: '/:slug/complaints', element: <ComplaintsPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
