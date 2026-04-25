import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/auth';

// MSW server for integration/adapter tests.
// Import and use in test setup or individual test files.
export const server = setupServer(...authHandlers);
