// Domain error — carries the response code for error handling in the UI layer
export class DomainError extends Error {
  code: string;
  data?: unknown;

  constructor(code: string, message: string, data?: unknown) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.data = data;
  }
}

export interface ErrorFieldMessage {
  field: string;
  message: string;
}

export class ValidationError extends DomainError {
  fields: ErrorFieldMessage[];

  constructor(message: string, fields: ErrorFieldMessage[]) {
    super('EIQ-2000', message, fields);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class AuthError extends DomainError {
  constructor(code: string, message: string) {
    super(code, message);
    this.name = 'AuthError';
  }
}

export class NetworkError extends DomainError {
  constructor() {
    super('NETWORK', 'Unable to connect. Please check your internet connection.');
    this.name = 'NetworkError';
  }
}

// ── Thunk error payload ────────────────────────────────────────────
// The one shape every Redux thunk's rejectWithValue(...) carries, so
// every slice surfaces both the display message and (when present)
// per-field validation errors the same way.

export interface ErrorPayload {
  message: string;
  fields: ErrorFieldMessage[] | null;
  /** The server's `responseCode` (e.g. "EIQ-1004"), when the error came from `DomainError`. */
  code?: string;
}

export function toErrorPayload(err: unknown): ErrorPayload {
  if (err instanceof ValidationError) {
    return { message: err.message, fields: err.fields, code: err.code };
  }
  if (err instanceof DomainError) {
    return { message: err.message, fields: null, code: err.code };
  }
  if (err instanceof Error) {
    return { message: err.message, fields: null };
  }
  return { message: 'An unexpected error occurred', fields: null };
}
