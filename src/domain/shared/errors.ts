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

export class ValidationError extends DomainError {
  fields: Array<{ field: string; message: string }>;

  constructor(message: string, fields: Array<{ field: string; message: string }>) {
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
