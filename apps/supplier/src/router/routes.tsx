import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { BrandingProvider } from '@energyiq/branding';
import { RequireAuth, RedirectIfAuth } from './auth-guard';
import { RegisterPage } from '@/ui/pages/auth/register-page';
import { VerifyPage } from '@/ui/pages/auth/verify-page';
import { LoginPage } from '@/ui/pages/auth/login-page';
import { DashboardPage } from '@/ui/pages/dashboard/dashboard-page';
import { TankMonitoringPage } from '@/ui/pages/inventory/tank-monitoring/tank-monitoring-page';
import { WarehouseInventoryPage } from '@/ui/pages/inventory/warehouse-inventory-page';
import { StockTransferPage } from '@/ui/pages/inventory/stock-transfer-page';
import { TransferHistoryPage } from '@/ui/pages/inventory/transfer-history-page';
import { CreateWarehousePage } from '@/ui/pages/inventory/create-warehouse-page';
import { ProductListPage } from '@/ui/pages/product/product-list-page';
import { AddProductPage } from '@/ui/pages/product/add-product-page';
import { CategoryListPage } from '@/ui/pages/product/category-list-page';
import { UnitListPage } from '@/ui/pages/product/unit-list-page';
import { DistributorListPage } from '@/ui/pages/distributor/distributor-list-page';
import { DistributorApprovalPage } from '@/ui/pages/distributor/distributor-approval-page';
import { DistributorInvitePage } from '@/ui/pages/distributor/distributor-invite-page';
import { OrdersPage } from '@/ui/pages/orders/orders-page';
import { SalesEntryPage } from '@/ui/pages/sales-entry/sales-entry-page';
import { AuditLogsPage } from '@/ui/pages/audit-logs/audit-logs-page';
import { OrderDetailPage } from '@/ui/pages/order/order-detail-page';
import { OrderDispatchPage } from '@/ui/pages/order/order-dispatch-page';
import { ComplaintsPage } from '@/ui/pages/complaints/complaints-page';
import { ComplaintDetailPage } from '@/ui/pages/complaint/complaint-detail-page';
import { TeamPermissionsPage } from '@/ui/pages/team-permissions/team-permissions-page';
import { KycDocumentsPage } from '@/ui/pages/kyc-documents/kyc-documents-page';
import { KycDocumentTypesPage } from '@/ui/pages/kyc-documents/kyc-document-types-page';
import { AddKycDocumentTypePage } from '@/ui/pages/kyc-documents/add-kyc-document-type-page';
import { KycReviewQueuePage } from '@/ui/pages/kyc-documents/kyc-review-queue-page';
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
              { path: '/:slug/inventory', element: <WarehouseInventoryPage /> },
              { path: '/:slug/inventory/transfer', element: <StockTransferPage /> },
              { path: '/:slug/inventory/transfer-history', element: <TransferHistoryPage /> },
              { path: '/:slug/inventory/create-warehouse', element: <CreateWarehousePage /> },
              { path: '/:slug/inventory/tank-monitoring', element: <TankMonitoringPage /> },
              { path: '/:slug/orders', element: <OrdersPage /> },
              { path: '/:slug/orders/:id', element: <OrderDetailPage /> },
              { path: '/:slug/orders/:id/dispatch', element: <OrderDispatchPage /> },
              { path: '/:slug/sales-entry', element: <SalesEntryPage /> },
              { path: '/:slug/audit-logs', element: <AuditLogsPage /> },
              { path: '/:slug/complaints', element: <ComplaintsPage /> },
              { path: '/:slug/complaints/:id', element: <ComplaintDetailPage /> },
              { path: '/:slug/team-permissions', element: <TeamPermissionsPage /> },
              { path: '/:slug/kyc-documents', element: <KycDocumentsPage /> },
              { path: '/:slug/kyc-documents/review', element: <KycReviewQueuePage /> },
              { path: '/:slug/kyc-documents/types', element: <KycDocumentTypesPage /> },
              { path: '/:slug/kyc-documents/types/new', element: <AddKycDocumentTypePage /> },
              { path: '/:slug/products', element: <ProductListPage /> },
              { path: '/:slug/products/new', element: <AddProductPage /> },
              { path: '/:slug/products/:id/edit', element: <AddProductPage /> },
              { path: '/:slug/products/categories', element: <CategoryListPage /> },
              { path: '/:slug/products/units', element: <UnitListPage /> },
              { path: '/:slug/distributors', element: <DistributorListPage /> },
              { path: '/:slug/distributors/approval', element: <DistributorApprovalPage /> },
              { path: '/:slug/distributors/invite', element: <DistributorInvitePage /> },
            ],
          },
        ],
      },
    ],
  },
]);
