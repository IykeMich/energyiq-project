import { http, HttpResponse } from 'msw';
import { buildInitiateResult, buildCompleteResult, buildLoginResult } from '@/test/factories/auth';

// ════════════════════════════════════════════════════════════════
// MSW handlers for auth endpoints.
// Returns success by default. Override in individual tests for error cases.
// ════════════════════════════════════════════════════════════════

function ok<T>(data: T) {
  return HttpResponse.json({
    responseCode: 'EIQ-0000',
    responseMessage: 'Request successful',
    data,
  });
}

function created<T>(data: T) {
  return HttpResponse.json(
    {
      responseCode: 'EIQ-0001',
      responseMessage: 'Resource created successfully',
      data,
    },
    { status: 201 },
  );
}

function error(status: number, code: string, message: string) {
  return HttpResponse.json(
    {
      responseCode: code,
      responseMessage: message,
      data: null,
    },
    { status },
  );
}

export const authHandlers = [
  // Initiate
  http.post('*/v1/public/auth/initiate', () => {
    return created(buildInitiateResult());
  }),

  // Complete
  http.post('*/v1/public/auth/complete', async ({ request }) => {
    const body = await request.json() as { otp_code?: string };
    if (body.otp_code === '000000') {
      return error(400, 'EIQ-1006', 'Invalid or expired OTP');
    }
    return ok(buildCompleteResult());
  }),

  // Login
  http.post('*/v1/public/auth/login', async ({ request }) => {
    const body = await request.json() as { email?: string; password?: string };
    if (body.password === 'wrong') {
      return error(401, 'EIQ-1002', 'Invalid email or password');
    }
    return ok(buildLoginResult());
  }),

  // Refresh
  http.post('*/v1/public/auth/refresh', () => {
    return ok({ access_token: 'new_access_token', expires_in: 3600 });
  }),

  // Reset password
  http.post('*/v1/public/auth/reset-password', () => {
    return ok(null);
  }),
];

// Error handler overrides for specific test scenarios
export const authErrorHandlers = {
  emailTaken: http.post('*/v1/public/auth/initiate', () => {
    return error(409, 'EIQ-1010', 'Email address is already registered');
  }),

  accountSuspended: http.post('*/v1/public/auth/login', () => {
    return error(403, 'EIQ-1012', 'Account has been suspended');
  }),

  mfaRequired: http.post('*/v1/public/auth/login', () => {
    return error(401, 'EIQ-1008', 'MFA verification required');
  }),

  serverError: http.post('*/v1/public/auth/login', () => {
    return error(500, 'EIQ-5000', 'An internal error occurred');
  }),
};
