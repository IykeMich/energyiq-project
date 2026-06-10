import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { BrandingProvider } from '@energyiq/branding';
import { RequireAuth, RedirectIfAuth } from './auth-guard';
import { RegisterPage } from '@/ui/pages/auth/register-page';
import { VerifyPage } from '@/ui/pages/auth/verify-page';
import { LoginPage } from '@/ui/pages/auth/login-page';
import { DashboardPage } from '@/ui/pages/dashboard/dashboard-page';
import { TankMonitoringPage } from '@/ui/pages/inventory/tank-monitoring/tank-monitoring-page';
import { ProductListPage } from '@/ui/pages/product/product-list-page';
import { AddProductPage } from '@/ui/pages/product/add-product-page';
import { CategoryListPage } from '@/ui/pages/product/category-list-page';
import { UnitListPage } from '@/ui/pages/product/unit-list-page';
import { DistributorListPage } from '@/ui/pages/distributor/distributor-list-page';
import { DashboardLayout } from '@/ui/layouts/dashboard-layout';

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
              { path: '/:slug/inventory/tank-monitoring', element: <TankMonitoringPage /> },
              { path: '/:slug/products', element: <ProductListPage /> },
              { path: '/:slug/products/new', element: <AddProductPage /> },
              { path: '/:slug/products/:id/edit', element: <AddProductPage /> },
              { path: '/:slug/products/categories', element: <CategoryListPage /> },
              { path: '/:slug/products/units', element: <UnitListPage /> },
              { path: '/:slug/distributors', element: <DistributorListPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
