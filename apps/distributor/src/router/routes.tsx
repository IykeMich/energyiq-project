import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { BrandingProvider } from "@energyiq/branding";
import { DashboardLayout } from "@/ui/layouts/dashboard-layout";
import { RequireAuth, RedirectIfAuth } from "./auth-guard";
import { RegisterPage } from "@/ui/pages/auth/register-page";
import { VerifyPage } from "@/ui/pages/auth/verify-page";
import { OnboardingInvitePage } from "@/ui/pages/auth/onboarding-invite-page";
import { ResumeOnboardingPage } from "@/ui/pages/auth/resume-onboarding-page";
import { LoginPage } from "@/ui/pages/auth/login-page";
import { DashboardPage } from "@/ui/pages/dashboard/dashboard-page";
import { OrdersPage } from "@/ui/pages/orders/orders-page";
import { CreateOrderPage } from "@/ui/pages/orders/create-order-page";
import { EditOrderPage } from "@/ui/pages/orders/edit-order-page";
import { OrderDetailPage } from "@/ui/pages/orders/order-detail-page";
import { ComplaintsPage } from "@/ui/pages/complaints/complaints-page";
import { DocumentsPage } from "@/ui/pages/documents/documents-page";
import { SalesPage } from "@/ui/pages/sales/sales-page";
import { ExpensesPage } from "@/ui/pages/expenses/expenses-page";
import { TankMonitoringPage } from "@/ui/pages/tankmonitoring/tank-monitoring-page";
import { RecordSalesPage } from "@/ui/pages/records-sales/record-sales-page";
import { ForgotPasswordPage } from "@/ui/pages/auth/forgot-password-page";
import { CheckEmailPage } from "@/ui/pages/auth/email-page";
import { ResetPasswordPage } from "@/ui/pages/auth/reset-page";
import { PumpPage } from "@/ui/pages/pump-meters/pump-page";
import { PumpBranchDetails } from "@/ui/components/pump-meters/PumpBranchDetails";
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
      { path: "/", element: <Navigate to="/login" replace /> },

      // Public auth routes — redirect to dashboard if already logged in.
      // Each auth page wraps itself with <AuthLayout title="..." subtitle="...">.
      {
        element: <RedirectIfAuth />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/register/supplier", element: <RegisterPage /> },
          { path: "/register/distributor", element: <RegisterPage /> },
          {
            path: "/distributor/onboarding",
            element: <OnboardingInvitePage />,
          },
          { path: "/verify", element: <VerifyPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/check-email", element: <CheckEmailPage /> },
          { path: "/reset-password", element: <ResetPasswordPage /> },
        ],
      },

      // Protected routes — redirect to login if not authed.
      {
        element: <RequireAuth />,
        children: [
          // Resume onboarding — for an authenticated distributor whose
          // registration is mid-flight (login next_action=complete_onboarding).
          // Renders outside DashboardLayout since there's no tenant dashboard yet.
          { path: "/:slug/onboarding", element: <ResumeOnboardingPage /> },
          {
            element: <DashboardLayout />,
            children: [
              { path: "/:slug/dashboard", element: <DashboardPage /> },
              { path: "/:slug/orders", element: <OrdersPage /> },
              { path: "/:slug/orders/new", element: <CreateOrderPage /> },
              { path: "/:slug/orders/:id", element: <OrderDetailPage /> },
              { path: "/:slug/orders/:id/edit", element: <EditOrderPage /> },
              { path: "/:slug/complaints", element: <ComplaintsPage /> },
              { path: "/:slug/documents", element: <DocumentsPage /> },
              { path: "/:slug/record-sales", element: <RecordSalesPage /> },
              { path: "/:slug/sales-history", element: <SalesPage /> },
              { path: "/:slug/expenses", element: <ExpensesPage /> },
              {
                path: "/:slug/tank-monitoring",
                element: <TankMonitoringPage />,
              },
              { path: "/:slug/pump-meters", element: <PumpPage /> },
              {
                path: "/:slug/pump-meters/:id",
                element: <PumpBranchDetails />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
