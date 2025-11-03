# Admin Panel Setup Guide

## Quick Start

### 1. Set Admin API Key

Add this to your `.env.local` file:

```bash
ADMIN_API_KEY=your-secure-api-key-here
```

Generate a secure random key:
```bash
openssl rand -base64 32
```

### 2. Access Admin Panel

Navigate to: `http://localhost:3000/admin`

Enter your credentials:
- **API Key**: The value you set in `.env.local`
- **Admin User**: Your name/email (for audit logs)

### 3. Manage Content

The admin panel has 4 sections:

#### Services Management
- View all services (active and inactive)
- Create new services
- Edit existing services (name, price, description, category, icon)
- Activate/deactivate services (soft delete)
- Delete services permanently (hard delete - use with caution)

#### Packages Management
- View all packages
- Create new packages with service bundles
- Edit package details
- Configure pricing and timelines
- Activate/deactivate packages

#### Scoping Rules Management
- Create quiz questions (scoping factors)
- Define pricing rules based on user inputs
- Configure dynamic timeline adjustments
- Set rule priority and conditions

#### Audit Logs
- View all admin changes
- Filter by table, user, action, date range
- Track who changed what and when

## Database Migration

Your database already has seeded data from `prisma/seed.ts`:
- 20 services across 6 categories
- 3 packages (RevOps, Cleanup, AI)
- Package-service relationships

To re-seed the database:
```bash
npm run db:seed
```

## API Endpoints

### Public Endpoints (No Auth Required)

GET /api/services
- Returns all active services
- Query params: `category`, `featured`

GET /api/packages
- Returns all active packages
- Query params: `type`, `featured`, `include_services`

GET /api/packages/[id]
- Returns single package with details
- Includes services, scoping factors, and rules

POST /api/calculate-scope
- Calculates price and timeline based on quiz inputs
- Optionally saves quote to database

### Admin Endpoints (Auth Required)

All admin endpoints require headers:
```
X-Admin-Key: your-api-key
X-Admin-User: your-name
```

**Services:**
- GET /api/admin/services
- POST /api/admin/services
- GET /api/admin/services/[id]
- PATCH /api/admin/services/[id]
- DELETE /api/admin/services/[id]

**Packages:**
- GET /api/admin/packages
- POST /api/admin/packages
- GET /api/admin/packages/[id]
- PATCH /api/admin/packages/[id]
- DELETE /api/admin/packages/[id]

**Scoping Factors:**
- GET /api/admin/scoping-factors?packageId=x
- POST /api/admin/scoping-factors
- PATCH /api/admin/scoping-factors/[id]
- DELETE /api/admin/scoping-factors/[id]

**Scoping Rules:**
- GET /api/admin/scoping-rules?packageId=x
- POST /api/admin/scoping-rules
- PATCH /api/admin/scoping-rules/[id]
- DELETE /api/admin/scoping-rules/[id]

**Audit Logs:**
- GET /api/admin/audit-logs?tableName=services&action=update&limit=100

## Security Notes

### Current Setup (Development)
- Simple API key authentication
- API key stored in localStorage
- Fine for development and internal use

### Production Recommendations
1. **Upgrade to Neon Auth** (https://neon.com/docs/neon-auth/quick-start/nextjs)
2. **Or use OAuth** (Google, GitHub, etc.)
3. **Or implement JWT tokens** with refresh mechanism
4. **Never commit API keys** to version control
5. **Use environment variables** for all secrets
6. **Enable HTTPS** in production
7. **Add rate limiting** to admin endpoints
8. **Implement IP whitelist** for extra security

## Next Steps

1. **Customize Services**: Add your specific service offerings
2. **Create Packages**: Bundle services into packages
3. **Build Quiz**: Add scoping factors and rules for dynamic pricing
4. **Test Workflow**: Create a quote end-to-end
5. **Deploy**: Push to production with proper authentication

## Troubleshooting

### "Admin API key not found"
- Check `.env.local` has `ADMIN_API_KEY` set
- Restart dev server after adding env variables
- Clear browser localStorage and re-login

### "Failed to fetch services"
- Check database connection in `.env.local`
- Run `npm run db:generate` to generate Prisma client
- Check network tab for specific error messages

### "Prisma Client not initialized"
- Run `npm run db:generate`
- Restart dev server

### Database errors
- Verify `POSTGRES_PRISMA_URL` in `.env.local`
- Check Neon database is running
- Run `npx prisma db push` to sync schema

## Support

For issues or questions:
1. Check the console for error messages
2. Review audit logs for recent changes
3. Check Prisma logs for database issues
4. Verify environment variables are set correctly
