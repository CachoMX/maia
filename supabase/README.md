# MAIA SSS - Supabase Database

This directory contains all database-related files for the MAIA Student Support Services application.

## Directory Structure

```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql       # Complete database schema
│   └── 002_verification_queries.sql # Post-deployment verification
├── queries/
│   └── common_queries.sql           # Frequently used queries
└── README.md                        # This file
```

## Quick Start

### 1. Deploy Schema

**Option A: Supabase SQL Editor (RECOMMENDED)**
1. Go to [SQL Editor](https://app.supabase.com/project/bexudrmrspbyhkcqrtse/sql/new)
2. Copy contents of `migrations/001_initial_schema.sql`
3. Paste and click "Run"

**Option B: Python Script**
```bash
export SUPABASE_DB_PASSWORD='your_password'
python scripts/deploy_schema.py
```

### 2. Verify Deployment
1. Open [SQL Editor](https://app.supabase.com/project/bexudrmrspbyhkcqrtse/sql/new)
2. Copy contents of `migrations/002_verification_queries.sql`
3. Run and check all tests pass

### 3. Start Using
- Browse tables: [Table Editor](https://app.supabase.com/project/bexudrmrspbyhkcqrtse/editor)
- Check policies: [RLS Policies](https://app.supabase.com/project/bexudrmrspbyhkcqrtse/auth/policies)
- Use common queries from `queries/common_queries.sql`

## Database Schema

### Core Tables (16)

**User & Student Management**
- `users` - User accounts (SSS staff, teachers, admins)
- `students` - Student information

**Case Management**
- `cases` - Main case tracking
- `interventions` - Tier 1-3 interventions
- `sessions` - Session documentation
- `evaluations` - SNAP and other assessments
- `evaluation_steps` - Evaluation workflow

**Protocols & Processes**
- `protocol_steps` - Bullying/Child Protection/Conflict Resolution
- `parent_meetings` - Parent communication
- `action_plan_items` - Action plan tracking (NEW)
- `referrals` - KID Talk and behavior referrals
- `behavior_incidents` - Incident tracking with restorative process

**Group & Other**
- `group_interventions` - Group-based interventions
- `group_sessions` - Group session tracking
- `files` - File attachments
- `audit_log` - Compliance audit trail

### Critical New Features

**From Wendy's Feedback (Nov 2025)**:
1. **cases.is_urgent** - Flag safeguarding & urgent cases
2. **action_plan_items table** - Track parent meeting follow-ups
3. **behavior_incidents restorative fields** - Track restorative learning
4. **parent_meetings.action_plan** - Structured action plans

## Helper Functions

### get_staff_case_load(staff_id)
Get case load statistics for a staff member.

```sql
SELECT * FROM get_staff_case_load('user_id_here');
```

**Returns**: total_cases, open_cases, tier breakdown, urgent_cases

### get_weekly_action_items()
Get action plan items due within 7 days.

```sql
SELECT * FROM get_weekly_action_items();
```

**Returns**: student_name, description, due_date, days_until_due

### get_tier_distribution_by_grade()
Calculate tier distribution percentages by grade.

```sql
SELECT * FROM get_tier_distribution_by_grade();
```

**Returns**: grade, student counts, tier percentages

## Row Level Security (RLS)

All tables have RLS enabled. Access control:

| Role | Access Level |
|------|-------------|
| **SSS_STAFF** | Full CRUD on all data |
| **TEACHER** | Read own students' cases, create referrals |
| **PRINCIPAL_ADMIN** | Read-only access to all data |
| **PARENT** | No access (future feature) |

## Common Queries

See `queries/common_queries.sql` for examples of:
- Creating cases, interventions, sessions
- Scheduling parent meetings
- Adding action plan items
- Recording behavior incidents
- Marking restorative processes complete
- Generating analytics and reports

## Performance

**40+ Indexes** for optimized queries on:
- Foreign keys
- Status fields
- Date columns
- Boolean flags (is_urgent, is_completed, etc.)

**Triggers** for automatic updated_at timestamps on all tables.

## Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Audit logging for compliance
- ✅ GDPR-compliant data access controls
- ✅ Encrypted at rest and in transit
- ✅ Role-based access control

## Migrations

### 001_initial_schema.sql
Complete database schema including:
- All 16 tables
- 40+ indexes
- 50+ RLS policies
- 3 helper functions
- 14+ triggers

**Status**: Ready to deploy

### 002_verification_queries.sql
Comprehensive verification tests:
- Table existence checks
- RLS validation
- Policy counts
- Index verification
- Function testing

**Usage**: Run after deploying 001_initial_schema.sql

## Troubleshooting

### "Permission denied" errors
- Verify you're using service role key or logged in as SSS_STAFF
- Check RLS policies are configured correctly

### "Relation already exists"
- Tables may already exist - check Table Editor
- Consider adding `IF NOT EXISTS` clauses

### "Foreign key violation"
- Ensure referenced records exist (e.g., auth.users)
- Check proper order of inserts

## Resources

**Supabase Dashboard**:
- Project: https://app.supabase.com/project/bexudrmrspbyhkcqrtse
- SQL Editor: [Link](https://app.supabase.com/project/bexudrmrspbyhkcqrtse/sql)
- Table Editor: [Link](https://app.supabase.com/project/bexudrmrspbyhkcqrtse/editor)
- Policies: [Link](https://app.supabase.com/project/bexudrmrspbyhkcqrtse/auth/policies)

**Documentation**:
- `../DATABASE_DEPLOYMENT_SUMMARY.md` - Complete deployment overview
- `../scripts/DEPLOYMENT_INSTRUCTIONS.md` - Step-by-step guide
- `../ATLAS_SSS_APP_IMPLEMENTATION_ROADMAP.md` - Full spec
- `../MAIA_CLARIFICATION_RESPONSES.md` - Requirements details

## Support

For issues or questions:
1. Check deployment summary and instructions
2. Review common queries for examples
3. Run verification queries to diagnose
4. Contact vixi.agency support

---

**Last Updated**: November 18, 2025
**Database Version**: 1.0.0 (Initial Schema)
**Status**: ✅ Ready for deployment
