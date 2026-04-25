// Primitives (shadcn/Base UI)
export * from './primitives/badge';
export * from './primitives/button';
export * from './primitives/command';
export * from './primitives/dialog';
export * from './primitives/input';
export * from './primitives/input-group';
export * from './primitives/input-otp';
export * from './primitives/label';
export * from './primitives/popover';
export * from './primitives/scroll-area';
export * from './primitives/select';
export * from './primitives/separator';
export * from './primitives/textarea';

// Business fields
export * from './fields';

// Generic components
export { FormError } from './components/feedback/form-error';

// Layouts
export { AuthLayout } from './layouts/auth-layout';
export { DashboardLayout } from './layouts/dashboard-layout';

// Hooks
export { useAuth } from './hooks/use-auth';

// Auth forms (shared between supplier + distributor apps)
export { LoginForm } from './forms/auth/login-form';
export { RegisterForm } from './forms/auth/register-form';
export { VerifyForm } from './forms/auth/verify-form';

// Validation schemas
export * from './validation/auth/login';
export * from './validation/auth/register';
export * from './validation/auth/verify';
