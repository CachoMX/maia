# Deployment Guide
## Maia - Student Support Services Platform

**For:** Carlos (Production Deployment)
**Version:** 1.0 (Week 2)
**Last Updated:** November 18, 2025
**Target Platform:** Vercel + Supabase

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment](#vercel-deployment)
3. [Environment Variables Configuration](#environment-variables-configuration)
4. [Database Migration Strategy](#database-migration-strategy)
5. [Custom Domain Setup](#custom-domain-setup)
6. [SSL Certificate](#ssl-certificate)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Backup and Recovery](#backup-and-recovery)
10. [Rollback Procedures](#rollback-procedures)
11. [Performance Optimization](#performance-optimization)
12. [Security Checklist](#security-checklist)

---

## Pre-Deployment Checklist

Before deploying to production, ensure all these items are complete:

### Code Quality
- [ ] All TypeScript files compile without errors: `npm run type-check`
- [ ] Linting passes with no errors: `npm run lint`
- [ ] Production build succeeds locally: `npm run build`
- [ ] All console.log statements removed (or converted to proper logging)
- [ ] No commented-out code blocks
- [ ] All TODO comments resolved or documented

### Testing
- [ ] Manual testing on all major features complete
- [ ] Login/authentication tested
- [ ] Case CRUD operations tested
- [ ] File upload tested
- [ ] RLS policies verified
- [ ] Tested in Chrome, Firefox, Safari
- [ ] Mobile responsive design verified

### Security
- [ ] All sensitive data in environment variables (not hardcoded)
- [ ] .env.local is in .gitignore (never committed)
- [ ] API routes protected with authentication
- [ ] RLS policies enabled on all Supabase tables
- [ ] CORS configured correctly
- [ ] Rate limiting considered (future enhancement)

### Database
- [ ] All migrations applied to production Supabase
- [ ] RLS policies deployed
- [ ] Database functions created
- [ ] Indexes created for performance
- [ ] Backup strategy confirmed

### Documentation
- [ ] README.md updated with current project status
- [ ] API_DOCUMENTATION.md reflects all endpoints
- [ ] CHANGELOG.md updated with latest version
- [ ] Deployment notes documented

---

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended for First Deploy)

**Step 1: Sign in to Vercel**
1. Go to: https://vercel.com
2. Sign in with your GitHub account (or create account)

**Step 2: Import Project**
1. Click "Add New Project"
2. Select "Import Git Repository"
3. Choose your GitHub repository (maia)
4. Click "Import"

**Step 3: Configure Project**
- **Framework Preset:** Next.js (should auto-detect)
- **Root Directory:** `./` (leave as default)
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install`

**Step 4: Add Environment Variables**
(See next section for details)

Don't add them yet - click "Deploy" to continue setup.

**Step 5: Deploy**
Click "Deploy" button

Vercel will:
1. Clone your repository
2. Install dependencies
3. Build the project
4. Deploy to a temporary URL

**Expected Duration:** 2-3 minutes

**Step 6: View Deployment**
Once complete, you'll see:
```
✓ Build completed in 1m 23s
✓ Deployment ready at: https://maia-abc123.vercel.app
```

Click the URL to view your deployed app.

---

### Option 2: Deploy via Vercel CLI

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Login to Vercel**
```bash
vercel login
```

**Step 3: Deploy from project root**
```bash
cd ~/Projects/maia
vercel
```

Follow the prompts:
```
? Set up and deploy "~/Projects/maia"? [Y/n] y
? Which scope do you want to deploy to? Your Name
? Link to existing project? [y/N] n
? What's your project's name? maia
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

**Step 4: Deploy to production**
```bash
vercel --prod
```

---

## Environment Variables Configuration

### Step 1: Access Vercel Environment Variables

**Via Dashboard:**
1. Go to: https://vercel.com/dashboard
2. Select your project (maia)
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar

**Via CLI:**
```bash
vercel env add VARIABLE_NAME production
```

### Step 2: Add Production Environment Variables

Add each of the following variables:

**Supabase Configuration**
```
NEXT_PUBLIC_SUPABASE_URL=https://bexudrmrspbyhkcqrtse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

**Google OAuth**
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Site Configuration**
```
NEXT_PUBLIC_SITE_URL=https://maia.atlas.es
# Or https://your-custom-domain.com
```

**Anthropic Claude API (Week 7+)**
```
ANTHROPIC_API_KEY=your_claude_api_key
```

### Step 3: Set Environment for Each Variable

For each variable, select which environments it applies to:
- [x] Production
- [x] Preview (for PR deployments)
- [ ] Development (uses .env.local instead)

### Step 4: Verify Variables

After adding all variables:
1. Go to Settings → Environment Variables
2. Verify all 6+ variables are listed
3. Check that Production is selected for each

### Step 5: Redeploy

Environment changes require redeployment:

**Via Dashboard:**
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Check "Use existing Build Cache"
5. Click "Redeploy"

**Via CLI:**
```bash
vercel --prod
```

---

## Database Migration Strategy

### Production Database Setup

**Step 1: Verify Supabase Production Instance**
1. Ensure you're using the production Supabase project
2. URL: https://bexudrmrspbyhkcqrtse.supabase.co
3. Check project settings to confirm it's the production instance

**Step 2: Apply Database Migrations**

**Option A: Via Supabase Dashboard (Recommended)**
1. Go to: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/sql/new
2. Open `/supabase/migrations/001_initial_schema.sql`
3. Copy entire file contents
4. Paste into SQL Editor
5. Click "Run"
6. Verify success message

**Option B: Via Supabase CLI**
```bash
# Link to production project
supabase link --project-ref bexudrmrspbyhkcqrtse

# Push migrations
supabase db push

# Verify migrations
supabase db diff
```

**Step 3: Run Verification Queries**
1. Open `/supabase/migrations/002_verification_queries.sql`
2. Run each query to verify:
   - 16 tables created
   - 50+ RLS policies active
   - 40+ indexes created
   - 3 database functions working

**Step 4: Create Production Users**

Create initial SSS staff accounts:

```sql
-- Wendy Aragón
INSERT INTO public.users (id, email, full_name, role, created_at)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'wendy.aragon@atlas.es' LIMIT 1),
  'wendy.aragon@atlas.es',
  'Wendy Aragón',
  'SSS_STAFF',
  NOW()
);

-- Repeat for Lindsey and Jonica
```

**Step 5: Backup Database**
```bash
# Via Supabase CLI
supabase db dump -f backup-pre-launch.sql

# Or via Supabase Dashboard
# Settings → Database → Create Backup
```

---

## Custom Domain Setup

### Option 1: Use Vercel Domain

Vercel provides:
- `maia-abc123.vercel.app` (default)
- Or `maia.vercel.app` (if available)

**To use Vercel domain:**
1. No additional setup needed
2. Already has SSL certificate
3. Ready to use immediately

---

### Option 2: Use Custom Domain (maia.atlas.es)

**Prerequisites:**
- Access to ATLAS domain registrar (or DNS provider)
- Domain: `maia.atlas.es` (or your chosen subdomain)

**Step 1: Add Domain in Vercel**
1. Go to: https://vercel.com/dashboard
2. Select project: maia
3. Click "Settings" → "Domains"
4. Click "Add"
5. Enter domain: `maia.atlas.es`
6. Click "Add"

**Step 2: Configure DNS**

Vercel will show DNS records you need to add. There are two options:

**Option A: CNAME (Recommended for Subdomains)**
Add this CNAME record in your DNS provider:

```
Type: CNAME
Name: maia
Value: cname.vercel-dns.com
TTL: 3600 (or auto)
```

**Option B: A Record (For Root Domains)**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Step 3: Update DNS at Your Provider**

If ATLAS uses:
- **Cloudflare:** Go to DNS settings, add CNAME
- **Google Domains:** Go to DNS, add CNAME
- **Other:** Contact IT administrator

**Step 4: Verify DNS Propagation**

Wait 5-60 minutes for DNS to propagate.

Check status:
```bash
# Check if DNS is resolving
nslookup maia.atlas.es

# Or use online tool
# https://dnschecker.org/
```

**Step 5: Verify in Vercel**
1. Go to Settings → Domains in Vercel
2. Your domain should show: ✓ Valid Configuration
3. If not, click "Refresh" and wait

**Step 6: Set as Primary Domain**
1. In Vercel Domains settings
2. Find `maia.atlas.es`
3. Click "..." → "Mark as Primary"
4. All traffic will redirect to this domain

---

## SSL Certificate

### Automatic SSL (Default)

Vercel automatically provides SSL certificates via Let's Encrypt.

**Verification:**
1. Visit your domain: https://maia.atlas.es
2. Check for padlock icon in browser
3. Should show "Connection is secure"

**No action needed** - SSL is automatic!

---

### Custom SSL Certificate (Optional)

If ATLAS requires a specific SSL certificate:

**Step 1: Get Certificate**
- Purchase or generate SSL certificate
- You'll need:
  - Certificate (.crt file)
  - Private Key (.key file)
  - CA Bundle (.ca-bundle file)

**Step 2: Upload to Vercel**
1. Vercel Dashboard → Settings → Domains
2. Click domain name
3. Click "SSL Certificate" tab
4. Click "Upload Custom Certificate"
5. Paste certificate, key, and bundle
6. Click "Save"

**Note:** Custom SSL is rarely needed. Use automatic SSL unless required.

---

## Post-Deployment Verification

After deployment, verify everything works:

### Step 1: Health Check

**Visit the site:**
https://maia.atlas.es (or your domain)

**Expected:** Maia login page loads

**Checklist:**
- [ ] Page loads (no 404 or 500 errors)
- [ ] "Sign in with Google" button appears
- [ ] No console errors (F12 to check)
- [ ] Page loads in under 3 seconds

---

### Step 2: Authentication Test

1. Click "Sign in with Google"
2. Log in with ATLAS email
3. Should redirect to dashboard

**Expected:** Dashboard loads with no errors

**Checklist:**
- [ ] Login redirects to Google
- [ ] Can select ATLAS account
- [ ] Redirects back to Maia
- [ ] Dashboard appears
- [ ] User info displays correctly

**If login fails:**
- Check Google OAuth redirect URI: `https://maia.atlas.es/auth/callback`
- Verify Google Client ID/Secret in environment variables
- Check browser console for errors

---

### Step 3: Database Connection Test

**From Dashboard:**
1. Should see your name (if user exists in database)
2. Dashboard widgets should load (may be empty)

**Via API:**
```bash
# Test API endpoint (should return 401 if not logged in)
curl https://maia.atlas.es/api/cases

# Should return:
# {"success": false, "error": {"code": "AUTH_REQUIRED", "message": "Authentication required"}}
```

**Checklist:**
- [ ] API responds (not 500 error)
- [ ] Database connection works
- [ ] RLS policies enforced (gets 401 when not authenticated)

---

### Step 4: File Upload Test (Week 2+)

If file upload is deployed:
1. Log in as SSS staff
2. Create a test case
3. Try uploading a file
4. Verify file appears and can be downloaded

---

### Step 5: Performance Test

**Check load times:**
```bash
# Use PageSpeed Insights
https://pagespeed.web.dev/

# Or Lighthouse in Chrome DevTools (F12)
# Run audit for Performance
```

**Target Metrics:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 200ms
- Cumulative Layout Shift: < 0.1

---

### Step 6: Mobile Test

**Test on actual mobile devices:**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)

**Or use Chrome DevTools:**
1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. Test at 375px (mobile) and 768px (tablet)
3. Verify responsive layout works

---

## Monitoring and Logging

### Vercel Analytics

**Enable Vercel Analytics:**
1. Vercel Dashboard → Your Project → Analytics
2. Click "Enable Analytics"
3. Free tier includes:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

**View Analytics:**
https://vercel.com/dashboard/analytics

---

### Error Tracking (Future Enhancement)

Consider adding:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **PostHog** - Product analytics

**To add Sentry:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

### Supabase Logs

**View Database Logs:**
1. Go to: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/logs/explorer
2. Select log type:
   - Database logs
   - API logs
   - Auth logs
3. Filter by time range
4. Search for errors

**Monitor Queries:**
```sql
-- View slow queries
SELECT * FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

### Uptime Monitoring

**Use Vercel Status Page:**
- https://vercel-status.com/

**Or set up external monitoring:**
- **UptimeRobot** (free, 50 monitors)
- **Pingdom**
- **Better Uptime**

**Monitor URLs:**
- https://maia.atlas.es (homepage)
- https://maia.atlas.es/api/health (health check endpoint)

---

## Backup and Recovery

### Database Backups

**Automated Backups (Supabase Pro):**
- Daily automatic backups
- Retained for 7 days
- Point-in-time recovery

**Manual Backups:**

**Option 1: Supabase Dashboard**
1. Go to: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/settings/database
2. Scroll to "Database Backups"
3. Click "Create Backup"
4. Download backup file

**Option 2: Via Supabase CLI**
```bash
# Backup entire database
supabase db dump -f backup-$(date +%Y%m%d).sql

# Backup specific schema
supabase db dump -f backup-public-$(date +%Y%m%d).sql --schema public
```

**Backup Schedule:**
- **Before major updates:** Manual backup
- **Weekly:** Automated (Supabase)
- **Before migration:** Manual backup

---

### Code Backups

**Git Repository:**
All code is version-controlled in Git.

**Ensure backups:**
- [ ] Code pushed to GitHub
- [ ] Protected branches enabled (main/production)
- [ ] Tags created for releases

**Create release tag:**
```bash
git tag -a v1.0.0 -m "Week 2 Production Release"
git push origin v1.0.0
```

---

### Environment Variables Backup

**Save environment variables securely:**

```bash
# Export from Vercel
vercel env pull .env.production

# Store securely (NOT in Git!)
# Use password manager or encrypted storage
```

**Document variables:**
Create a secure document listing:
- Variable names
- Purpose
- Where to get values
- Who has access

---

## Rollback Procedures

If deployment causes issues, rollback to previous version:

### Option 1: Rollback via Vercel Dashboard

**Step 1: View Deployments**
1. Go to: https://vercel.com/dashboard
2. Select project: maia
3. Click "Deployments" tab

**Step 2: Find Previous Working Deployment**
1. Look for deployment before the issue
2. Should have green "Ready" status
3. Note the deployment URL

**Step 3: Promote to Production**
1. Click "..." on the working deployment
2. Click "Promote to Production"
3. Confirm

**Duration:** Instant (no rebuild needed)

---

### Option 2: Rollback via Git

**Step 1: Identify last working commit**
```bash
git log --oneline
```

**Step 2: Revert to that commit**
```bash
# Option A: Create revert commit (recommended)
git revert <bad-commit-hash>
git push origin main

# Option B: Hard reset (destructive!)
git reset --hard <good-commit-hash>
git push origin main --force
```

**Step 3: Vercel auto-deploys**
Vercel will automatically deploy the reverted code.

---

### Option 3: Rollback Database

**If database migration caused issues:**

**Step 1: Stop Application**
1. In Vercel, set app to maintenance mode (if available)
2. Or delete the broken deployment

**Step 2: Restore Database Backup**

```bash
# Restore from backup file
supabase db reset
psql -h db.bexudrmrspbyhkcqrtse.supabase.co -U postgres -d postgres -f backup-20251118.sql
```

**Or via Supabase Dashboard:**
1. Settings → Database → Backups
2. Select backup to restore
3. Click "Restore"

**Step 3: Redeploy Application**
Deploy previous working version of code.

---

## Performance Optimization

### Edge Caching

Vercel provides automatic edge caching.

**Enable Static Page Caching:**

In `next.config.mjs`:
```javascript
export default {
  // ...other config

  // Cache static pages for 60 seconds
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=30',
          },
        ],
      },
    ];
  },
};
```

---

### Image Optimization

Use Next.js Image component:

```javascript
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="Maia Logo"
  priority // for above-the-fold images
/>
```

---

### Database Query Optimization

**Use indexes for frequent queries:**
Already created in migration, but verify:

```sql
-- Check indexes exist
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

**Use database functions for complex queries:**
Example: `get_staff_case_load()`

---

### API Route Optimization

**Use React Query for client-side caching:**

```javascript
const { data } = useQuery({
  queryKey: ['cases'],
  queryFn: fetchCases,
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});
```

**Implement pagination:**
Don't load all 200 cases at once - use limit/offset.

---

## Security Checklist

Before going live, verify all security measures:

### Application Security
- [ ] All API routes require authentication
- [ ] RLS policies enabled on all Supabase tables
- [ ] Input validation on all forms
- [ ] SQL injection prevention (via Supabase client)
- [ ] XSS prevention (React auto-escapes)
- [ ] CSRF tokens (built into Next.js)
- [ ] Secure cookies (httpOnly, secure, sameSite)

### Authentication Security
- [ ] Google OAuth configured correctly
- [ ] Redirect URIs whitelisted
- [ ] Session expiration set (default: 24 hours)
- [ ] Logout functionality works
- [ ] Protected routes redirect to login

### Data Security
- [ ] Environment variables not exposed to client
- [ ] Sensitive data encrypted in database
- [ ] File uploads validated (type, size)
- [ ] No secrets in Git repository
- [ ] Audit log captures all data changes

### Infrastructure Security
- [ ] HTTPS enabled (via Vercel SSL)
- [ ] Database not publicly accessible
- [ ] Supabase RLS enforced
- [ ] Regular backups configured
- [ ] Monitoring and alerts set up

### Compliance
- [ ] GDPR compliant (data access controls)
- [ ] Spanish education law compliance
- [ ] Child safeguarding protocols
- [ ] Audit trail for legal compliance
- [ ] Data retention policy documented

---

## Deployment Checklist Summary

**Before Deployment:**
- [ ] Code quality checks pass
- [ ] Manual testing complete
- [ ] Security verified
- [ ] Database backed up
- [ ] Environment variables documented

**During Deployment:**
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Apply database migrations
- [ ] Set up custom domain (if needed)
- [ ] Verify SSL certificate

**After Deployment:**
- [ ] Health check passed
- [ ] Authentication works
- [ ] Database connection verified
- [ ] Performance metrics acceptable
- [ ] Mobile responsive
- [ ] Monitoring enabled
- [ ] Backup strategy confirmed

**Go Live:**
- [ ] Notify SSS team (Wendy, Lindsey, Jonica)
- [ ] Share production URL
- [ ] Provide training session
- [ ] Monitor for issues first 24 hours
- [ ] Collect feedback

---

## Maintenance Schedule

**Daily:**
- Monitor error logs
- Check uptime status

**Weekly:**
- Review analytics
- Check database performance
- Verify backups

**Monthly:**
- Review security logs
- Update dependencies (if needed)
- Performance audit

**Quarterly:**
- Security audit
- Disaster recovery test
- User feedback review

---

## Support After Deployment

**Production Issues:**
- Check Vercel logs: https://vercel.com/dashboard/logs
- Check Supabase logs: https://app.supabase.com/.../logs
- Contact Carlos immediately for critical issues

**User Support:**
- Wendy leads SSS team training
- User questions → USER_GUIDE.md
- Bug reports → GitHub Issues (or ticketing system)

---

**Deployment Complete!**

Maia is now live and ready to help the ATLAS SSS team support students more effectively.

---

**Document Version:** 1.0
**Last Updated:** November 18, 2025
**Prepared by:** DocumentationAgent
**For:** Carlos (Developer) and ATLAS IT Team
