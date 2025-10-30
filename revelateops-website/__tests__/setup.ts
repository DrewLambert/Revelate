// Global test setup file
// This file is executed before each test file runs (configured in jest.config.js)

// Load environment variables from .env.local for tests
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local (which contains Sentry credentials)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import jest-dom matchers for better assertions
// Adds custom matchers like toBeInTheDocument(), toHaveClass(), etc.
import '@testing-library/jest-dom';

// Global test configuration can be added here
// Examples:
// - Mock global functions (fetch, localStorage, etc.)
// - Set up test utilities
// - Configure global test timeouts

// Example: Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Example: Mock IntersectionObserver for components using it
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;
