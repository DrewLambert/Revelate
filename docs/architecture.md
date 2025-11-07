# Revelate Operations CRM - Architecture Document

**Project**: Revelate Operations
**Document Type**: Technical Architecture
**Author**: Architecture Workflow
**Date**: 2025-11-06
**Version**: 1.0.0
**Status**: Current Production Architecture

---

## Executive Summary

The Revelate Operations CRM is a Next.js 16 application with a client-centered architecture designed to manage consulting engagements, track tasks, coordinate meetings, and capture client ideas. The system features three distinct subsystems built on a PostgreSQL database with Prisma ORM, protected by NextAuth authentication, and presented through a brand-compliant, navy-dominant UI.

**Key Characteristics:**
- **Client-Centered Design**: All CRM entities (Projects, Tasks, Meetings, Ideas) relate to Clients as the central hub
- **Three Subsystems**: Legacy Conversations (Slack), Services & Packages (Quotes), CRM (Client Management)
- **Single Admin Model**: Google OAuth with email whitelist for solo consultant workflow
- **Brand-First UI**: Professional, dense interface using navy (#1a1f3a) with cyan/magenta accents
- **Type-Safe Stack**: TypeScript + Prisma for end-to-end type safety

---

## 1. Technology Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.0 | Full-stack React framework with App Router |
| **React** | 19.2.0 | UI component library |
| **TypeScript** | 5.5.0 | Type-safe JavaScript |
| **Node.js** | 18+ (inferred) | Server runtime |

### Database & ORM
| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | Latest | Primary relational database |
| **Prisma** | 6.18.0 | Type-safe ORM and migration tool |
| **Prisma Client** | 6.18.0 | Auto-generated database client |

**Binary Targets**: `["native", "rhel-openssl-3.0.x"]` for Vercel deployment

### Authentication & Security
| Technology | Version | Purpose |
|------------|---------|---------|
| **NextAuth** | 5.0.0-beta.30 | Authentication framework |
| **Google OAuth** | - | Identity provider |
| **Environment Variables** | - | Secrets management |

### UI & Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4.0 | Utility-first styling |
| **Lucide React** | 0.552.0 | Icon library (replaces emoji) |
| **React Markdown** | 10.1.0 | Markdown rendering |
| **remark-gfm** | Latest | GitHub Flavored Markdown |

### Development Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.x | Code linting |
| **PostCSS** | Latest | CSS processing |
| **Autoprefixer** | Latest | CSS vendor prefixes |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │  Mobile Web  │  │   Tablet     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Middleware Layer (Auth)                    │
│         Protects /admin/* routes with NextAuth               │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js App Router (React 19)             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │ │
│  │  │ Admin Pages  │  │  Public Site │  │  Auth Pages │  │ │
│  │  │  (7 pages)   │  │   (Marketing)│  │  (Sign-in)  │  │ │
│  │  └──────┬───────┘  └──────────────┘  └─────────────┘  │ │
│  └─────────┼────────────────────────────────────────────────┘ │
│            │                                                   │
│  ┌─────────▼──────────────────────────────────────────────┐ │
│  │                  API Routes Layer                       │ │
│  │    /api/admin/*  - CRM CRUD operations                 │ │
│  │    /api/auth/*   - NextAuth handlers                   │ │
│  └─────────┬──────────────────────────────────────────────┘ │
└────────────┼──────────────────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                       │
│              Prisma Client (Type-safe ORM)                   │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│                  PostgreSQL (Cloud-hosted)                   │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │Conversations│  │ Services & │  │  CRM & Projects     │   │
│  │  Subsystem │  │  Packages  │  │   Subsystem         │   │
│  │  (Legacy)  │  │  Subsystem │  │   (Primary)         │   │
│  └────────────┘  └────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Request Flow

**Authenticated Admin Request:**
```
1. User navigates to /admin/clients
2. Middleware intercepts request (middleware.ts)
3. Checks NextAuth session for valid authentication
4. If authenticated → Allow access to page
5. If not authenticated → Redirect to /auth/signin with callbackUrl
6. Page component loads → Fetches data from /api/admin/clients
7. API route queries Prisma → Returns JSON
8. Page renders with brand-compliant UI components
```

**Data Mutation Flow:**
```
1. User clicks "Create Task" in admin UI
2. Client-side form collects data
3. POST request to /api/admin/tasks with JSON body
4. API route validates data (basic type checking)
5. Prisma creates record with relationships (client, project, meeting)
6. Returns 201 with created task + included relations
7. Client updates UI with new task
```

---

## 3. Database Architecture

### 3.1 Three Subsystems Overview

The database contains three distinct subsystems that evolved at different phases:

#### **Subsystem 1: Conversations (Legacy Slack Integration)**
- `conversations` table
- `messages` table
- Originally designed for Slack conversation archival
- **Status**: Legacy system, minimal current use

#### **Subsystem 2: Services & Packages (Quote Generation)**
- `Service` - Consulting service offerings
- `Package` - Bundled service packages
- `PackageService` - Many-to-many join table
- `ScopingFactor` - Variables affecting quote pricing
- `ScopingRule` - Business rules for pricing calculations
- `Quote` - Generated quotes for clients
- `AdminAuditLog` - Audit trail for admin actions
- **Status**: Active for quote generation

#### **Subsystem 3: CRM & Project Management (Primary)**
- `Client` - Central hub entity
- `Project` - Client projects
- `Task` - Actionable work items
- `Meeting` - Client meetings and notes
- `Idea` - Captured client ideas and innovations
- **Status**: Primary active system for day-to-day CRM

### 3.2 Core Data Model (CRM Subsystem)

```
┌─────────────────────────────────────────────────────────────┐
│                           Client                             │
│  • id: UUID (PK)                                             │
│  • name: String (255)                                        │
│  • status: ClientStatus (PROSPECT|ACTIVE|PAST|PAUSED)       │
│  • email: String? (255)                                      │
│  • phone: String? (50)                                       │
│  • company: String? (255)                                    │
│  • notes: Text?                                              │
│  • createdAt: DateTime                                       │
│  • updatedAt: DateTime                                       │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ One-to-Many (Cascade Delete)
      ┌─────────┼─────────┬─────────┬─────────┐
      ▼         ▼         ▼         ▼         ▼
┌─────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Project │ │  Task  │ │Meeting │ │  Idea  │
└─────────┘ └────┬───┘ └────────┘ └────────┘
                 │
                 │ Optional References
         ┌───────┴────────┐
         ▼                ▼
    ┌─────────┐      ┌─────────┐
    │ Project │      │ Meeting │
    │(optional)│      │(optional)│
    └─────────┘      └─────────┘
```

#### Client (Central Hub)
```prisma
model Client {
  id          String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name        String       @db.VarChar(255)
  status      ClientStatus @default(ACTIVE)
  email       String?      @db.VarChar(255)
  phone       String?      @db.VarChar(50)
  company     String?      @db.VarChar(255)
  notes       String?      @db.Text
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  meetings Meeting[]
  tasks    Task[]
  ideas    Idea[]
  projects Project[]
}

enum ClientStatus {
  PROSPECT  // Potential client
  ACTIVE    // Currently engaged
  PAST      // Past client
  PAUSED    // Temporarily inactive
}
```

#### Task (Work Items)
```prisma
model Task {
  id          String     @id @default(dbgenerated("gen_random_uuid()"))
  title       String     @db.VarChar(500)
  description String?    @db.Text
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?  @map("due_date")
  completedAt DateTime?  @map("completed_at")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  clientId String @map("client_id")
  client   Client @relation(fields: [clientId], references: [id], onDelete: Cascade)

  projectId String?  @map("project_id")
  project   Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  meetingId String?  @map("meeting_id")
  meeting   Meeting? @relation(fields: [meetingId], references: [id], onDelete: SetNull)

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([status, dueDate])
  @@index([clientId])
}

enum TaskStatus {
  TODO        // Not started
  IN_PROGRESS // Actively working
  BLOCKED     // Waiting on dependency
  COMPLETE    // Finished
  CANCELLED   // Abandoned
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

#### Project
```prisma
model Project {
  id          String        @id @default(dbgenerated("gen_random_uuid()"))
  name        String        @db.VarChar(255)
  description String?       @db.Text
  status      ProjectStatus @default(PLANNING)
  startDate   DateTime?     @map("start_date")
  endDate     DateTime?     @map("end_date")

  clientId String @map("client_id")
  client   Client @relation(fields: [clientId], references: [id], onDelete: Cascade)

  tasks    Task[]
  meetings Meeting[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([clientId])
  @@index([status])
}

enum ProjectStatus {
  PLANNING    // Initial planning phase
  ACTIVE      // Currently executing
  ON_HOLD     // Temporarily paused
  COMPLETED   // Successfully finished
  CANCELLED   // Terminated early
}
```

#### Meeting
```prisma
model Meeting {
  id            String        @id @default(dbgenerated("gen_random_uuid()"))
  title         String        @db.VarChar(255)
  scheduledDate DateTime      @map("scheduled_date")
  duration      Int?          // Duration in minutes
  location      String?       @db.VarChar(255)
  notes         String?       @db.Text
  status        MeetingStatus @default(SCHEDULED)

  clientId String @map("client_id")
  client   Client @relation(fields: [clientId], references: [id], onDelete: Cascade)

  projectId String?  @map("project_id")
  project   Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  tasks Task[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([clientId])
  @@index([scheduledDate])
}

enum MeetingStatus {
  SCHEDULED  // Future meeting
  COMPLETED  // Meeting occurred
  CANCELLED  // Meeting cancelled
  NO_SHOW    // Client didn't attend
}
```

#### Idea
```prisma
model Idea {
  id          String     @id @default(dbgenerated("gen_random_uuid()"))
  title       String     @db.VarChar(255)
  description String     @db.Text
  status      IdeaStatus @default(CAPTURED)
  category    String?    @db.VarChar(100)
  impact      String?    @db.VarChar(50)

  clientId String @map("client_id")
  client   Client @relation(fields: [clientId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([clientId])
  @@index([status])
}

enum IdeaStatus {
  CAPTURED      // Newly captured idea
  REVIEWING     // Under evaluation
  ACCEPTED      // Approved for implementation
  IN_PROGRESS   // Being implemented
  COMPLETED     // Successfully implemented
  REJECTED      // Not moving forward
}
```

### 3.3 Database Indexes

**Strategic Index Placement:**
- `Task`: Composite index on `(status, dueDate)` for dashboard queries
- `Task`: Index on `clientId` for client filtering
- `Project`: Index on `clientId` and `status` for filtering
- `Meeting`: Index on `clientId` and `scheduledDate` for calendar views
- `Idea`: Index on `clientId` and `status` for review workflows

### 3.4 Referential Integrity

**Cascade Delete Strategy:**
- When Client deleted → All related Projects, Tasks, Meetings, Ideas deleted
- When Project deleted → Related Tasks/Meetings set to NULL (preserves history)
- When Meeting deleted → Related Tasks set to NULL (preserves task history)

**Rationale**: Client is the source of truth. If client removed, all related data becomes orphaned and should be purged. However, project/meeting context is optional metadata that shouldn't delete the core work items.

---

## 4. API Architecture

### 4.1 RESTful API Design

All admin API routes follow consistent patterns under `/api/admin/*`:

#### Collection Endpoints (List & Create)
```
GET  /api/admin/clients     → List all clients (with counts)
POST /api/admin/clients     → Create new client

GET  /api/admin/tasks       → List tasks (supports filtering)
POST /api/admin/tasks       → Create new task

GET  /api/admin/projects    → List projects
POST /api/admin/projects    → Create new project

GET  /api/admin/meetings    → List meetings
POST /api/admin/meetings    → Create new meeting

GET  /api/admin/ideas       → List ideas
POST /api/admin/ideas       → Create new idea
```

#### Resource Endpoints (Update & Delete)
```
PATCH  /api/admin/clients/[id]   → Update client
DELETE /api/admin/clients/[id]   → Delete client

PATCH  /api/admin/tasks/[id]     → Update task
DELETE /api/admin/tasks/[id]     → Delete task

PATCH  /api/admin/projects/[id]  → Update project
DELETE /api/admin/projects/[id]  → Delete project

PATCH  /api/admin/meetings/[id]  → Update meeting
DELETE /api/admin/meetings/[id]  → Delete meeting

PATCH  /api/admin/ideas/[id]     → Update idea
DELETE /api/admin/ideas/[id]     → Delete idea
```

#### Special Endpoints
```
GET /api/admin/dashboard  → Aggregate dashboard data (overdue, today, week, stats)
```

### 4.2 API Implementation Patterns

#### Standard GET Collection Pattern
```typescript
// Example: /api/admin/clients/route.ts
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
            meetings: true,
            ideas: true,
            projects: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    return NextResponse.json(clients)
  } catch (error) {
    console.error('GET clients error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}
```

#### Filtered GET with Query Params
```typescript
// Example: /api/admin/tasks/route.ts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    const where: any = {}
    if (clientId) where.clientId = clientId
    if (status) where.status = status
    if (priority) where.priority = priority

    const tasks = await prisma.task.findMany({
      where,
      include: {
        client: true,
        project: true,
        meeting: true
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('GET tasks error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}
```

#### POST Creation Pattern
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status || 'TODO',
        priority: body.priority || 'MEDIUM',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        clientId: body.clientId,
        projectId: body.projectId,
        meetingId: body.meetingId
      },
      include: {
        client: true,
        project: true,
        meeting: true
      }
    })
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('POST task error:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
```

#### PATCH Update Pattern
```typescript
// Example: /api/admin/tasks/[id]/route.ts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const data: any = { ...body }

    // Business logic: Auto-set completedAt when marking as COMPLETE
    if (data.status === 'COMPLETE' && !data.completedAt) {
      data.completedAt = new Date()
    }

    // Clear completedAt if moving back from COMPLETE
    if (data.status && data.status !== 'COMPLETE') {
      data.completedAt = null
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data,
      include: {
        client: true,
        project: true,
        meeting: true
      }
    })
    return NextResponse.json(task)
  } catch (error) {
    console.error('PATCH task error:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}
```

#### DELETE Pattern
```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.task.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE task error:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
```

### 4.3 Dashboard Aggregation Pattern

The dashboard endpoint demonstrates complex aggregate queries:

```typescript
// /api/admin/dashboard/route.ts
export async function GET() {
  try {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

    // Parallel queries for performance
    const [overdueTasks, todayTasks, thisWeekTasks, ideasNeedingReview, activeClients, tasksCompletedThisWeek] = await Promise.all([
      // Overdue tasks
      prisma.task.findMany({
        where: {
          status: { in: ['TODO', 'IN_PROGRESS'] },
          dueDate: { lt: startOfToday }
        },
        include: { client: true, project: true },
        orderBy: { dueDate: 'asc' }
      }),

      // Today's tasks
      prisma.task.findMany({
        where: {
          status: { in: ['TODO', 'IN_PROGRESS'] },
          dueDate: { gte: startOfToday, lte: endOfToday }
        },
        include: { client: true, project: true },
        orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }]
      }),

      // This week's tasks
      prisma.task.findMany({
        where: {
          status: { in: ['TODO', 'IN_PROGRESS'] },
          dueDate: { gt: endOfToday, lte: endOfWeek }
        },
        include: { client: true, project: true },
        orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }]
      }),

      // Ideas needing review
      prisma.idea.findMany({
        where: { status: { in: ['CAPTURED', 'REVIEWING'] } },
        include: { client: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Active clients count
      prisma.client.count({ where: { status: 'ACTIVE' } }),

      // Tasks completed this week
      prisma.task.count({
        where: {
          status: 'COMPLETE',
          completedAt: { gte: startOfLastWeek }
        }
      })
    ])

    return NextResponse.json({
      overdueTasks,
      todayTasks,
      thisWeekTasks,
      ideasNeedingReview,
      stats: {
        activeClients,
        tasksCompletedThisWeek,
        overdueCount: overdueTasks.length,
        todayCount: todayTasks.length,
        thisWeekCount: thisWeekTasks.length,
        ideasCount: ideasNeedingReview.length
      }
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
```

### 4.4 Error Handling Strategy

**Current Approach:**
- Try-catch blocks around all database operations
- Console error logging for debugging
- Generic error messages returned to client (avoid leaking internals)
- 500 status for server errors
- 201 status for successful creation

**Gap**: No validation layer before database operations (relies on Prisma validation)

---

## 5. Authentication & Authorization

### 5.1 NextAuth Configuration

**File**: [auth.ts](auth.ts)

```typescript
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow specific admin email
      const adminEmail = process.env.ADMIN_EMAIL
      if (user.email === adminEmail) {
        return true
      }
      return false
    },
    async session({ session, token }) {
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
})
```

**Key Decisions:**
1. **Single Provider**: Google OAuth only (solo consultant doesn't need multiple providers)
2. **Email Whitelist**: Single `ADMIN_EMAIL` environment variable for access control
3. **No Database Sessions**: JWT-based sessions (simpler, no session table needed)
4. **Custom Pages**: Brand-compliant sign-in and error pages

### 5.2 Middleware Protection

**File**: [middleware.ts](middleware.ts)

```typescript
import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    if (!req.auth) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return Response.redirect(signInUrl)
    }
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
```

**Protection Strategy:**
- Intercepts all `/admin/*` routes
- Checks for valid NextAuth session
- Redirects unauthenticated users to sign-in with callback URL
- Allows authenticated admin to proceed

### 5.3 Authorization Model

**Current State**: **Single-User Admin Model**
- No role-based access control (RBAC)
- No user management system
- Binary access: Either admin (full access) or no access
- Suitable for solo consultant workflow

**Future Consideration**: If team members added, would need:
- User model in database
- Role enumeration (ADMIN, EDITOR, VIEWER)
- Row-level security based on roles
- Audit logging of user actions (partially exists via AdminAuditLog)

---

## 6. Frontend Architecture

### 6.1 App Router Structure

```
app/
├── admin/                    # Protected admin interface
│   ├── layout.tsx           # Admin shell with sidebar navigation
│   ├── page.tsx             # Dashboard (default /admin route)
│   ├── clients/
│   │   └── page.tsx         # Client management
│   ├── projects/
│   │   └── page.tsx         # Project management
│   ├── tasks/
│   │   └── page.tsx         # Task management
│   ├── meetings/
│   │   └── page.tsx         # Meeting management
│   └── ideas/
│       └── page.tsx         # Idea management
├── auth/
│   ├── signin/
│   │   └── page.tsx         # Custom sign-in page
│   └── error/
│       └── page.tsx         # Auth error page
├── (public routes)/         # Marketing website
│   ├── page.tsx             # Homepage
│   ├── services/
│   ├── about/
│   └── how-i-work/
└── api/                     # API routes (covered in Section 4)
```

### 6.2 Component Architecture

**Location**: `components/`

**Organizational Pattern**: Flat component directory (no deep nesting)

**Key Components**:
- `Navigation.tsx` - Public site navigation with large logo
- `Hero.tsx` - Homepage hero section
- `PackageQuiz.tsx` - Interactive service package quiz
- `PackageRecommendation.tsx` - Quiz result modal
- `UserInfoModal.tsx` - Lead capture form
- Admin UI components (page-specific, not extracted yet)

### 6.3 Design System

**File**: [tailwind.config.ts](tailwind.config.ts)

```typescript
theme: {
  extend: {
    colors: {
      navy: '#1a1f3a',      // Primary background
      cyan: '#00d9ff',      // Active/today accent
      magenta: '#ff00ff',   // Urgent/overdue accent
    },
    fontFamily: {
      heading: ['var(--font-heading)', 'sans-serif'],
      body: ['var(--font-body)', 'sans-serif'],
    },
  },
}
```

**Brand Guidelines Applied to Admin UI:**

1. **Color Usage** (Status-Only):
   - Navy (`#1a1f3a`): 85%+ of backgrounds
   - Cyan (`#00d9ff`): Active status, today's items, primary actions
   - Magenta (`#ff00ff`): Urgent/overdue status, critical alerts
   - White opacity scales: Text hierarchy and borders
   - **NO decorative color** - color communicates status only

2. **Typography Hierarchy**:
   - Page titles: 22px, font-heading, bold
   - Card titles: 14px, font-heading, semibold
   - Metadata: 12px/11px, font-body, white/70 or white/50
   - Tracking: 0.4em for uppercase labels

3. **Spacing & Density**:
   - Card padding: `p-3.5` (14px)
   - Gap between elements: `gap-3` (12px)
   - Section margins: `mb-24` to `mb-32`
   - Dense layout maximizes information per screen

4. **Interactive States**:
   - Hover: `hover:border-white/10` (subtle border glow)
   - Hover bg: `hover:bg-white/[0.02]` (very subtle lift)
   - Button shadows: `shadow-[0_0_20px_rgba(0,217,255,0.3)]`
   - Transitions: `duration-300 ease-out`

5. **Status Indicators**:
   - 3px colored dots: `w-[3px] h-[3px] rounded-full`
   - Magenta dot: Urgent priority or overdue
   - Cyan dot: Active/today status
   - No dot: Low priority or future items

6. **Icon System**:
   - Lucide React icons exclusively (NO EMOJI)
   - Icon size: 16px (w-4 h-4) for inline, 20px for headers
   - Icon opacity: white/70 or white/50 for secondary actions
   - Example imports: `CheckCircle2`, `Clock`, `AlertCircle`, `Calendar`

### 6.4 State Management

**Current Approach**: **Client-Side React State**
- Each admin page manages own state with `useState`
- Data fetching via `fetch()` calls in `useEffect`
- No global state management library (Redux, Zustand, etc.)
- No caching layer (React Query, SWR)
- Optimistic updates not implemented (waits for server response)

**Pattern Example**:
```typescript
const [tasks, setTasks] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  async function fetchTasks() {
    const res = await fetch('/api/admin/tasks')
    const data = await res.json()
    setTasks(data)
    setLoading(false)
  }
  fetchTasks()
}, [])
```

**Gap**: No real-time updates, no optimistic UI, manual refetching after mutations

---

## 7. Data Access Layer

### 7.1 Prisma Client Configuration

**File**: [lib/prisma.ts](lib/prisma.ts)

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Key Design Decisions:**
1. **Singleton Pattern**: Prevents multiple Prisma Client instances in development
2. **Global Cache**: Uses `globalThis` to persist client across hot reloads
3. **Production Safety**: Only caches in development (production gets fresh instance)

### 7.2 Prisma Include Patterns

**Relationship Loading Strategy:**

```typescript
// Clients with counts (lightweight)
await prisma.client.findMany({
  include: {
    _count: {
      select: {
        tasks: true,
        meetings: true,
        ideas: true,
        projects: true
      }
    }
  }
})

// Tasks with full relationships (heavier)
await prisma.task.findMany({
  include: {
    client: true,      // Full client object
    project: true,     // Full project object
    meeting: true      // Full meeting object
  }
})
```

**Performance Consideration**: Using `_count` vs full `include` reduces payload size significantly

### 7.3 Query Patterns

**Common Patterns Used:**

1. **Filtered Queries**: `where` clause with dynamic filters
2. **Sorted Results**: `orderBy` with multiple fields
3. **Relationship Inclusion**: `include` for eager loading
4. **Counts Only**: `_count` for lightweight aggregates
5. **Limit Results**: `take` for pagination/preview
6. **Date Range Queries**: `gte`, `lte`, `gt`, `lt` operators

---

## 8. Deployment Architecture

### 8.1 Platform

**Hosting**: Vercel (inferred from Prisma binary targets)

**Binary Targets in schema.prisma:**
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

- `native`: Local development (macOS/Windows/Linux)
- `rhel-openssl-3.0.x`: Vercel serverless functions (Red Hat Enterprise Linux)

### 8.2 Environment Variables

**Required Configuration:**

```env
# Database
POSTGRES_PRISMA_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://...

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Authorization
ADMIN_EMAIL=drew@revelateops.com
```

### 8.3 Build Process

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

**Build Steps:**
1. Install dependencies (`npm install`)
2. Run postinstall hook → `prisma generate` (creates Prisma Client)
3. Next.js build → Compiles app for production
4. Deploy to Vercel → Serverless functions + static assets

---

## 9. Architectural Decisions

### 9.1 Key Technical Decisions

#### Decision 1: Next.js App Router vs Pages Router
**Chosen**: App Router (Next.js 16)
**Rationale**:
- Server Components reduce client bundle size
- Improved data fetching with async/await in components
- Better streaming and suspense support
- Future-proof (Pages Router in maintenance mode)

**Trade-offs**:
- Steeper learning curve (RSC paradigm shift)
- Some third-party libraries not yet compatible
- Client-side state requires 'use client' directive

---

#### Decision 2: Prisma vs Raw SQL or Other ORMs
**Chosen**: Prisma ORM
**Rationale**:
- Type-safe database queries (auto-generated types)
- Excellent developer experience with IntelliSense
- Built-in migration system (`prisma migrate`)
- Schema-first approach documents data model clearly
- Works well with serverless (connection pooling via Prisma Accelerate optional)

**Trade-offs**:
- Learning curve for Prisma-specific patterns
- Generated client increases bundle size
- Complex queries sometimes require raw SQL escape hatch

---

#### Decision 3: Single Admin Email vs User Management
**Chosen**: Single admin email whitelist
**Rationale**:
- Solo consultant doesn't need multi-user support
- Simplifies authentication (no user CRUD)
- Faster development (no role management)
- Easier to secure (smaller attack surface)

**Trade-offs**:
- Cannot delegate tasks to team members
- No audit trail of who performed actions
- Hard to scale if business grows

---

#### Decision 4: Client-Centered Data Model
**Chosen**: Client as central hub with cascade deletes
**Rationale**:
- Matches consulting business model (client is source of truth)
- Simplifies queries (always start from client)
- Data integrity guaranteed (no orphaned records)
- Clear ownership hierarchy

**Trade-offs**:
- Deleting client is destructive (loses all history)
- Projects/meetings can't exist without client context

---

#### Decision 5: No State Management Library
**Chosen**: Plain React state with useEffect fetching
**Rationale**:
- Simple read-heavy application (mostly CRUD)
- No complex state synchronization needs
- Fewer dependencies to maintain
- Easier for future developers to understand

**Trade-offs**:
- Manual cache invalidation after mutations
- No optimistic updates
- Potential for stale data
- More boilerplate in components

---

#### Decision 6: Google OAuth Only
**Chosen**: Single Google provider (no email/password, no magic links)
**Rationale**:
- Admin already uses Google Workspace
- No password management complexity
- Leverages Google's security infrastructure
- Faster sign-in flow (one click)

**Trade-offs**:
- Locked into Google ecosystem
- Cannot sign in if Google is down
- No fallback authentication method

---

### 9.2 Pattern Decisions

#### REST API Pattern
**Chosen**: RESTful endpoints with standard HTTP verbs
**Alternative Considered**: GraphQL, tRPC
**Rationale**:
- Simplicity (no schema definition needed for GraphQL)
- HTTP caching works out of box
- Easier to debug (standard HTTP tools)
- Matches Next.js API routes design

---

#### Server-Side Rendering Strategy
**Current**: Client-side data fetching in admin pages
**Alternative**: Server Components with async data fetching
**Rationale**: Admin pages need interactivity (modals, filters, real-time updates)
**Future Optimization**: Could use Server Components for initial load + Client Components for mutations

---

## 10. Architectural Gaps & Optimization Opportunities

### 10.1 Critical Gaps

#### 1. **No Input Validation Layer**
**Current State**: API routes accept JSON and pass directly to Prisma
**Risk**: Invalid data types, SQL injection (mitigated by Prisma parameterization), business logic violations
**Recommendation**: Add Zod schema validation before database operations

```typescript
// Example validation layer
import { z } from 'zod'

const createTaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETE', 'CANCELLED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().datetime().optional(),
  clientId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  meetingId: z.string().uuid().optional(),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const validated = createTaskSchema.parse(body) // Throws if invalid
  // ... proceed with creation
}
```

---

#### 2. **No API Authentication Check**
**Current State**: Middleware protects page routes, but API routes are unprotected
**Risk**: Anyone can call `/api/admin/*` endpoints directly (bypassing middleware)
**Severity**: **HIGH** - Entire CRM data exposed without authentication
**Recommendation**: Add auth check in every API route

```typescript
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... proceed with query
}
```

**OR** Create API middleware wrapper:
```typescript
// lib/api-middleware.ts
export function withAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return handler(request, context)
  }
}

// Usage in route
export const GET = withAuth(async () => {
  // Handler code
})
```

---

#### 3. **No Error Monitoring**
**Current State**: Errors logged to console only
**Risk**: Production errors go unnoticed until user reports
**Recommendation**: Integrate Sentry or similar error tracking

```typescript
import * as Sentry from '@sentry/nextjs'

export async function GET() {
  try {
    // ... query logic
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: '/api/admin/clients' }
    })
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}
```

---

#### 4. **No Rate Limiting**
**Current State**: No protection against abuse or accidental DDoS
**Risk**: Malicious actor could overwhelm database with requests
**Recommendation**: Add Vercel rate limiting or Upstash Redis-based limiter

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
})

export async function GET(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  // ... proceed
}
```

---

### 10.2 Performance Optimizations

#### 1. **Implement Data Caching**
**Current State**: Every page load triggers fresh database query
**Opportunity**: Add React Query or SWR for client-side caching

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function ClientsPage() {
  const queryClient = useQueryClient()

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await fetch('/api/admin/clients')
      return res.json()
    },
    staleTime: 60000, // Cache for 1 minute
  })

  const createClient = useMutation({
    mutationFn: async (newClient) => {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        body: JSON.stringify(newClient)
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    }
  })

  // ... component logic
}
```

**Benefits**:
- Reduce unnecessary database queries
- Instant navigation between cached pages
- Optimistic updates for better UX
- Automatic cache invalidation after mutations

---

#### 2. **Add Database Connection Pooling**
**Current State**: Prisma creates new connections for each query (mitigated by Prisma's internal pooling)
**Opportunity**: Use Prisma Accelerate or PgBouncer for better connection management in serverless

**Prisma Accelerate Setup**:
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["accelerate"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL") // For migrations
}
```

**Benefits**:
- Faster query execution (connection pooling + global cache)
- Reduced database load (query result caching)
- Better cold start performance in serverless

---

#### 3. **Optimize Prisma Queries**
**Current Inefficiency**: Some pages load more data than needed

**Example Optimization**:
```typescript
// BEFORE: Loading full client objects for dropdown
const clients = await prisma.client.findMany()

// AFTER: Load only needed fields
const clients = await prisma.client.findMany({
  select: {
    id: true,
    name: true,
    status: true
  }
})
```

**Additional Optimizations**:
- Use `select` instead of `include` when full relations not needed
- Add `take` limits to prevent loading thousands of records
- Implement cursor-based pagination for large datasets

---

#### 4. **Implement Optimistic Updates**
**Current UX**: User waits for server response before seeing changes
**Better UX**: Show change immediately, rollback if server fails

```typescript
const updateTask = useMutation({
  mutationFn: async (updates) => {
    const res = await fetch(`/api/admin/tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })
    return res.json()
  },
  onMutate: async (updates) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey: ['tasks'] })

    // Snapshot current data
    const previous = queryClient.getQueryData(['tasks'])

    // Optimistically update
    queryClient.setQueryData(['tasks'], (old) => {
      return old.map(t => t.id === task.id ? { ...t, ...updates } : t)
    })

    return { previous }
  },
  onError: (err, updates, context) => {
    // Rollback on error
    queryClient.setQueryData(['tasks'], context.previous)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }
})
```

---

### 10.3 Security Hardening

#### 1. **Add CSRF Protection**
**Current State**: No CSRF tokens on mutations
**Risk**: Cross-site request forgery attacks
**Recommendation**: Use NextAuth's built-in CSRF protection or add custom tokens

---

#### 2. **Implement Content Security Policy (CSP)**
**Current State**: No CSP headers
**Risk**: XSS attacks, data injection
**Recommendation**: Add CSP headers in next.config or middleware

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set('Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  )

  return response
}
```

---

#### 3. **Add Audit Logging for Admin Actions**
**Current State**: AdminAuditLog model exists but not used
**Opportunity**: Log all CRUD operations for compliance and debugging

```typescript
async function logAdminAction(action: string, resource: string, resourceId: string, changes: any) {
  await prisma.adminAuditLog.create({
    data: {
      action,
      resource,
      resourceId,
      changes: JSON.stringify(changes),
      timestamp: new Date()
    }
  })
}

// In API route
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  const task = await prisma.task.delete({ where: { id: params.id } })

  await logAdminAction('DELETE', 'Task', params.id, task)

  return NextResponse.json({ success: true })
}
```

---

### 10.4 Developer Experience Improvements

#### 1. **Add API Type Definitions**
**Current State**: Frontend manually types API responses
**Opportunity**: Generate types from Prisma schema

```typescript
// lib/api-types.ts
import type { Client, Task, Project, Meeting, Idea } from '@prisma/client'

export type ClientWithCounts = Client & {
  _count: {
    tasks: number
    meetings: number
    ideas: number
    projects: number
  }
}

export type TaskWithRelations = Task & {
  client: Client
  project: Project | null
  meeting: Meeting | null
}

// Frontend usage
const clients: ClientWithCounts[] = await fetch('/api/admin/clients').then(r => r.json())
```

---

#### 2. **Extract Reusable Admin Components**
**Current State**: Each page duplicates UI patterns (status badges, priority dots, action buttons)
**Opportunity**: Create shared component library

```typescript
// components/admin/StatusBadge.tsx
export function StatusBadge({ status, type }: { status: string, type: 'task' | 'project' | 'client' }) {
  const colors = {
    task: {
      TODO: 'bg-white/10 text-white/70',
      IN_PROGRESS: 'bg-cyan/20 text-cyan',
      COMPLETE: 'bg-green-500/20 text-green-400',
      BLOCKED: 'bg-red-500/20 text-red-400',
    },
    // ... other types
  }

  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[type][status]}`}>
      {status}
    </span>
  )
}
```

---

#### 3. **Add API Documentation**
**Current State**: No API documentation
**Opportunity**: Generate OpenAPI/Swagger docs from route handlers

Tools to consider:
- `next-swagger-doc` - Auto-generate from comments
- Manual Swagger YAML specification
- Postman collection export

---

### 10.5 Scalability Considerations

#### 1. **Database Indexes Audit**
**Current State**: Basic indexes on foreign keys and common queries
**Future Need**: As data grows, may need composite indexes

```sql
-- Potential composite indexes for common query patterns
CREATE INDEX idx_tasks_client_status_due ON tasks(client_id, status, due_date);
CREATE INDEX idx_meetings_client_scheduled ON meetings(client_id, scheduled_date);
```

---

#### 2. **Implement Soft Deletes**
**Current State**: Hard deletes remove data permanently
**Alternative**: Add `deletedAt` field for recovery and compliance

```prisma
model Task {
  // ... existing fields
  deletedAt DateTime? @map("deleted_at")
}

// In API route
await prisma.task.update({
  where: { id: params.id },
  data: { deletedAt: new Date() }
})

// Filter out soft-deleted in queries
await prisma.task.findMany({
  where: { deletedAt: null }
})
```

---

#### 3. **Add Full-Text Search**
**Current State**: No search functionality
**Future Need**: Search across client names, task titles, meeting notes

```prisma
model Client {
  // ... existing fields
  @@index([name], type: GIN) // PostgreSQL full-text search index
}

// Query with search
await prisma.client.findMany({
  where: {
    name: {
      search: 'consulting strategy'
    }
  }
})
```

---

## 11. Testing Strategy

### 11.1 Current State

**No test infrastructure detected**:
- No `__tests__` directories
- No test configuration (Jest, Vitest, Playwright)
- No CI/CD test pipeline

### 11.2 Recommended Testing Approach

#### Unit Tests (API Routes)
```typescript
// __tests__/api/admin/tasks.test.ts
import { GET, POST } from '@/app/api/admin/tasks/route'

describe('GET /api/admin/tasks', () => {
  it('returns all tasks for authenticated admin', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/tasks')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
  })

  it('returns 401 for unauthenticated requests', async () => {
    // Mock auth to return null
    const response = await GET(new NextRequest('http://localhost:3000/api/admin/tasks'))
    expect(response.status).toBe(401)
  })
})
```

#### Integration Tests (Prisma + Database)
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

beforeEach(async () => {
  await prisma.task.deleteMany()
  await prisma.client.deleteMany()
})

describe('Task CRUD operations', () => {
  it('creates task with client relationship', async () => {
    const client = await prisma.client.create({
      data: { name: 'Test Client', status: 'ACTIVE' }
    })

    const task = await prisma.task.create({
      data: {
        title: 'Test Task',
        status: 'TODO',
        priority: 'MEDIUM',
        clientId: client.id
      },
      include: { client: true }
    })

    expect(task.client.name).toBe('Test Client')
  })
})
```

#### E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test'

test('admin can create new task', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/signin')

  // Sign in with Google (use test account)
  await page.click('button:has-text("Sign in with Google")')

  // Navigate to tasks page
  await page.goto('http://localhost:3000/admin/tasks')

  // Create new task
  await page.click('button:has-text("New Task")')
  await page.fill('input[name="title"]', 'E2E Test Task')
  await page.selectOption('select[name="priority"]', 'HIGH')
  await page.click('button:has-text("Create")')

  // Verify task appears in list
  await expect(page.locator('text=E2E Test Task')).toBeVisible()
})
```

---

## 12. Deployment & Operations

### 12.1 Environment Management

**Environments:**
1. **Development**: Local machine with local PostgreSQL or cloud dev database
2. **Production**: Vercel deployment with production PostgreSQL

**Configuration Files**:
- `.env.local` (gitignored): Local development secrets
- `.env.production` (Vercel): Production environment variables

### 12.2 Database Migrations

**Workflow**:
```bash
# 1. Create migration after schema changes
npx prisma migrate dev --name add_task_priority

# 2. Apply to production
npx prisma migrate deploy

# 3. Generate Prisma Client
npx prisma generate
```

**Postinstall Hook**: Automatically runs `prisma generate` on `npm install` (configured in package.json)

### 12.3 Monitoring & Observability

**Current State**: Minimal observability
- Console logs for errors (not centralized)
- No performance monitoring
- No uptime monitoring

**Recommendations**:
1. **Error Tracking**: Sentry for exception monitoring
2. **Performance**: Vercel Analytics for Web Vitals
3. **Database**: Prisma Pulse for real-time change monitoring
4. **Uptime**: Uptime Robot or Better Uptime for endpoint monitoring

---

## 13. Future Architecture Considerations

### 13.1 When to Consider Microservices

**Current State**: Monolith (appropriate for current scale)

**Triggers for Service Split**:
1. Team grows beyond 5-10 developers
2. Services & Packages subsystem needs independent deployment
3. High load on specific features (quote generation)
4. Need different tech stacks for different domains

**Potential Service Boundaries**:
- **CRM Service**: Client, Project, Task, Meeting, Idea management
- **Quote Service**: Services, Packages, Scoping, Quote generation
- **Conversations Service**: Slack integration and message archival

### 13.2 When to Add Real-Time Features

**Current State**: Polling/manual refresh for updates

**Triggers for WebSockets/SSE**:
1. Multiple admins need to see live updates
2. Client portal added (clients see task updates in real-time)
3. Collaborative editing needed (meeting notes)

**Technology Options**:
- Vercel Serverless Functions + Pusher for pub/sub
- Socket.io with separate WebSocket server
- Supabase Realtime for PostgreSQL change streams

### 13.3 When to Consider Serverless Backend

**Current State**: Already serverless (Next.js API routes on Vercel)

**Further Optimization**:
- Edge Functions for geo-distributed latency improvement
- Background jobs for async tasks (quote PDF generation)
- Scheduled tasks for recurring operations (weekly reports)

---

## 14. Conclusion

The Revelate Operations CRM is a well-architected, modern full-stack application with a clear client-centered data model, type-safe development experience, and brand-compliant UI. The architecture is appropriate for a solo consultant managing client relationships, with room to grow as the business scales.

**Strengths:**
✅ Type-safe end-to-end (TypeScript + Prisma)
✅ Clean separation of concerns (API routes, data layer, UI)
✅ Modern tech stack (Next.js 16, React 19, Prisma 6)
✅ Strong authentication (NextAuth + Google OAuth)
✅ Brand-first design system (navy-dominant, status-only color)

**Critical Gaps to Address:**
🔴 **API route authentication** (high severity - data exposure risk)
🔴 **Input validation layer** (prevents invalid data corruption)
🟡 **Error monitoring** (production observability)
🟡 **Rate limiting** (abuse prevention)

**Recommended Next Steps:**
1. **Immediate**: Add authentication checks to all API routes
2. **Short-term**: Implement Zod validation and error monitoring (Sentry)
3. **Medium-term**: Add React Query for caching and optimistic updates
4. **Long-term**: Consider soft deletes, audit logging, and full-text search as data grows

This architecture provides a solid foundation for scaling the consulting business while maintaining code quality and developer velocity.

---

## Appendix A: File Structure Reference

```
revelateops-website/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin shell with sidebar
│   │   ├── page.tsx            # Dashboard
│   │   ├── clients/page.tsx    # Client management
│   │   ├── projects/page.tsx   # Project management
│   │   ├── tasks/page.tsx      # Task management
│   │   ├── meetings/page.tsx   # Meeting management
│   │   └── ideas/page.tsx      # Idea management
│   ├── auth/
│   │   ├── signin/page.tsx     # Custom sign-in
│   │   └── error/page.tsx      # Auth errors
│   ├── api/
│   │   ├── admin/
│   │   │   ├── dashboard/route.ts
│   │   │   ├── clients/route.ts
│   │   │   ├── clients/[id]/route.ts
│   │   │   ├── tasks/route.ts
│   │   │   ├── tasks/[id]/route.ts
│   │   │   ├── projects/route.ts
│   │   │   ├── projects/[id]/route.ts
│   │   │   ├── meetings/route.ts
│   │   │   ├── meetings/[id]/route.ts
│   │   │   ├── ideas/route.ts
│   │   │   └── ideas/[id]/route.ts
│   │   └── auth/[...nextauth]/route.ts
│   └── (public)/
│       ├── page.tsx            # Homepage
│       ├── services/page.tsx
│       ├── about/page.tsx
│       └── how-i-work/page.tsx
├── components/
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── PackageQuiz.tsx
│   ├── PackageRecommendation.tsx
│   └── UserInfoModal.tsx
├── lib/
│   └── prisma.ts               # Prisma Client singleton
├── prisma/
│   └── schema.prisma           # Database schema (3 subsystems)
├── auth.ts                     # NextAuth config
├── middleware.ts               # Route protection
├── tailwind.config.ts          # Design system tokens
├── package.json                # Dependencies
└── .env.local                  # Local secrets (gitignored)
```

---

## Appendix B: API Endpoint Reference

### Client Management
| Method | Endpoint | Description | Returns |
|--------|----------|-------------|---------|
| GET | `/api/admin/clients` | List all clients with counts | `Client[]` with `_count` |
| POST | `/api/admin/clients` | Create new client | `Client` (201) |
| PATCH | `/api/admin/clients/[id]` | Update client | `Client` |
| DELETE | `/api/admin/clients/[id]` | Delete client (cascade) | `{ success: true }` |

### Task Management
| Method | Endpoint | Query Params | Description | Returns |
|--------|----------|--------------|-------------|---------|
| GET | `/api/admin/tasks` | `?clientId=&status=&priority=` | List filtered tasks | `Task[]` with relations |
| POST | `/api/admin/tasks` | - | Create new task | `Task` (201) with relations |
| PATCH | `/api/admin/tasks/[id]` | - | Update task (auto-sets completedAt) | `Task` with relations |
| DELETE | `/api/admin/tasks/[id]` | - | Delete task | `{ success: true }` |

### Project Management
| Method | Endpoint | Description | Returns |
|--------|----------|-------------|---------|
| GET | `/api/admin/projects` | List all projects | `Project[]` with relations |
| POST | `/api/admin/projects` | Create new project | `Project` (201) |
| PATCH | `/api/admin/projects/[id]` | Update project | `Project` |
| DELETE | `/api/admin/projects/[id]` | Delete project | `{ success: true }` |

### Meeting Management
| Method | Endpoint | Description | Returns |
|--------|----------|-------------|---------|
| GET | `/api/admin/meetings` | List all meetings | `Meeting[]` with relations |
| POST | `/api/admin/meetings` | Create new meeting | `Meeting` (201) |
| PATCH | `/api/admin/meetings/[id]` | Update meeting | `Meeting` |
| DELETE | `/api/admin/meetings/[id]` | Delete meeting | `{ success: true }` |

### Idea Management
| Method | Endpoint | Description | Returns |
|--------|----------|-------------|---------|
| GET | `/api/admin/ideas` | List all ideas | `Idea[]` with relations |
| POST | `/api/admin/ideas` | Create new idea | `Idea` (201) |
| PATCH | `/api/admin/ideas/[id]` | Update idea | `Idea` |
| DELETE | `/api/admin/ideas/[id]` | Delete idea | `{ success: true }` |

### Dashboard
| Method | Endpoint | Description | Returns |
|--------|----------|-------------|---------|
| GET | `/api/admin/dashboard` | Aggregate dashboard data | Complex object (see Section 4.3) |

---

**Document Version**: 1.0.0
**Last Updated**: 2025-11-06
**Next Review**: When implementing optimizations from Section 10
