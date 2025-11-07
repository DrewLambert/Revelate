# Revelate Operations CRM - Optimization Roadmap

**Project**: Revelate Operations
**Document Type**: Implementation Roadmap
**Date**: 2025-11-06
**Status**: Recommended Actions
**Reference**: See [architecture.md](architecture.md) for full technical details

---

## Executive Summary

The Revelate Operations CRM is well-architected with a solid foundation. However, there are **critical security gaps** that must be addressed immediately, along with performance and scalability optimizations that will improve the system as it grows.

**Priority Breakdown:**
- 🔴 **CRITICAL** (Fix Now): 2 security vulnerabilities exposing CRM data
- 🟠 **HIGH** (This Sprint): 3 foundational improvements for reliability
- 🟡 **MEDIUM** (Next Quarter): 4 performance optimizations for better UX
- 🟢 **LOW** (Future): 3 scalability enhancements for growth

---

## 🔴 CRITICAL - Security Vulnerabilities (Fix Immediately)

### 1. API Routes Have No Authentication

**Risk Level**: 🔴 **CRITICAL - Data Exposure**

**Problem**:
```typescript
// Current state: Anyone can access API endpoints directly
curl https://revelateops.com/api/admin/clients
// Returns: ALL client data (names, emails, phone, company, notes)

curl -X DELETE https://revelateops.com/api/admin/clients/[uuid]
// Result: Client and all related data deleted (no auth check!)
```

**Why This Matters**:
- Middleware only protects `/admin/*` pages (not API routes)
- Anyone can call `/api/admin/*` endpoints directly
- All CRM data (clients, tasks, meetings, ideas) is publicly accessible
- Malicious actor could read, modify, or delete entire database

**Fix** (Estimated Time: 2 hours):

**Option A**: Add auth check to every route
```typescript
// app/api/admin/clients/route.ts
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Existing logic...
  const clients = await prisma.client.findMany({ /* ... */ })
  return NextResponse.json(clients)
}
```

**Option B**: Create reusable auth wrapper (RECOMMENDED)
```typescript
// lib/api-middleware.ts
import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'

export function withAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return handler(request, context)
  }
}

// Usage in EVERY API route:
// app/api/admin/clients/route.ts
import { withAuth } from '@/lib/api-middleware'

export const GET = withAuth(async () => {
  const clients = await prisma.client.findMany({ /* ... */ })
  return NextResponse.json(clients)
})

export const POST = withAuth(async (request: NextRequest) => {
  const body = await request.json()
  // Create client...
})
```

**Files to Update** (11 route files):
- `app/api/admin/dashboard/route.ts`
- `app/api/admin/clients/route.ts`
- `app/api/admin/clients/[id]/route.ts`
- `app/api/admin/tasks/route.ts`
- `app/api/admin/tasks/[id]/route.ts`
- `app/api/admin/projects/route.ts`
- `app/api/admin/projects/[id]/route.ts`
- `app/api/admin/meetings/route.ts`
- `app/api/admin/meetings/[id]/route.ts`
- `app/api/admin/ideas/route.ts`
- `app/api/admin/ideas/[id]/route.ts`

**Test Plan**:
```bash
# 1. Test unauthenticated access returns 401
curl https://revelateops.com/api/admin/clients
# Expected: {"error":"Unauthorized"}

# 2. Test authenticated admin can access
# (Use browser with valid session cookie)
# Expected: Returns client data

# 3. Verify all 11 route files protected
```

---

### 2. No Input Validation on API Routes

**Risk Level**: 🔴 **CRITICAL - Data Corruption & Injection**

**Problem**:
```typescript
// Current state: No validation before database operations
export async function POST(request: NextRequest) {
  const body = await request.json()

  // What if body.title is 10,000 characters? (schema max is 500)
  // What if body.status is "INVALID_STATUS"? (not in enum)
  // What if body.clientId is "not-a-uuid"? (causes Prisma error)
  // What if body.dueDate is "invalid-date"? (causes Date() error)

  const task = await prisma.task.create({ data: body })
  // ❌ Database operation fails with cryptic error
}
```

**Why This Matters**:
- Invalid data types crash the API (500 errors)
- Enum violations cause Prisma errors
- String length violations cause database errors
- Poor error messages confuse users
- No business logic validation (e.g., due date must be future)

**Fix** (Estimated Time: 4 hours):

**Install Zod**:
```bash
npm install zod
```

**Create Validation Schemas**:
```typescript
// lib/validation/task.schema.ts
import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title required').max(500, 'Title too long'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETE', 'CANCELLED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().datetime().optional().or(z.null()),
  clientId: z.string().uuid('Invalid client ID'),
  projectId: z.string().uuid().optional().or(z.null()),
  meetingId: z.string().uuid().optional().or(z.null()),
})

export const updateTaskSchema = createTaskSchema.partial()
```

**Use in API Routes**:
```typescript
// app/api/admin/tasks/route.ts
import { createTaskSchema } from '@/lib/validation/task.schema'

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()

    // Validate and parse input
    const validated = createTaskSchema.parse(body)

    // Now safe to use validated data
    const task = await prisma.task.create({
      data: {
        ...validated,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      },
      include: {
        client: true,
        project: true,
        meeting: true
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('POST task error:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
})
```

**Validation Schemas Needed**:
- `lib/validation/client.schema.ts`
- `lib/validation/task.schema.ts`
- `lib/validation/project.schema.ts`
- `lib/validation/meeting.schema.ts`
- `lib/validation/idea.schema.ts`

**Test Plan**:
```bash
# 1. Test invalid enum value
curl -X POST /api/admin/tasks -d '{"status":"INVALID"}'
# Expected: 400 with validation error details

# 2. Test string too long
curl -X POST /api/admin/tasks -d '{"title":"'$(printf 'A%.0s' {1..501})'"}'
# Expected: 400 "Title too long"

# 3. Test invalid UUID
curl -X POST /api/admin/tasks -d '{"clientId":"not-a-uuid"}'
# Expected: 400 "Invalid client ID"

# 4. Test valid data works
curl -X POST /api/admin/tasks -d '{"title":"Valid Task","status":"TODO","priority":"MEDIUM","clientId":"[valid-uuid]"}'
# Expected: 201 with created task
```

---

## 🟠 HIGH Priority - Foundational Improvements (This Sprint)

### 3. Add Error Monitoring with Sentry

**Impact**: Production stability, faster debugging

**Problem**: Errors only logged to console (invisible in production)

**Solution** (Estimated Time: 1 hour):

**Install Sentry**:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Configuration**:
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})

// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

**Update API Routes**:
```typescript
// lib/api-middleware.ts (enhanced)
export function withAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    try {
      const session = await auth()
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return await handler(request, context)
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          api_route: request.nextUrl.pathname,
          method: request.method,
        },
        extra: {
          body: await request.clone().text().catch(() => null),
        }
      })

      console.error('API error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}
```

**Benefits**:
- See all production errors in Sentry dashboard
- Get Slack/email alerts for critical errors
- Stack traces with source maps for debugging
- Performance monitoring (identify slow API routes)

---

### 4. Implement Rate Limiting

**Impact**: Prevent abuse, protect database from overload

**Problem**: No protection against API spam (accidental or malicious)

**Solution** (Estimated Time: 2 hours):

**Install Upstash Redis** (free tier):
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Setup**:
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// 60 requests per minute per IP
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true,
})

// Stricter limit for mutations (create/update/delete)
export const mutationRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'),
})
```

**Use in Middleware**:
```typescript
// lib/api-middleware.ts (enhanced again)
import { ratelimit, mutationRatelimit } from '@/lib/rate-limit'

export function withAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    // Rate limit check
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const limiter = ['POST', 'PATCH', 'DELETE'].includes(request.method)
      ? mutationRatelimit
      : ratelimit

    const { success, limit, remaining, reset } = await limiter.limit(ip)

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          limit,
          remaining,
          reset: new Date(reset).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      )
    }

    // Auth check
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Execute handler
    try {
      return await handler(request, context)
    } catch (error) {
      Sentry.captureException(error, { /* ... */ })
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}
```

**Benefits**:
- Prevent accidental infinite loops from crashing site
- Protect against malicious API spam
- Database stays healthy under load

---

### 5. Add React Query for Client-Side Caching

**Impact**: Faster page navigation, better UX, reduced database load

**Problem**: Every page navigation triggers fresh database query (even if just viewed)

**Solution** (Estimated Time: 3 hours):

**Install**:
```bash
npm install @tanstack/react-query
```

**Setup Provider**:
```typescript
// app/admin/layout.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function AdminLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {/* Existing layout */}
      {children}
    </QueryClientProvider>
  )
}
```

**Refactor Admin Pages**:
```typescript
// app/admin/tasks/page.tsx (BEFORE)
'use client'
export default function TasksPage() {
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

  // Render...
}

// app/admin/tasks/page.tsx (AFTER)
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function TasksPage() {
  const queryClient = useQueryClient()

  // Fetch with automatic caching
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/admin/tasks')
      if (!res.ok) throw new Error('Failed to fetch tasks')
      return res.json()
    },
  })

  // Create mutation with automatic cache update
  const createTask = useMutation({
    mutationFn: async (newTask) => {
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })
      if (!res.ok) throw new Error('Failed to create task')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  // Update mutation
  const updateTask = useMutation({
    mutationFn: async ({ id, updates }) => {
      const res = await fetch(`/api/admin/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update task')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  // Render...
}
```

**Benefits**:
- Navigate between admin pages instantly (cached data)
- Automatic background refetching (stay up to date)
- Loading states handled automatically
- Error handling built-in
- Can add optimistic updates later (show change before server confirms)

**Pages to Refactor** (5 pages):
- `app/admin/clients/page.tsx`
- `app/admin/tasks/page.tsx`
- `app/admin/projects/page.tsx`
- `app/admin/meetings/page.tsx`
- `app/admin/ideas/page.tsx`

---

## 🟡 MEDIUM Priority - Performance & UX (Next Quarter)

### 6. Add Optimistic UI Updates

**Impact**: Instant feedback when user takes action

**Current UX**:
```
User clicks "Mark Complete" →
  Loading spinner shows (500-2000ms) →
    Server updates database →
      Response returns →
        UI updates
```

**Better UX** (with React Query):
```
User clicks "Mark Complete" →
  UI updates IMMEDIATELY (feels instant) →
    Server updates in background →
      If success: Keep change
      If error: Rollback + show error
```

**Implementation** (Estimated Time: 2 hours per entity):
```typescript
const updateTask = useMutation({
  mutationFn: async ({ id, updates }) => {
    const res = await fetch(`/api/admin/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error('Failed to update')
    return res.json()
  },

  // OPTIMISTIC UPDATE
  onMutate: async ({ id, updates }) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey: ['tasks'] })

    // Snapshot current data (for rollback)
    const previous = queryClient.getQueryData(['tasks'])

    // Optimistically update cache
    queryClient.setQueryData(['tasks'], (old) => {
      return old.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    })

    return { previous }
  },

  // ROLLBACK ON ERROR
  onError: (err, variables, context) => {
    queryClient.setQueryData(['tasks'], context.previous)
    toast.error('Failed to update task')
  },

  // REFETCH ON SUCCESS
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  },
})
```

**Benefits**:
- Feels 10x faster (instant feedback)
- Professional UX (like Linear, Notion, Asana)
- Automatic error recovery

---

### 7. Extract Reusable Admin UI Components

**Impact**: Consistent UI, faster development, easier maintenance

**Current State**: Each admin page duplicates UI patterns

**Duplicated Patterns**:
- Status badges (TODO, IN_PROGRESS, COMPLETE, etc.)
- Priority dots (3px colored circles)
- Date formatting (relative dates, calendar dates)
- Action buttons (Edit, Delete with icons)
- Empty states ("No tasks yet")
- Loading skeletons

**Create Component Library** (Estimated Time: 4 hours):

```typescript
// components/admin/StatusBadge.tsx
type StatusType = 'task' | 'project' | 'client' | 'meeting' | 'idea'

interface StatusBadgeProps {
  status: string
  type: StatusType
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const styles = {
    task: {
      TODO: 'bg-white/10 text-white/70',
      IN_PROGRESS: 'bg-cyan/20 text-cyan border border-cyan/30',
      COMPLETE: 'bg-green-500/20 text-green-400 border border-green-500/30',
      BLOCKED: 'bg-red-500/20 text-red-400 border border-red-500/30',
      CANCELLED: 'bg-white/5 text-white/40',
    },
    project: {
      PLANNING: 'bg-white/10 text-white/70',
      ACTIVE: 'bg-cyan/20 text-cyan border border-cyan/30',
      ON_HOLD: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      COMPLETED: 'bg-green-500/20 text-green-400 border border-green-500/30',
      CANCELLED: 'bg-white/5 text-white/40',
    },
    // ... client, meeting, idea
  }

  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider ${styles[type][status]}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

// components/admin/PriorityDot.tsx
export function PriorityDot({ priority }: { priority: string }) {
  const colors = {
    URGENT: 'bg-magenta',
    HIGH: 'bg-magenta',
    MEDIUM: 'bg-white/30',
    LOW: 'bg-white/10',
  }

  return (
    <div className={`w-[3px] h-[3px] rounded-full ${colors[priority]}`} />
  )
}

// components/admin/RelativeDate.tsx
import { formatDistanceToNow } from 'date-fns'

export function RelativeDate({ date }: { date: string | Date }) {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return (
    <span className="text-[11px] text-white/50">
      {formatDistanceToNow(dateObj, { addSuffix: true })}
    </span>
  )
}

// components/admin/EmptyState.tsx
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Icon className="w-16 h-16 text-white/10 mb-6" />
      <h3 className="text-lg font-heading font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-white/50 mb-8 max-w-md">
        {description}
      </p>
      {action}
    </div>
  )
}
```

**Refactor Pages to Use Components**:
```typescript
// app/admin/tasks/page.tsx (simplified)
import { StatusBadge, PriorityDot, RelativeDate, EmptyState } from '@/components/admin'

export default function TasksPage() {
  // ... query logic

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="No tasks yet"
        description="Create your first task to get started tracking work"
        action={<button onClick={() => setShowCreateModal(true)}>New Task</button>}
      />
    )
  }

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id} className="...">
          <PriorityDot priority={task.priority} />
          <div>
            <h3>{task.title}</h3>
            <StatusBadge status={task.status} type="task" />
            <RelativeDate date={task.dueDate} />
          </div>
        </div>
      ))}
    </div>
  )
}
```

**Benefits**:
- Consistent UI across all admin pages
- Fix bug once, fixed everywhere
- Faster feature development (compose from library)
- Easier onboarding for future developers

---

### 8. Optimize Prisma Queries

**Impact**: Faster API responses, reduced database load

**Current Inefficiencies**:
1. Loading full objects when only IDs/names needed (dropdowns)
2. No pagination limits (could load thousands of tasks)
3. Over-fetching relationships

**Optimizations** (Estimated Time: 3 hours):

```typescript
// BEFORE: Loading full clients for dropdown
const clients = await prisma.client.findMany({
  include: {
    _count: { select: { tasks: true, meetings: true, ideas: true, projects: true } }
  }
})
// Returns: ALL fields + counts (500KB+ for 100 clients)

// AFTER: Select only needed fields
const clients = await prisma.client.findMany({
  select: {
    id: true,
    name: true,
    status: true,
  },
  orderBy: { name: 'asc' },
})
// Returns: Just ID, name, status (50KB for 100 clients)

// BEFORE: No pagination
const tasks = await prisma.task.findMany({ /* ... */ })
// Returns: ALL tasks (could be 10,000+)

// AFTER: Cursor-based pagination
const tasks = await prisma.task.findMany({
  take: 50, // Limit to 50
  skip: cursor ? 1 : 0,
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: { createdAt: 'desc' },
})
// Returns: 50 tasks per page

// BEFORE: Over-fetching relationships
const task = await prisma.task.findUnique({
  where: { id },
  include: {
    client: true, // Full client object (all fields)
    project: true, // Full project object
    meeting: true, // Full meeting object
  }
})

// AFTER: Select only displayed fields
const task = await prisma.task.findUnique({
  where: { id },
  include: {
    client: {
      select: { id: true, name: true, status: true }
    },
    project: {
      select: { id: true, name: true }
    },
    meeting: {
      select: { id: true, title: true, scheduledDate: true }
    }
  }
})
```

**API Routes to Optimize**:
- `/api/admin/clients` - Add pagination, select minimal fields for list view
- `/api/admin/tasks` - Add pagination, optimize includes
- `/api/admin/projects` - Add pagination
- `/api/admin/meetings` - Add pagination
- `/api/admin/ideas` - Add pagination

**Benefits**:
- 5-10x smaller payloads (faster API responses)
- Reduced database query time
- Better performance as data grows

---

### 9. Implement Audit Logging

**Impact**: Compliance, debugging, accountability

**Current State**: `AdminAuditLog` model exists but unused

**Implementation** (Estimated Time: 2 hours):

```typescript
// lib/audit-log.ts
import { prisma } from '@/lib/prisma'

export async function logAdminAction(
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  resource: string,
  resourceId: string,
  changes: any,
  adminEmail: string
) {
  await prisma.adminAuditLog.create({
    data: {
      action,
      resource,
      resourceId,
      changes: JSON.stringify(changes),
      performedBy: adminEmail,
      timestamp: new Date(),
    }
  })
}

// Enhanced API middleware
export function withAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    // ... auth + rate limit checks

    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
      const response = await handler(request, context)

      // Log mutations (POST, PATCH, DELETE)
      if (['POST', 'PATCH', 'DELETE'].includes(request.method) && response.ok) {
        const resource = request.nextUrl.pathname.split('/')[3] // 'tasks', 'clients', etc.
        const resourceId = context?.params?.id || 'new'
        const action = request.method === 'POST' ? 'CREATE' : request.method === 'PATCH' ? 'UPDATE' : 'DELETE'

        // Fire and forget (don't block response)
        logAdminAction(
          action,
          resource,
          resourceId,
          await request.clone().json().catch(() => null),
          session.user.email
        ).catch(err => console.error('Audit log failed:', err))
      }

      return response
    } catch (error) {
      // ... error handling
    }
  }
}
```

**Add Audit Log Viewer** (admin page):
```typescript
// app/admin/audit-log/page.tsx
export default function AuditLogPage() {
  const { data: logs = [] } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const res = await fetch('/api/admin/audit-logs')
      return res.json()
    },
  })

  return (
    <div>
      <h1>Audit Log</h1>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>Resource</th>
            <th>Changes</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.action}</td>
              <td>{log.resource}/{log.resourceId}</td>
              <td><pre>{log.changes}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

**Benefits**:
- Track all changes to CRM data (who changed what when)
- Debug issues ("Who deleted this client?")
- Compliance requirement for some industries
- Accountability if team grows

---

## 🟢 LOW Priority - Scalability (Future)

### 10. Implement Soft Deletes

**Impact**: Data recovery, better audit trail

**Why Later**: Current data volume is small, hard deletes acceptable

**Implementation When Needed**:
```prisma
model Task {
  // ... existing fields
  deletedAt DateTime? @map("deleted_at")
}

// Migration: Add deletedAt column to all tables
// Update queries: WHERE deletedAt IS NULL
// Update deletes: SET deletedAt = NOW() instead of DELETE
```

---

### 11. Add Full-Text Search

**Impact**: Find clients/tasks by keywords

**Why Later**: Small data set, manual filtering works

**Implementation When Needed**:
```prisma
// Use PostgreSQL full-text search
model Client {
  // ... existing fields
  @@index([name], type: GIN)
}

// Query
await prisma.client.findMany({
  where: {
    name: { search: 'consulting strategy' }
  }
})
```

---

### 12. Database Connection Pooling with Prisma Accelerate

**Impact**: Faster queries, better serverless performance

**Why Later**: Current query times acceptable

**Implementation When Needed**:
```bash
# Enable Prisma Accelerate (global cache + connection pooling)
npx prisma accelerate enable

# Update schema
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["accelerate"]
}
```

---

## Implementation Timeline

### Week 1 (CRITICAL - Must Do)
- [ ] **Day 1-2**: Fix #1 - Add API route authentication (`withAuth` wrapper)
- [ ] **Day 3-4**: Fix #2 - Add Zod validation to all API routes
- [ ] **Day 5**: Test both fixes thoroughly

**Deliverable**: Secure, validated API

---

### Week 2 (HIGH - Should Do)
- [ ] **Day 1**: Setup #3 - Sentry error monitoring
- [ ] **Day 2**: Setup #4 - Upstash rate limiting
- [ ] **Day 3-5**: Implement #5 - React Query on all admin pages

**Deliverable**: Production-ready monitoring + better UX

---

### Month 2 (MEDIUM - Nice to Have)
- [ ] **Week 1**: Implement #6 - Optimistic updates
- [ ] **Week 2**: Implement #7 - Extract reusable components
- [ ] **Week 3**: Implement #8 - Optimize Prisma queries
- [ ] **Week 4**: Implement #9 - Audit logging

**Deliverable**: Polished UX + performance boost

---

### Quarter 2 (LOW - Future Enhancements)
- [ ] Implement #10 - Soft deletes (if needed)
- [ ] Implement #11 - Full-text search (if needed)
- [ ] Implement #12 - Prisma Accelerate (if scaling)

**Deliverable**: Enterprise-grade features

---

## Success Metrics

### Week 1 Success Criteria
- ✅ All API routes return 401 for unauthenticated requests
- ✅ Invalid inputs return 400 with clear error messages
- ✅ No breaking changes to existing functionality

### Week 2 Success Criteria
- ✅ Sentry receives error reports (test by triggering intentional error)
- ✅ Rate limit kicks in after 60 requests/minute
- ✅ Admin page navigation feels instant (cached data)

### Month 2 Success Criteria
- ✅ Task status changes appear instant (optimistic updates)
- ✅ UI components consistent across all admin pages
- ✅ API response times < 200ms (optimized queries)

---

## Cost Estimate

| Service | Plan | Cost | Purpose |
|---------|------|------|---------|
| **Sentry** | Developer (free) | $0/mo | Error monitoring (up to 5K events/mo) |
| **Upstash Redis** | Free tier | $0/mo | Rate limiting (10K requests/day) |
| **Prisma Accelerate** | Not needed yet | $0/mo | Future optimization |
| **Total** | - | **$0/mo** | All improvements free tier |

*(If usage grows beyond free tiers: Sentry ~$26/mo, Upstash ~$10/mo)*

---

## Questions & Decisions Needed

1. **Week 1 Priority**: Confirm fixing security gaps (#1 + #2) is top priority?
2. **Error Monitoring**: Sentry acceptable or prefer different tool (e.g., Datadog, LogRocket)?
3. **Rate Limiting**: 60 req/min reasonable or need higher limit?
4. **Timeline**: Can dedicate 1-2 weeks to critical fixes?

---

## Next Steps

1. **Review this roadmap** - Confirm priorities align with business goals
2. **Start Week 1 work** - Fix critical security gaps
3. **Setup monitoring** - Get visibility into production errors
4. **Plan sprints** - Schedule HIGH and MEDIUM priority work

**Questions?** Reference [architecture.md](architecture.md) for full technical details on any topic.
