# 🚀 CRM System - Quick Start (Local)

Get your CRM running locally in 5 minutes!

## Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./scripts/setup-crm-local.sh
```

This will:
1. Create `.env.local` from template
2. Install dependencies
3. Run database migrations
4. Generate Prisma client
5. Optionally seed sample data
6. Start the dev server

## Option 2: Manual Setup

### 1. Environment Setup

```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local and add your database URL
nano .env.local  # or use your preferred editor
```

**Minimum required:**
```env
POSTGRES_PRISMA_URL="postgresql://user:pass@localhost:5432/revelate_crm"
ADMIN_API_KEY="your-admin-key"
```

### 2. Install & Migrate

```bash
# Install dependencies
npm install

# Run migrations (creates CRM tables)
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### 3. Seed Sample Data (Optional but Recommended)

```bash
npx tsx prisma/seed-crm.ts
```

This creates:
- 3 sample companies (Acme Corp, TechStartup, GrowthCo)
- 4 contacts
- 3 deals ($105k pipeline)
- 2 projects
- 6 tasks
- 4 activities

### 4. Start Development Server

```bash
npm run dev
```

## Access the CRM

1. **Login to Admin** (if needed):
   - Go to: `http://localhost:3000/admin`
   - Enter your `ADMIN_API_KEY`

2. **Open CRM Dashboard**:
   - Go to: `http://localhost:3000/crm`
   - Or click "CRM" in the navigation

## What You'll See

### Dashboard (`/crm/dashboard`)
- Overview metrics
- Pipeline value
- Task completion rates
- Quick action cards

### Companies (`/crm/companies`)
- List of B2B accounts
- Add new companies
- Filter and search

### Contacts (`/crm/contacts`)
- Contact directory
- Linked to companies
- Email and phone info

### Deals (`/crm/deals`)
- Kanban pipeline board
- Drag and drop deals through stages:
  - Lead → Qualified → Proposal → Negotiation → Closed Won/Lost

### Projects (`/crm/projects`)
- Project tracking
- Progress bars
- Due dates

### Tasks (`/crm/tasks`)
- Task list with filters
- Priority levels (low, medium, high, urgent)
- Due dates with overdue warnings
- Link to projects or deals

## Quick Tips

### View Your Database

```bash
# Open Prisma Studio (database GUI)
npx prisma studio
```

Visit `http://localhost:5555` to browse your data visually.

### Reset Database (⚠️ Deletes all data)

```bash
npx prisma migrate reset
npx tsx prisma/seed-crm.ts
```

### Common Issues

**"Can't connect to database"**
- Make sure PostgreSQL is running
- Check your `POSTGRES_PRISMA_URL` in `.env.local`
- Try: `brew services start postgresql` (macOS) or `sudo service postgresql start` (Linux)

**"Prisma Client not found"**
- Run: `npx prisma generate`

**"Admin not authenticated"**
- Check `ADMIN_API_KEY` in `.env.local`
- Login at `/admin` first
- Your API key is stored in localStorage

## Database Options

Choose what works for you:

### Local PostgreSQL
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb revelate_crm

# Connection string
POSTGRES_PRISMA_URL="postgresql://postgres@localhost:5432/revelate_crm"
```

### Vercel Postgres (Free tier)
1. Go to your Vercel dashboard
2. Create a Postgres database
3. Copy the `POSTGRES_PRISMA_URL`

### Neon (Serverless Postgres - Free tier)
1. Sign up at https://neon.tech
2. Create a project
3. Copy connection string

### Supabase (Free tier)
1. Create project at https://supabase.com
2. Get connection string from Settings → Database
3. Use the "Connection Pooling" string

## Next Steps

1. **Explore the features** - Click through all the CRM pages
2. **Create test data** - Add your own companies and deals
3. **Check integrations** - Link a conversation to a contact
4. **Customize** - Modify the UI to match your needs
5. **Test on mobile** - Everything is responsive

## Need Help?

- Read: `CRM_SETUP.md` for detailed instructions
- Check: Browser console for errors
- View: Terminal output for server errors
- Browse: Database with `npx prisma studio`

---

**You're all set! 🎉**

Your CRM is running at: `http://localhost:3000/crm`
