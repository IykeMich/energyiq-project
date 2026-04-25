// Mirrors pkg/response/codes.go on the backend.
// Every API response carries one of these. Grouped by category:
//   0xxx success | 1xxx auth | 2xxx validation | 3xxx financial
//   4xxx resource | 5xxx system
export const EIQ = {
  // Success
  Success:           'EIQ-0000',
  Created:           'EIQ-0001',
  RegistrationInit:  'EIQ-0002',

  // Auth
  Unauthorized:        'EIQ-1000',
  InvalidCredentials:  'EIQ-1001',
  AccountSuspended:    'EIQ-1002',
  TokenExpired:        'EIQ-1003',
  TokenInvalid:        'EIQ-1004',
  MFARequired:         'EIQ-1005',
  OTPInvalid:          'EIQ-1006',
  AccountNotVerified:  'EIQ-1007',
  EmailTaken:          'EIQ-1008',
  Forbidden:           'EIQ-1009',
  KYCRequired:         'EIQ-1010',
  TierInsufficient:    'EIQ-1011',

  // Validation
  ValidationFailed: 'EIQ-2000',
  InvalidFormat:    'EIQ-2001',

  // Resource
  NotFound:       'EIQ-4000',
  AlreadyExists:  'EIQ-4001',
  StateInvalid:   'EIQ-4002',

  // System
  RateLimited:         'EIQ-5000',
  InternalError:       'EIQ-5001',
  ServiceUnavailable:  'EIQ-5002',
} as const;

export type EIQCode = typeof EIQ[keyof typeof EIQ];
