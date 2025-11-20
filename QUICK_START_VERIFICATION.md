# MAIA SSS - QUICK START VERIFICATION GUIDE

**5-Minute Database Verification**

---

## STEP-BY-STEP INSTRUCTIONS

### Step 1: Verify Wendy's User (30 seconds)

1. Go to: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/sql/new

2. Run this query:
```sql
SELECT id, email, first_name, last_name, role
FROM users
WHERE email = 'wendy.aragon@atlas.es';
```

3. Expected result: 1 row with role = 'SSS_STAFF'

**If no result:** Create user first (see CREATE_TEST_USER.sql)

---

### Step 2: Run Database Verification (2 minutes)

1. Open: `c:\Projects\maia\database-verification.sql`

2. Copy entire file contents (Ctrl+A, Ctrl+C)

3. Paste into Supabase SQL Editor (Ctrl+V)

4. Click "Run" or press Ctrl+Enter

5. Wait for results (~30 seconds)

6. Look for this at the bottom:
```
DATABASE IS PRODUCTION READY
All critical checks passed!
```

**If any FAIL:** See troubleshooting in WEEK2_VERIFICATION_REPORT.md

---

### Step 3: Create Test Data (1 minute)

1. Open: `c:\Projects\maia\test-data.sql`

2. Copy entire file contents

3. Paste into SQL Editor

4. Click "Run"

5. Wait for completion (~20 seconds)

6. Look for verification results:
```
Students Created: 5
Cases Created: 10 total
VERIFICATION COMPLETE!
```

**Expected:**
- 5 students (PreK, K1, G3, G5, MS)
- 10 cases (2 urgent, mixed types)
- 3 interventions
- 2 parent meetings
- etc.

---

### Step 4: Test RLS Security (1 minute)

1. Open: `c:\Projects\maia\rls-policy-tests.sql`

2. Copy entire file contents

3. Paste into SQL Editor

4. Click "Run"

5. Wait for results (~15 seconds)

6. Look for:
```
RLS SECURITY POLICIES VERIFIED
All automated security checks passed!
```

**Critical:** All sensitive tables should show "ENABLED"

---

### Step 5: Quick Data Check (30 seconds)

Run these quick queries to verify test data:

```sql
-- Check Wendy's caseload
SELECT * FROM get_staff_case_load(
  (SELECT id FROM users WHERE email = 'wendy.aragon@atlas.es')
);

-- Expected: 9 open cases, 2 urgent

-- View urgent cases
SELECT
  s.name as student,
  c.case_type,
  c.tier,
  c.reason_for_referral
FROM cases c
JOIN students s ON s.id = c.student_id
WHERE c.is_urgent = true AND c.status = 'OPEN';

-- Expected: 2 rows (Sofia and Lucas)

-- View test students
SELECT name, grade, student_id
FROM students
WHERE student_id LIKE 'TEST-%'
ORDER BY grade;

-- Expected: 5 students
```

---

## SUCCESS CRITERIA

You should see:

- [ ] Wendy user exists with SSS_STAFF role
- [ ] Database verification: ALL PASS
- [ ] 16 tables exist
- [ ] RLS enabled on all tables
- [ ] 50+ RLS policies
- [ ] 40+ indexes
- [ ] 5 test students created
- [ ] 10 test cases created
- [ ] 2 urgent cases
- [ ] RLS security tests: ALL PASS
- [ ] No FAIL or ERROR messages

---

## IF SOMETHING FAILS

### Wendy User Missing
**Fix:** Run CREATE_TEST_USER.sql
**Time:** 2 minutes

### Schema Issues
**Fix:** Re-run 001_initial_schema.sql from supabase/migrations/
**Time:** 3 minutes

### Test Data Errors
**Fix:** Clean up and re-run
```sql
DELETE FROM students WHERE student_id LIKE 'TEST-%';
-- Then re-run test-data.sql
```

### RLS Issues
**Fix:** Re-run 001_initial_schema.sql (includes RLS policies)

---

## WHAT'S NEXT?

After successful verification:

1. **Review Test Data**
   - Browse cases in SQL editor
   - Check data looks realistic
   - Verify relationships work

2. **Test Helper Functions**
   - get_staff_case_load()
   - get_weekly_action_items()
   - get_tier_distribution_by_grade()

3. **Plan Frontend Development**
   - Review data structure
   - Plan UI components
   - Design user workflows

4. **Begin Week 3**
   - Setup Next.js project
   - Configure Supabase client
   - Build dashboard

---

## QUICK REFERENCE

**Supabase SQL Editor:**
https://app.supabase.com/project/bexudrmrspbyhkcqrtse/sql/new

**Test User:**
- Email: wendy.aragon@atlas.es
- Role: SSS_STAFF

**Test Data Prefix:**
All test students have student_id starting with 'TEST-'

**Helper Functions:**
- `get_staff_case_load(user_id)` - Get caseload stats
- `get_weekly_action_items()` - Get upcoming action items
- `get_tier_distribution_by_grade()` - Get tier analytics

---

## TIME ESTIMATE

- Total time: 5-10 minutes
- Schema verification: 2 min
- Test data creation: 1 min
- RLS testing: 1 min
- Manual checks: 1 min

---

## SUPPORT

**Issues?** Check WEEK2_VERIFICATION_REPORT.md for detailed troubleshooting

**Questions?** Review:
- supabase/queries/common_queries.sql
- supabase/migrations/001_initial_schema.sql
- ATLAS_SSS_APP_SPECIFICATION.md

---

**Last Updated:** November 18, 2025
**Status:** Ready for Testing
