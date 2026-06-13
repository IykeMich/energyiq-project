// Primitives (shadcn/Base UI)
export * from './primitives/avatar';
export * from './primitives/badge';
export * from './primitives/button';
export * from './primitives/collapsible';
export * from './primitives/command';
export * from './primitives/dialog';
export * from './primitives/dropdown-menu';
export * from './primitives/input';
export * from './primitives/input-group';
export * from './primitives/input-otp';
export * from './primitives/label';
export * from './primitives/notification-badge';
export * from './primitives/popover';
export * from './primitives/scroll-area';
export * from './primitives/select';
export * from './primitives/separator';
export * from './primitives/sheet';
export * from './primitives/sidebar';
export * from './primitives/textarea';
export * from './primitives/tooltip';

// Business fields
export * from './fields';

// Generic components
export { FormError } from './components/feedback/form-error';
export { SectionHeader } from './components/section-header';
export { Toaster, toast, notifyNoAccess } from './components/toast/toaster';
export { Modal, type ModalSize } from './components/modal';
export { ConfirmDialog, type ConfirmIntent } from './components/confirm-dialog';
export {
  SuccessModal,
  type SuccessModalDetail,
  type SuccessModalAction,
} from './components/success-modal';
export { WizardStepPills, type WizardStepPillsProps } from './components/wizard-step-pills';
export { LoadingOverlay } from './components/loading-overlay';
export { DataGrid, type DataGridProps, type ColDef, type GridOptions } from './components/data-grid/data-grid';

// Layouts
export { AuthLayout } from './layouts/auth-layout';
export { DashboardLayout } from './layouts/dashboard-layout';

// Hooks
export { useAuth } from './hooks/use-auth';

// Auth forms (shared between supplier + distributor apps)
export { LoginForm } from './forms/auth/login-form';
export { RegisterForm } from './forms/auth/register-form';
export { VerifyForm } from './forms/auth/verify-form';
export { DistributorForm } from './forms/auth/distributor-form';

// Validation schemas
export * from './validation/auth/login';
export * from './validation/auth/register';
export * from './validation/auth/verify';
