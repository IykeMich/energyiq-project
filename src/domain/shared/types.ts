// Universal API response envelope — matches backend pkg/response
export interface ApiResponse<T = unknown> {
  responseCode: string;
  responseMessage: string;
  data: T | null;
}

// Response code prefixes
export const ResponseCodes = {
  SUCCESS: 'EIQ-0000',
  CREATED: 'EIQ-0001',

  // Auth
  UNAUTHORIZED: 'EIQ-1000',
  FORBIDDEN: 'EIQ-1001',
  INVALID_CREDENTIALS: 'EIQ-1002',
  TOKEN_EXPIRED: 'EIQ-1003',
  TOKEN_INVALID: 'EIQ-1004',
  OTP_SENT: 'EIQ-1005',
  OTP_INVALID: 'EIQ-1006',
  OTP_RATE_LIMITED: 'EIQ-1007',
  MFA_REQUIRED: 'EIQ-1008',
  EMAIL_TAKEN: 'EIQ-1010',
  PASSWORD_WEAK: 'EIQ-1011',
  ACCOUNT_SUSPENDED: 'EIQ-1012',
  ACCOUNT_NOT_VERIFIED: 'EIQ-1013',
  REGISTRATION_INIT: 'EIQ-1014',

  // Validation
  VALIDATION_FAILED: 'EIQ-2000',
  INVALID_FORMAT: 'EIQ-2001',

  // Financial
  INSUFFICIENT_FUNDS: 'EIQ-3000',
  ACCOUNT_FROZEN: 'EIQ-3001',
  KYC_REQUIRED: 'EIQ-3007',

  // Resource
  NOT_FOUND: 'EIQ-4000',
  ALREADY_EXISTS: 'EIQ-4001',
  STATE_INVALID: 'EIQ-4002',

  // System
  INTERNAL_ERROR: 'EIQ-5000',
  RATE_LIMITED: 'EIQ-5002',
} as const;

export type ResponseCode = (typeof ResponseCodes)[keyof typeof ResponseCodes];

export function isSuccess(code: string): boolean {
  return code.startsWith('EIQ-0');
}

// Pagination
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
