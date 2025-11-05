# CRM System - Local Setup Guide

This guide will help you run the CRM system locally on your machine.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted like Vercel Postgres, Neon, Supabase)
- Admin API key (you should already have this)

## Step 1: Clone and Navigate

```bash
cd revelateops-website
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# Database
POSTGRES_PRISMA_URL="postgresql://username:password@localhost:5432/revelate_crm?schema=public"

# Admin (you should already have these)
ADMIN_API_KEY="your-admin-api-key"

# Slack (optional - for contact form)
SLACK_BOT_TOKEN="xoxb-your-token"
SLACK_USER_ID="U..."

# Calendly (optional)
CALENDLY_API_TOKEN="your-token"

# Sentry (optional - for error tracking)
SENTRY_AUTH_TOKEN="your-token"
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"

# Analytics (optional)
NEXT_PUBLIC_GA_ID="G-..."
```

### Database Connection Options

**Option 1: Local PostgreSQL**
```
POSTGRES_PRISMA_URL="postgresql://postgres:password@localhost:5432/revelate_crm"
```

**Option 2: Vercel Postgres** (if you're using Vercel)
```
POSTGRES_PRISMA_URL="postgres://username:password@region-pooler.postgres.vercel-storage.com/verceldb"
```

**Option 3: Neon** (serverless Postgres)
```
POSTGRES_PRISMA_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb"
```

## Step 4: Run Database Migrations

This will create all the CRM tables in your database:

```bash
npx prisma migrate deploy
```

Or if you want to run in dev mode (creates migration if needed):

```bash
npx prisma migrate dev
```

## Step 5: Generate Prisma Client

```bash
npx prisma generate
```

## Step 6: (Optional) Seed Sample Data

You can create some test data to get started. I'll create a seed script for you.

## Step 7: Start the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:3000`

## Step 8: Access the CRM

1. **Login to Admin** (if not already logged in):
   - Go to `http://localhost:3000/admin`
   - Enter your admin API key

2. **Access CRM Dashboard**:
   - Click "CRM" in the navigation
   - Or go directly to `http://localhost:3000/crm/dashboard`

3. **Explore the Features**:
   - `/crm/dashboard` - Overview metrics
   - `/crm/companies` - Manage B2B accounts
   - `/crm/contacts` - Manage contacts
   - `/crm/deals` - View deal pipeline
   - `/crm/projects` - Track projects
   - `/crm/tasks` - Manage tasks

## Troubleshooting

### Database Connection Issues

If you get a database connection error:

1. Make sure PostgreSQL is running:
   ```bash
   # For macOS with Homebrew
   brew services start postgresql

   # For Linux
   sudo service postgresql start
   ```

2. Verify your database exists:
   ```bash
   psql -U postgres -c "CREATE DATABASE revelate_crm;"
   ```

3. Test the connection:
   ```bash
   npx prisma db push
   ```

### Prisma Generate Errors

If `prisma generate` fails:

```bash
# Clear the Prisma cache
rm -rf node_modules/.prisma

# Reinstall
npm install

# Try again
npx prisma generate
```

### Admin Authentication

The CRM uses the same admin authentication as your existing admin panel:
- API Key is stored in localStorage
- Same key works for both `/admin` and `/crm`
- Set in your `.env.local` as `ADMIN_API_KEY`

## Testing the CRM

### 1. Create a Company

```bash
# Go to /crm/companies
# Click "Add Company"
# Fill in: Name, Website, Industry
```

### 2. Add a Contact

```bash
# Go to /crm/contacts
# Click "Add Contact"
# Link to a company
```

### 3. Create a Deal

```bash
# Go to /crm/deals
# You'll see the pipeline board
# Create a deal and drag it through stages
```

### 4. Set Up a Project

```bash
# Go to /crm/projects
# Create a project linked to a company
```

### 5. Add Tasks

```bash
# Go to /crm/tasks
# Create tasks with priorities and due dates
# Link tasks to projects
```

## Development Tips

### View Database in Prisma Studio

```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` to browse your data.

### Reset Database (⚠️ DELETES ALL DATA)

```bash
npx prisma migrate reset
```

### Check Database Schema

```bash
npx prisma db pull
```

## Next Steps

1. **Add Sample Data** - Create test companies, contacts, and deals
2. **Test All Features** - Try creating, editing, and filtering entities
3. **Check Integrations** - Test the conversation → contact linking
4. **Customize** - Adjust the UI colors, add fields, etc.
5. **Deploy** - When ready, deploy to Vercel/production

## Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio
npx prisma studio

# Check TypeScript errors
npm run type-check

# Lint code
npm run lint
```

## API Endpoints

All CRM endpoints require admin authentication headers:
- `X-Admin-Key`: Your admin API key
- `X-Admin-User`: Admin username

Test with curl:
```bash
curl http://localhost:3000/api/crm/dashboard \
  -H "X-Admin-Key: your-api-key" \
  -H "X-Admin-User: admin"
```

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal running `npm run dev` for server errors
3. Verify database connection in `.env.local`
4. Make sure migrations ran successfully
5. Confirm Prisma client was generated

Happy CRM building! 🚀
