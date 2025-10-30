# Revelate Operations - Brand Compliant Website

[![Tests](https://github.com/DrewRevelate/Revelate/actions/workflows/test.yml/badge.svg)](https://github.com/DrewRevelate/Revelate/actions/workflows/test.yml) ![Coverage](https://img.shields.io/badge/coverage-19%25-red) [![Testing](https://img.shields.io/badge/tests-passing-brightgreen)](#testing)

Website score: 50/56 (Excellent - Brand Compliant)

All brand compliance fixes deployed:
- Multi-color gradients removed
- Typography optimized
- Calendly integration fixed
- Text sizes increased for readability

## Testing

This project uses a comprehensive testing stack:
- **Jest 30.2.0** + **React Testing Library 16.3.0** for unit and integration tests
- **Playwright 1.56.1** for end-to-end tests

### Running Tests

```bash
# Unit and Integration Tests
npm test                    # Run all Jest tests once
npm run test:watch          # Run tests in watch mode (for development)
npm run test:coverage       # Run tests with coverage report

# End-to-End Tests
npm run test:e2e            # Run Playwright E2E tests (headless)
npm run test:e2e:headed     # Run E2E tests with browser visible
npm run test:e2e:debug      # Run E2E tests in debug mode
npm run test:e2e:ui         # Open Playwright UI mode
npm run test:e2e:report     # View last Playwright test report
```

### Test File Locations

Tests are organized in the `__tests__/` directory:

```
__tests__/
├── setup.ts              # Global test setup and configuration
├── sample.test.ts        # Example test file
├── unit/                 # Unit tests for individual functions/components
├── integration/          # Integration tests for API endpoints and workflows
└── e2e/                  # End-to-end tests (Playwright)
```

### Writing Tests

Test files use the `.test.ts` or `.test.tsx` extension and follow this pattern:

```typescript
// __tests__/unit/example.test.ts
import { describe, it, expect } from '@jest/globals';

describe('Feature Name', () => {
  it('should perform expected behavior', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

#### Component Testing Example

```typescript
// __tests__/unit/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/Button';

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click Me');
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Path Aliases

Tests support the same path aliases as the main application:

```typescript
import { SomeComponent } from '@/components/SomeComponent';
import { someUtil } from '@/lib/utils';
```

### Coverage Thresholds

Minimum coverage requirements:
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

**CI/CD Enforcement:** GitHub Actions automatically runs test coverage on every pull request and push to main/Prerelease branches. Builds will fail if coverage drops below the 80% threshold.

### Viewing Coverage Reports

After running `npm run test:coverage`, you can view detailed coverage reports in multiple formats:

#### HTML Report (Recommended)

Open the interactive HTML report in your browser:

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report (macOS)
open coverage/index.html

# Open HTML report (Linux)
xdg-open coverage/index.html

# Or manually navigate to:
# revelateops-website/coverage/index.html
```

The HTML report provides:
- **File-by-file coverage breakdown** - Click any file to see line-by-line coverage
- **Color-coded coverage** - Green (covered), red (uncovered), yellow (partially covered)
- **Interactive navigation** - Browse through your codebase with coverage overlays
- **Detailed metrics** - Statements, branches, functions, and lines percentages

#### Understanding Coverage Metrics

The coverage report shows four key metrics:

- **Lines**: Percentage of code lines executed during tests
- **Branches**: Percentage of conditional branches taken (if/else, switch, ternary, etc.)
- **Functions**: Percentage of functions/methods called during tests
- **Statements**: Percentage of JavaScript statements executed

**Example:** A function with an if/else has 2 branches. If only the if block runs in tests, branch coverage is 50%.

#### Coverage Report Files

Coverage reports are generated in the `coverage/` directory:

```
coverage/
├── index.html              # Main HTML report (open in browser)
├── lcov-report/            # Detailed HTML reports per file
├── lcov.info               # LCOV format for CI/CD tools and badge generation
└── coverage-final.json     # JSON format for programmatic access
```

**Note:** The `coverage/` directory is excluded from git (see `.gitignore`) to prevent committing large report files.

### Test Environment

- **Framework:** Jest 30.2.0
- **React Testing:** React Testing Library 16.3.0
- **E2E Testing:** Playwright 1.56.1
- **Environment:** jsdom (browser-like DOM API)
- **TypeScript:** Full support with strict mode enabled
- **Next.js:** Compatible with Next.js 16 App Router

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

### Automated Testing

All pull requests and pushes to `main` or `Prerelease` branches automatically trigger:

1. **Unit & Integration Tests** - Jest with coverage threshold enforcement (80%)
2. **End-to-End Tests** - Playwright running 14 E2E tests across critical user flows
3. **Linting** - ESLint code quality checks

**Workflow Status:** [![Tests](https://github.com/DrewRevelate/Revelate/actions/workflows/test.yml/badge.svg)](https://github.com/DrewRevelate/Revelate/actions/workflows/test.yml)

### Deployment Gates

Branch protection rules ensure:
- All tests must pass before merge
- Coverage cannot drop below 80% threshold
- E2E tests validate critical user journeys
- Vercel deployment only proceeds after passing checks

See [Branch Protection Setup Guide](.github/BRANCH_PROTECTION_SETUP.md) for configuration details.

### Test Artifacts

GitHub Actions uploads test artifacts for every run:
- **Coverage Reports** - Detailed coverage analysis (30-day retention)
- **Playwright Reports** - E2E test results and traces (30-day retention)
- **Screenshots** - Captured on E2E test failures (7-day retention)

Access artifacts from the Actions tab in GitHub.

## Logging

This application uses **Pino** for structured JSON logging, providing high-performance, low-overhead logging capabilities. All logs include conversation_id for request correlation and are formatted for easy parsing and analysis.

### Log Levels

Configure logging verbosity using the `LOG_LEVEL` environment variable:

| Level | Description | When to Use |
|-------|-------------|-------------|
| `error` | Critical failures requiring immediate attention | Production - errors only |
| `warn` | Recoverable issues and warnings | Production - errors + warnings |
| `info` | Significant application events | Production - normal operations |
| `debug` | Detailed trace information | Development - debugging |

**Default Levels:**
- Production: `info`
- Development: `debug`

### Configuration

Set the log level in your environment variables:

```bash
# In .env.local or deployment environment
LOG_LEVEL=info
```

### Structured Log Format

All logs are output as JSON in production for easy parsing:

```json
{
  "level": "info",
  "time": 1699123456789,
  "conversation_id": 123,
  "action": "contact_form_submitted",
  "user_email": "a1b2c3d4e5f6g7h8",
  "duration_ms": 45.23,
  "msg": "Contact form processed successfully"
}
```

In development, logs use **pino-pretty** for human-readable, colorized output:

```
[15:30:45 EST] INFO (conversation_id: 123): Contact form processed successfully
    action: "contact_form_submitted"
    duration_ms: 45.23
```

### Privacy & Security

All logs follow privacy-safe practices:

- **Email Hashing**: User emails are SHA-256 hashed in production (first 16 chars)
- **Phone Sanitization**: Phone numbers show only last 4 digits
- **Message Truncation**: Long messages are truncated to prevent log bloat
- **No Sensitive Data**: Passwords, API tokens, and full SQL queries are never logged

### Logging Conventions

#### API Endpoints

All API routes log:
- **Request received** (method, path, conversation_id if available)
- **Processing steps** (database calls, external API calls)
- **Response sent** (status code, duration in ms)
- **Errors** (full error object with stack trace)

Example from `/api/contact`:

```typescript
logger.info(
  createLogContext({
    action: 'contact_form_completed',
    endpoint: '/api/contact',
    conversation_id: conversation.id,
    user_email: data.email, // Automatically hashed in production
    duration_ms: performance.now() - startTime,
  }),
  'Contact form processed successfully'
);
```

#### Database Operations

All database functions log:
- **Query name** (function being called)
- **conversation_id** (when applicable)
- **Duration** (query execution time in ms)
- **Success/Failure** status
- **Row counts** (for UPDATE/DELETE operations)

Example from `lib/db/conversations.ts`:

```typescript
logger.info(
  createLogContext({
    action: 'db_query_executed',
    query: 'createConversation',
    conversation_id: conversation.id,
    user_email: data.user_email,
    duration_ms: performance.now() - startTime,
  }),
  'Conversation created in database'
);
```

### Conversation Tracing

All logs related to a conversation include `conversation_id` for correlation. This enables tracing a complete user interaction across:

1. Contact form submission
2. Database conversation creation
3. Slack notification
4. Message exchanges
5. Conversation closure

**Example trace query (in production logs):**

```bash
# Filter logs by conversation_id
grep '"conversation_id":123' application.log
```

### Querying Logs

#### Vercel Dashboard

1. Navigate to your project in Vercel
2. Click "Logs" in the sidebar
3. Filter by:
   - Time range
   - Log level
   - Search terms (e.g., `conversation_id:123`)

#### Local Development

When running locally with `npm run dev`, logs appear in your terminal with color coding:
- 🔴 Red: Errors
- 🟡 Yellow: Warnings
- 🟢 Green/Cyan: Info/Debug

### Log Retention

**Vercel Platform:**
- Logs are captured from stdout/stderr automatically
- Retention period depends on your Vercel plan
- No log aggregation service required

**Best Practices:**
- Use `LOG_LEVEL=info` or `LOG_LEVEL=warn` in production to reduce volume
- Enable `LOG_LEVEL=debug` temporarily for troubleshooting
- Monitor log volume to stay within platform limits

### Performance Impact

Pino is designed for minimal performance overhead:
- **5x faster than Winston** (async processing)
- Zero-cost abstractions in production
- Non-blocking I/O operations
- Optimized for Node.js runtime

Typical logging overhead: < 5ms per request

### Troubleshooting

#### Logs not appearing

1. Check `LOG_LEVEL` environment variable is set correctly
2. Verify logs aren't being filtered by level (e.g., debug logs won't show if level is info)
3. In production, check Vercel dashboard for stdout logs

#### Too many logs

1. Increase `LOG_LEVEL` to `warn` or `error` in production
2. Review logging statements in code - remove unnecessary debug logs
3. Consider adding rate limiting to high-frequency log points

#### Missing conversation_id

Some logs may not have conversation_id if they occur before conversation creation or in contexts without a conversation (e.g., health checks, static page requests).

### Code Examples

#### Using the Logger

```typescript
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

// Simple log
logger.info({ action: 'health_check' }, 'Health check passed');

// With conversation context
logger.info(
  createLogContext({
    action: 'message_sent',
    conversation_id: 123,
    user_email: 'user@example.com', // Auto-hashed in production
    duration_ms: 42.5,
  }),
  'User message sent successfully'
);

// Error logging
try {
  await riskyOperation();
} catch (error) {
  logger.error(
    createLogContext({
      action: 'operation_failed',
      conversation_id: 123,
      error, // Includes stack trace
    }),
    'Risky operation failed'
  );
  throw error;
}
```

#### Creating Child Loggers

For adding persistent context across multiple log calls:

```typescript
import { logger } from '@/lib/monitoring/logger';

const childLogger = logger.child({ conversation_id: 123 });

// All logs from childLogger automatically include conversation_id
childLogger.info({ action: 'step_1' }, 'Starting process');
childLogger.info({ action: 'step_2' }, 'Processing data');
childLogger.info({ action: 'completed' }, 'Process finished');
```

### Related Tools

- **Pino Documentation**: https://getpino.io/
- **pino-pretty**: Pretty-printing for development
- **Vercel Logs**: https://vercel.com/docs/observability/runtime-logs

