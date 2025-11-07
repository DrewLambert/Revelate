# Revelate Operations - Technology Stack Guide

**Project:** revelateops-website
**Version:** 1.0.0
**Last Updated:** November 7, 2025

---

## Executive Summary

Revelate Operations is built on a modern, production-ready technology stack optimized for performance, developer experience, and scalability. The application uses **Next.js 16** with **React 19**, **TypeScript**, and **PostgreSQL** (via Prisma ORM) to deliver a high-performance consulting website with integrated CRM, project management, and Google Ads analytics capabilities.

### Core Philosophy
- **Modern React Ecosystem:** Leveraging the latest Next.js App Router and React Server Components
- **Type Safety First:** Full TypeScript implementation with strict compiler settings
- **Database-First Design:** PostgreSQL with Prisma for type-safe database access
- **API-Driven Architecture:** RESTful API routes with NextAuth authentication
- **Utility-First Styling:** Tailwind CSS for rapid, consistent UI development
- **Third-Party Integrations:** Google Ads API, Calendly, Slack, Sentry

---

## Technology Stack Overview

### Frontend Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.0 | React framework with App Router, Server Components, and API routes |
| **React** | 19.2.0 | UI library for building component-based interfaces |
| **React DOM** | 19.2.0 | React renderer for web applications |
| **TypeScript** | 5.5.0 | Type-safe JavaScript with compile-time error checking |

**Architecture Pattern:** Next.js App Router (app directory structure)
- Server Components by default for optimal performance
- Client Components (`'use client'`) for interactivity
- API routes in `app/api/` directory
- File-system based routing

### UI & Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4.0 | Utility-first CSS framework |
| **@tailwindcss/forms** | 0.5.7 | Form styling utilities |
| **PostCSS** | 8.4.32 | CSS processing and transformation |
| **Autoprefixer** | 10.4.16 | Automatic vendor prefix addition |
| **Lucide React** | 0.552.0 | Icon library (clean, consistent SVG icons) |

**Custom Design System:**
- Brand colors: Navy (`#1a1f3a`), Cyan (`#00d9ff`), Magenta (`#ff00ff`)
- Custom font families: `--font-heading` and `--font-body`
- Responsive breakpoints (sm, md, lg, xl, 2xl)
- Glassmorphism effects with backdrop-blur

### Database & ORM
| Technology | Version | Purpose |
|------------|---------|---------|
| **Prisma Client** | 6.18.0 | Type-safe database client |
| **Prisma CLI** | 6.18.0 (dev) | Database migrations and introspection |
| **PostgreSQL** | Latest | Primary database (hosted on Neon) |

**Database Architecture:**
- **Conversations System:** User messages with Slack thread integration
- **Services & Packages:** Dynamic pricing, scoping factors, and quote generation
- **CRM System:** Clients, projects, tasks, meetings, and ideas
- **Google Ads Integration:** Accounts, campaigns, ad groups, ads, and metrics
- **Audit Logging:** Admin action tracking

**Binary Targets:** `["native", "rhel-openssl-3.0.x"]` for Vercel deployment compatibility

### Authentication & Authorization
| Technology | Version | Purpose |
|------------|---------|---------|
| **NextAuth.js** | 5.0.0-beta.30 | Authentication framework for Next.js |
| **Google OAuth** | - | Admin authentication via Google sign-in |

**Authentication Strategy:**
- Single admin email authorization (`ADMIN_EMAIL` env var)
- Google OAuth provider for identity verification
- Session-based authentication
- Protected admin routes with middleware

### Content & Markdown
| Technology | Version | Purpose |
|------------|---------|---------|
| **react-markdown** | 10.1.0 | Markdown rendering in React components |
| **remark-gfm** | 4.0.1 | GitHub Flavored Markdown support (tables, strikethrough, etc.) |

### Validation & Type Safety
| Technology | Version | Purpose |
|------------|---------|---------|
| **Zod** | 4.1.12 | Runtime type validation and schema definition |

**Validation Schemas Located in:** `lib/validation/`
- `client.schema.ts` - Client data validation
- `project.schema.ts` - Project data validation
- `task.schema.ts` - Task data validation
- `meeting.schema.ts` - Meeting data validation
- `idea.schema.ts` - Idea capture validation

---

## Infrastructure & Deployment

### Hosting & Deployment
- **Platform:** Vercel (optimized for Next.js)
- **Deployment Branch:** `Prerelease` (main branch: `main`)
- **Build Command:** `npm run build`
- **Output:** Static + Serverless Functions
- **External Packages:** `@prisma/client`, `@prisma/engines` (prevents bundling issues)

### Environment Variables
**Required Environment Variables:**
```bash
# Database
POSTGRES_PRISMA_URL=postgresql://...

# Authentication
AUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ADMIN_EMAIL=...

# Integrations
NEXT_PUBLIC_CALENDLY_CLIENT_ID=...
CALENDLY_CLIENT_SECRET=...
CALENDLY_API_TOKEN=...
SLACK_BOT_TOKEN=...
SLACK_USER_ID=...

# Analytics & Monitoring
NEXT_PUBLIC_GA_MEASUREMENT_ID=...
NEXT_PUBLIC_SENTRY_DSN=...
SENTRY_AUTH_TOKEN=...

# Google Ads API
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
GOOGLE_ADS_DEVELOPER_TOKEN=...
GOOGLE_ADS_REFRESH_TOKEN=...
GOOGLE_ADS_LOGIN_CUSTOMER_ID=...

# Configuration
LOG_LEVEL=info
```

**See:** `.env.example` for full documentation

---

## Project Structure

```
revelateops-website/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   └── admin/                # Admin API routes
│   │       ├── clients/          # Client management
│   │       ├── projects/         # Project management
│   │       ├── tasks/            # Task management
│   │       ├── meetings/         # Meeting management
│   │       ├── ideas/            # Idea capture
│   │       ├── google-ads/       # Google Ads integration
│   │       └── dashboard/        # Dashboard metrics
│   ├── admin/                    # Admin panel pages
│   │   ├── clients/              # Client management UI
│   │   ├── projects/             # Project management UI
│   │   ├── tasks/                # Task management UI
│   │   ├── meetings/             # Meeting management UI
│   │   ├── ideas/                # Idea capture UI
│   │   ├── google-ads/           # Google Ads dashboard
│   │   └── dashboard/            # Main admin dashboard
│   ├── auth/                     # Authentication pages
│   ├── layout.tsx                # Root layout
│   ├── providers.tsx             # React context providers
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   └── admin/                    # Admin-specific components
│       ├── AdminLayout.tsx       # Admin panel layout
│       ├── QuickCaptureModal.tsx # Quick capture popup
│       ├── GoogleAdsConnect.tsx  # Google Ads OAuth
│       ├── GoogleAdsMetrics.tsx  # Metrics display
│       └── GoogleAdsCampaigns.tsx # Campaign list
│
├── lib/                          # Utilities and services
│   ├── prisma.ts                 # Prisma client singleton
│   ├── api-middleware.ts         # API utilities
│   ├── services/                 # Business logic services
│   │   └── google-ads.service.ts # Google Ads API client
│   └── validation/               # Zod schemas
│       ├── client.schema.ts
│       ├── project.schema.ts
│       ├── task.schema.ts
│       ├── meeting.schema.ts
│       ├── idea.schema.ts
│       └── index.ts
│
├── prisma/
│   └── schema.prisma             # Database schema
│
├── public/                       # Static assets
│   ├── favicon.ico
│   ├── android-chrome-*.png      # Android icons
│   ├── apple-touch-icon.png      # iOS icon
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── site.webmanifest          # PWA manifest
│
├── docs/                         # Documentation
│   └── google-ads-setup-guide.md
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── postcss.config.js             # PostCSS config
└── .env.example                  # Environment variables template
```

---

## API Architecture

### RESTful API Design
All API routes follow REST conventions:

**Base Path:** `/api/admin/*`

**Authentication:** NextAuth session required for all admin routes

**Common Patterns:**
- `GET /api/admin/[resource]` - List all resources
- `POST /api/admin/[resource]` - Create new resource
- `GET /api/admin/[resource]/[id]` - Get single resource
- `PUT /api/admin/[resource]/[id]` - Update resource
- `DELETE /api/admin/[resource]/[id]` - Delete resource

**Response Format:**
```typescript
// Success
{ data: T }

// Error
{ error: string }
```

### API Routes Overview

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/[...nextauth]` | ALL | NextAuth authentication |
| `/api/admin/clients` | GET, POST | Client management |
| `/api/admin/clients/[id]` | GET, PUT, DELETE | Single client operations |
| `/api/admin/projects` | GET, POST | Project management |
| `/api/admin/projects/[id]` | GET, PUT, DELETE | Single project operations |
| `/api/admin/tasks` | GET, POST | Task management |
| `/api/admin/tasks/[id]` | GET, PUT, DELETE | Single task operations |
| `/api/admin/meetings` | GET, POST | Meeting management |
| `/api/admin/meetings/[id]` | GET, PUT, DELETE | Single meeting operations |
| `/api/admin/ideas` | GET, POST | Idea capture |
| `/api/admin/ideas/[id]` | GET, PUT, DELETE | Single idea operations |
| `/api/admin/google-ads/accounts` | GET, POST | Google Ads accounts |
| `/api/admin/google-ads/accounts/[id]/sync` | POST | Sync Google Ads data |
| `/api/admin/google-ads/campaigns` | GET, POST | Campaign management |
| `/api/admin/google-ads/campaigns/[id]` | GET, PUT, DELETE | Single campaign operations |
| `/api/admin/google-ads/metrics` | GET | Aggregated metrics |
| `/api/admin/dashboard` | GET | Dashboard overview |

---

## Third-Party Integrations

### Calendly Integration
**Purpose:** Meeting scheduling and webhook handling
**API Version:** v2
**Authentication:** OAuth 2.0 + Personal Access Token

**Environment Variables:**
- `NEXT_PUBLIC_CALENDLY_CLIENT_ID` - OAuth client ID
- `CALENDLY_CLIENT_SECRET` - OAuth client secret
- `CALENDLY_API_TOKEN` - Personal access token
- `CALENDLY_SIGNING_KEY` - Webhook verification
- `CALENDLY_USERNAME` - Account username
- `CALENDLY_EVENT_SLUG` - Default event type

**Documentation:** [https://calendly.com/integrations/api_webhooks](https://calendly.com/integrations/api_webhooks)

### Slack Integration
**Purpose:** Contact form notifications and message threading
**API Version:** Web API
**Authentication:** Bot Token

**Environment Variables:**
- `SLACK_BOT_TOKEN` - Bot OAuth token (xoxb-...)
- `SLACK_USER_ID` - Target user ID for DMs

**Capabilities:**
- Send DMs to admin account
- Create conversation threads
- Store `slack_thread_ts` for conversation tracking

**Documentation:** [https://api.slack.com/](https://api.slack.com/)

### Google Ads API
**Purpose:** Campaign analytics and performance tracking
**API Version:** Google Ads API v17
**Authentication:** OAuth 2.0 + Developer Token

**Environment Variables:**
- `GOOGLE_ADS_CLIENT_ID` - OAuth client ID
- `GOOGLE_ADS_CLIENT_SECRET` - OAuth client secret
- `GOOGLE_ADS_DEVELOPER_TOKEN` - Developer token
- `GOOGLE_ADS_REFRESH_TOKEN` - OAuth refresh token
- `GOOGLE_ADS_LOGIN_CUSTOMER_ID` - Manager account ID

**Service Location:** `lib/services/google-ads.service.ts`

**Data Synced:**
- Accounts and hierarchies
- Campaigns (status, budget, dates)
- Ad Groups (status, CPC bids)
- Ads (headlines, descriptions, URLs)
- Metrics (impressions, clicks, conversions, cost)

**Documentation:** [https://developers.google.com/google-ads/api](https://developers.google.com/google-ads/api)

### Sentry Error Monitoring
**Purpose:** Error tracking and performance monitoring
**SDK:** Next.js
**Environment Variables:**
- `NEXT_PUBLIC_SENTRY_DSN` - Project DSN
- `SENTRY_ORG` - Organization slug
- `SENTRY_PROJECT` - Project slug
- `SENTRY_AUTH_TOKEN` - Auth token for source maps

**Documentation:** [https://sentry.io/](https://sentry.io/)

### Google Analytics
**Purpose:** Website analytics and user tracking
**Version:** GA4
**Environment Variable:**
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Measurement ID (G-XXXXXXXXXX)

**Implementation:** Client-side tracking script

---

## Database Schema Overview

### Conversations System
- **conversations** - User contact form submissions
- **messages** - Threaded messages linked to conversations

### Services & Packages
- **Service** - Individual service offerings
- **Package** - Bundled service packages
- **PackageService** - Many-to-many relationship
- **ScopingFactor** - Dynamic pricing inputs
- **ScopingRule** - Pricing calculation rules
- **Quote** - Generated price quotes
- **AdminAuditLog** - Change tracking

### CRM System
- **Client** - Client records (PROSPECT, ACTIVE, PAST, PAUSED)
- **Project** - Client projects with timeline
- **Meeting** - Meeting notes and action items
- **Task** - Task management (TODO, IN_PROGRESS, BLOCKED, COMPLETE)
- **Idea** - Idea capture and tracking

### Google Ads Integration
- **GoogleAdsAccount** - Connected ad accounts
- **GoogleAdsCampaign** - Campaign data
- **GoogleAdsAdGroup** - Ad group data
- **GoogleAdsAd** - Individual ads
- **GoogleAdsMetrics** - Daily performance metrics

**Relationships:**
- Campaigns linked to Clients for attribution
- Hierarchical: Account → Campaign → Ad Group → Ad
- Metrics tracked at account, campaign, and ad group levels

---

## Development Workflow

### Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Set Up Database:**
   ```bash
   # Prisma will auto-generate client on postinstall
   npx prisma migrate dev  # Run migrations
   npx prisma db push      # Or push schema to database
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   # Runs on http://localhost:3000
   ```

### Available Scripts

```json
{
  "dev": "next dev",           // Start development server
  "build": "next build",       // Build for production
  "start": "next start",       // Start production server
  "lint": "next lint",         // Run ESLint
  "postinstall": "prisma generate"  // Auto-generate Prisma client
}
```

### TypeScript Configuration

**Target:** ES2017
**Module Resolution:** Bundler (Next.js optimized)
**Strict Mode:** Enabled
**Path Aliases:** `@/*` → `./*` (root-relative imports)

**Key Compiler Options:**
- `strict: true` - All type checking enabled
- `forceConsistentCasingInFileNames: true` - Case-sensitive imports
- `noEmit: true` - Type checking only, Next.js handles compilation
- `jsx: "react-jsx"` - Modern JSX transform (no React import needed)
- `incremental: true` - Faster subsequent builds

---

## Performance Optimizations

### Next.js App Router Benefits
- **Server Components by default** - Zero JavaScript for static content
- **Automatic code splitting** - Per-route JavaScript bundles
- **Image optimization** - Built-in `next/image` with lazy loading
- **Font optimization** - Automatic font subsetting

### Prisma Optimizations
- **Connection pooling** - Efficient database connections
- **Prepared statements** - Query performance
- **Type-safe queries** - No runtime query parsing overhead

### Tailwind CSS Optimizations
- **JIT (Just-In-Time) mode** - Only used classes in production
- **PurgeCSS integration** - Automatic unused CSS removal
- **Minification** - Compressed production CSS

### Database Indexing Strategy
- Primary keys on all tables (UUID or auto-increment)
- Foreign key indexes for relationships
- Composite indexes for common queries:
  - `conversations`: `slack_thread_ts`
  - `messages`: `conversation_id`, `sent_at`
  - `Service`: `isActive, displayOrder`
  - `Task`: `status, dueDate`, `clientId`, `dueDate`
  - `GoogleAdsMetrics`: `accountId, date`, `campaignId, date`

---

## Security Considerations

### Authentication & Authorization
- **Single Admin Model:** Only `ADMIN_EMAIL` can access admin routes
- **NextAuth Sessions:** Secure, server-side session management
- **OAuth 2.0:** Google authentication (no password storage)
- **API Route Protection:** Middleware checks on all admin endpoints

### Database Security
- **Parameterized Queries:** Prisma prevents SQL injection
- **Environment Variables:** Secrets stored in `.env` (not committed)
- **Connection String:** PostgreSQL with SSL (Neon)

### API Security
- **CORS:** Next.js default CORS policy (same-origin)
- **Rate Limiting:** Implement at Vercel or application level (recommended)
- **Input Validation:** Zod schemas validate all API inputs
- **Output Sanitization:** React escapes output by default

### Third-Party API Security
- **Token Rotation:** OAuth refresh tokens for Google Ads
- **Webhook Verification:** Calendly signing key validation
- **Secure Storage:** API tokens in environment variables, not database

---

## Monitoring & Observability

### Error Tracking
- **Sentry:** Captures runtime errors, unhandled rejections, and performance issues
- **Source Maps:** Uploaded during build for readable stack traces

### Logging
- **Environment Variable:** `LOG_LEVEL` (error, warn, info, debug)
- **Production Default:** `info`
- **Development Default:** `debug`
- **Structured Logging:** JSON format recommended for production

### Analytics
- **Google Analytics 4:** User behavior, page views, conversions
- **Server-Side Rendering:** Client-side tracking script injection

### Performance Monitoring
- **Next.js Analytics:** Built-in Web Vitals reporting
- **Vercel Analytics:** Automatic deployment and runtime metrics
- **Sentry Performance:** Transaction tracing and bottleneck detection

---

## Testing Strategy (Recommended)

While not currently implemented, the following testing approach is recommended:

### Unit Testing
- **Framework:** Jest + React Testing Library
- **Target:** Utility functions, validation schemas, API middleware
- **Coverage Goal:** 80%+

### Integration Testing
- **Framework:** Jest + MSW (Mock Service Worker)
- **Target:** API routes, database operations
- **Strategy:** In-memory PostgreSQL or test database

### End-to-End Testing
- **Framework:** Playwright or Cypress
- **Target:** Critical user flows (auth, CRM operations)
- **Environment:** Staging/preview deployment

### Type Safety
- **Current:** TypeScript + Zod for compile-time and runtime validation
- **Benefit:** Many bugs caught before testing phase

---

## Future Enhancements

### Short-Term
- [ ] Add automated testing (unit, integration, E2E)
- [ ] Implement rate limiting on API routes
- [ ] Add request/response logging middleware
- [ ] Improve error handling with custom error classes
- [ ] Add database migration rollback strategy

### Medium-Term
- [ ] Multi-admin support with role-based permissions
- [ ] Real-time notifications (WebSockets or SSE)
- [ ] Enhanced Google Ads reporting (custom dashboards)
- [ ] Email integration for client communication
- [ ] File upload system for project attachments

### Long-Term
- [ ] Multi-tenant architecture for white-label deployment
- [ ] GraphQL API layer for complex queries
- [ ] Mobile app (React Native or PWA)
- [ ] AI-powered insights (Google Ads optimization)
- [ ] Comprehensive API documentation (OpenAPI/Swagger)

---

## Key Architectural Decisions

### Why Next.js 16?
- **Modern React:** Leverages React 19 and Server Components
- **Full-Stack Framework:** Combines frontend and API in one codebase
- **Vercel Optimization:** Built by Vercel, optimized for their platform
- **Developer Experience:** File-based routing, hot reloading, TypeScript support

### Why PostgreSQL + Prisma?
- **Relational Data:** Complex relationships (CRM, campaigns, metrics)
- **Type Safety:** Prisma generates TypeScript types from schema
- **Migration Management:** Version-controlled database changes
- **Modern DX:** Intuitive query API, no raw SQL required

### Why Tailwind CSS?
- **Rapid Development:** Utility classes speed up styling
- **Consistency:** Design system enforced through configuration
- **Performance:** Only used classes in production bundle
- **Responsive Design:** Mobile-first breakpoints built-in

### Why NextAuth?
- **Next.js Native:** Designed specifically for Next.js
- **Flexible:** Supports multiple auth strategies
- **Secure:** Industry-standard session management
- **OAuth Support:** Easy Google authentication integration

### Why Vercel?
- **Zero Config:** Automatic deployment for Next.js projects
- **Edge Network:** Global CDN for fast asset delivery
- **Serverless Functions:** Automatic scaling for API routes
- **Preview Deployments:** Every PR gets a unique URL
- **Environment Variables:** Secure secrets management

---

## Troubleshooting Common Issues

### Prisma Binary Not Found (Vercel)
**Problem:** "Prisma Client could not locate the Query Engine for runtime rhel-openssl-3.0.x"

**Solution:** Already implemented in `schema.prisma`:
```prisma
binaryTargets = ["native", "rhel-openssl-3.0.x"]
```

**Next.js Config:** `serverExternalPackages: ['@prisma/client', '@@prisma/engines']`

### Authentication Redirect Loops
**Problem:** NextAuth keeps redirecting to sign-in

**Solution:**
- Verify `AUTH_SECRET` is set and matches across environments
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Ensure `ADMIN_EMAIL` matches your Google account

### Database Connection Errors
**Problem:** "Can't reach database server"

**Solution:**
- Verify `POSTGRES_PRISMA_URL` is correct
- Check Neon database is not paused (serverless databases auto-pause)
- Confirm IP allowlist includes Vercel IP ranges (or set to 0.0.0.0/0)

### Build Failures on Vercel
**Problem:** Build fails with module not found

**Solution:**
- Check `package.json` has all dependencies (not just devDependencies)
- Ensure `postinstall` script runs (`prisma generate`)
- Verify TypeScript paths (`@/*`) resolve correctly

---

## Contact & Support

**Project Owner:** Drew Lambert
**Organization:** Revelate Operations

For questions, issues, or feature requests, please contact the development team or refer to internal documentation.

---

## Appendix: Version History

### v1.0.0 (Current)
- Initial tech stack documentation
- Next.js 16 + React 19 implementation
- PostgreSQL + Prisma ORM integration
- NextAuth authentication
- Google Ads API integration
- Calendly + Slack integrations
- CRM and project management features

---

_This document is maintained by the Revelate Operations development team._
_Last updated: November 7, 2025_
