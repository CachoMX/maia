# QA Manual Test Checklist
## Maia SSS Application - Comprehensive Testing

**Tester:** QATestingAgent
**Date:** November 18, 2025
**Application Version:** 1.0.0
**Environment:** Development

---

## Test Summary

| Category | Total Tests | Passed | Failed | N/A |
|----------|------------|--------|--------|-----|
| **Case Detail Page** | 8 | | | |
| **Navigation** | 8 | | | |
| **Page Loading** | 8 | | | |
| **Filters** | 6 | | | |
| **CRUD Operations** | 8 | | | |
| **Language Check** | 7 | | | |
| **UI/UX** | 10 | | | |
| **Authentication** | 5 | | | |
| **TOTAL** | **60** | | | |

---

## 1. CASE DETAIL PAGE - 8 BUTTON TESTS

### Test Environment
- Navigate to: `/cases/1` (or any case detail page)
- Ensure logged in as SSS Staff member

| # | Test Case | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 1.1 | Click "Edit Case" button | Opens edit modal/form for case | ☐ PASS ☐ FAIL | |
| 1.2 | Click "Change Status" button | Opens status change dialog with options (OPEN, ON_HOLD, CLOSED, REFERRED_OUT) | ☐ PASS ☐ FAIL | |
| 1.3 | Click "Reassign Case Manager" button | Opens dialog to select new case manager | ☐ PASS ☐ FAIL | |
| 1.4 | Click "Close Case" button | Opens case closure form with reason field | ☐ PASS ☐ FAIL | |
| 1.5 | Click "Add Intervention" button (in Interventions tab) | Opens new intervention form | ☐ PASS ☐ FAIL | |
| 1.6 | Click "Add Session" button (in Sessions tab) | Opens new session documentation form | ☐ PASS ☐ FAIL | |
| 1.7 | Click "Schedule Meeting" button (in Meetings tab) | Opens meeting scheduling form | ☐ PASS ☐ FAIL | |
| 1.8 | Click "Upload File" button (in Files tab) | Opens file upload dialog | ☐ PASS ☐ FAIL | |

**Notes:**
- All buttons should be clearly visible
- All buttons should be in ENGLISH (no Spanish)
- Buttons should have appropriate icons
- Buttons should show hover effects

---

## 2. NAVIGATION TESTS

### Desktop Navigation (Sidebar)

| # | Test Case | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 2.1 | Click "Dashboard" link in sidebar | Navigates to `/dashboard` | ☐ PASS ☐ FAIL | |
| 2.2 | Click "Cases" link in sidebar | Navigates to `/cases` | ☐ PASS ☐ FAIL | |
| 2.3 | Click "Students" link in sidebar | Navigates to `/students` | ☐ PASS ☐ FAIL | |
| 2.4 | Click "Interventions" link in sidebar | Navigates to `/interventions` | ☐ PASS ☐ FAIL | |
| 2.5 | Click "Meetings" link in sidebar | Navigates to `/meetings` | ☐ PASS ☐ FAIL | |
| 2.6 | Click "Analytics" link in sidebar | Navigates to `/analytics` | ☐ PASS ☐ FAIL | |

### Mobile Navigation

| # | Test Case | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 2.7 | Click mobile menu toggle button | Opens mobile navigation menu | ☐ PASS ☐ FAIL | Test on mobile/narrow viewport |
| 2.8 | Click breadcrumb link on case detail page | Navigates back to Cases list | ☐ PASS ☐ FAIL | |

**Notes:**
- Test on both desktop (1920px) and mobile (375px) viewports
- Active link should be highlighted
- Mobile menu should overlay content

---

## 3. PAGE LOADING TESTS

| # | Page | URL | Expected Content | Status | Load Time | Notes |
|---|------|-----|-----------------|--------|-----------|-------|
| 3.1 | Dashboard | `/dashboard` | Welcome message, stats, urgent cases, my cases | ☐ PASS ☐ FAIL | ___ ms | |
| 3.2 | Cases | `/cases` | Case list, filters, search bar, "Create New Case" button | ☐ PASS ☐ FAIL | ___ ms | |
| 3.3 | Students | `/students` | Student list (placeholder) | ☐ PASS ☐ FAIL | ___ ms | |
| 3.4 | Interventions | `/interventions` | Interventions list (placeholder) | ☐ PASS ☐ FAIL | ___ ms | |
| 3.5 | Meetings | `/meetings` | Meetings calendar/list (placeholder) | ☐ PASS ☐ FAIL | ___ ms | |
| 3.6 | Analytics | `/analytics` | Charts and statistics (placeholder) | ☐ PASS ☐ FAIL | ___ ms | |
| 3.7 | Case Detail | `/cases/1` | Case info, tabs, action buttons | ☐ PASS ☐ FAIL | ___ ms | |
| 3.8 | New Case | `/cases/new` | Case creation form | ☐ PASS ☐ FAIL | ___ ms | |

**Performance Criteria:**
- All pages should load in < 3 seconds
- No JavaScript errors in console
- No 404 errors
- All images/icons load correctly

---

## 4. FILTER FUNCTIONALITY TESTS

### Test on Cases Page (`/cases`)

| # | Filter Test | Steps | Expected Result | Status | Notes |
|---|------------|-------|----------------|--------|-------|
| 4.1 | Status Filter | Select "OPEN" from status dropdown | Shows only OPEN cases | ☐ PASS ☐ FAIL | |
| 4.2 | Status Filter | Select "CLOSED" from status dropdown | Shows only CLOSED cases | ☐ PASS ☐ FAIL | |
| 4.3 | Tier Filter | Select "Tier 2" from tier dropdown | Shows only Tier 2 cases | ☐ PASS ☐ FAIL | |
| 4.4 | Case Type Filter | Select "ACADEMIC_SUPPORT" | Shows only academic support cases | ☐ PASS ☐ FAIL | |
| 4.5 | Urgent Filter | Check "Urgent Only" checkbox | Shows only urgent cases (red border) | ☐ PASS ☐ FAIL | |
| 4.6 | Search Filter | Type student name in search box | Filters cases by student name | ☐ PASS ☐ FAIL | |

**Multiple Filter Test:**
| 4.7 | Combined Filters | Select Status=OPEN, Tier=2, Urgent=true | Shows only OPEN, Tier 2, Urgent cases | ☐ PASS ☐ FAIL | |

---

## 5. CRUD OPERATIONS TESTS

### 5A. CREATE Operations

| # | Create Operation | Steps | Expected Result | Status | Notes |
|---|-----------------|-------|----------------|--------|-------|
| 5.1 | Create New Case | Click "Create New Case" → Fill form → Submit | New case appears in case list | ☐ PASS ☐ FAIL | |
| 5.2 | Create New Student | Navigate to Students → Click "Add Student" → Fill form → Submit | New student appears in student list | ☐ PASS ☐ FAIL | Currently placeholder |
| 5.3 | Create New Intervention | On case detail → Interventions tab → "Add Intervention" → Submit | New intervention appears in case interventions | ☐ PASS ☐ FAIL | Currently placeholder |
| 5.4 | Schedule New Meeting | On case detail → Meetings tab → "Schedule Meeting" → Submit | New meeting appears in meetings list | ☐ PASS ☐ FAIL | Currently placeholder |

### 5B. READ Operations

| # | Read Operation | Steps | Expected Result | Status | Notes |
|---|---------------|-------|----------------|--------|-------|
| 5.5 | View Case Details | Click on case in list | Shows complete case information, all tabs | ☐ PASS ☐ FAIL | |
| 5.6 | View Student Profile | Click on student name | Shows student details | ☐ PASS ☐ FAIL | Currently placeholder |

### 5C. UPDATE Operations

| # | Update Operation | Steps | Expected Result | Status | Notes |
|---|-----------------|-------|----------------|--------|-------|
| 5.7 | Edit Case | Case detail → "Edit Case" → Modify fields → Save | Changes are saved and displayed | ☐ PASS ☐ FAIL | Currently placeholder |
| 5.8 | Change Case Status | Case detail → "Change Status" → Select new status → Confirm | Status badge updates | ☐ PASS ☐ FAIL | Currently placeholder |

### 5D. DELETE Operations

| # | Delete Operation | Steps | Expected Result | Status | Notes |
|---|-----------------|-------|----------------|--------|-------|
| 5.9 | Close Case | Case detail → "Close Case" → Enter reason → Confirm | Case status changes to CLOSED | ☐ PASS ☐ FAIL | Currently placeholder |

---

## 6. LANGUAGE CHECK - NO SPANISH TEXT

**Critical Requirement: ALL UI text must be in ENGLISH**

### Pages to Check

| # | Page/Component | Spanish Words to Check For | Status | Found Issues |
|---|---------------|----------------------------|--------|-------------|
| 6.1 | Dashboard Welcome Banner | ❌ Bienvenida, Sistema, Ahora, con datos, tiempo real | ☐ PASS ☐ FAIL | |
| 6.2 | Cases Page | ❌ Casos, Estudiante, Gestionar | ☐ PASS ☐ FAIL | |
| 6.3 | Students Page | ❌ Estudiantes, Perfil | ☐ PASS ☐ FAIL | |
| 6.4 | Interventions Page | ❌ Intervenciones, Programas | ☐ PASS ☐ FAIL | |
| 6.5 | Meetings Page | ❌ Reuniones, Agendar | ☐ PASS ☐ FAIL | |
| 6.6 | Analytics Page | ❌ Análisis, Estadísticas, Avanzados | ☐ PASS ☐ FAIL | |
| 6.7 | Navigation Menu | ❌ Inicio, Configuración | ☐ PASS ☐ FAIL | |

**Expected English Text:**
- ✅ "Welcome" (not "Bienvenida")
- ✅ "Student Support Services Tracking System" (not "Sistema de Seguimiento")
- ✅ "Now with real-time data and advanced analytics" (not "Ahora con datos en tiempo real")
- ✅ All navigation items in English
- ✅ All buttons in English
- ✅ All form labels in English

---

## 7. UI/UX QUALITY TESTS

| # | UI Element | Test | Expected Result | Status | Notes |
|---|-----------|------|----------------|--------|-------|
| 7.1 | Color Scheme | Check primary colors | Blue (#0066CC), Red for urgent, Green for success | ☐ PASS ☐ FAIL | |
| 7.2 | Typography | Check font consistency | Clear, readable fonts throughout | ☐ PASS ☐ FAIL | |
| 7.3 | Responsive Design | Test on mobile (375px) | All elements stack properly, no overflow | ☐ PASS ☐ FAIL | |
| 7.4 | Responsive Design | Test on tablet (768px) | Layout adapts appropriately | ☐ PASS ☐ FAIL | |
| 7.5 | Responsive Design | Test on desktop (1920px) | Sidebar visible, content centered | ☐ PASS ☐ FAIL | |
| 7.6 | Icons | Check all icons load | All emoji/icons visible | ☐ PASS ☐ FAIL | |
| 7.7 | Badges | Check status badges | Color-coded correctly (green=open, gray=closed, etc.) | ☐ PASS ☐ FAIL | |
| 7.8 | Buttons | Check button hover states | All buttons show hover effect | ☐ PASS ☐ FAIL | |
| 7.9 | Loading States | Check loading indicators | Shows loading state when fetching data | ☐ PASS ☐ FAIL | |
| 7.10 | Error States | Check error messages | Clear, helpful error messages | ☐ PASS ☐ FAIL | |

---

## 8. AUTHENTICATION & SECURITY TESTS

| # | Test Case | Steps | Expected Result | Status | Notes |
|---|-----------|-------|----------------|--------|-------|
| 8.1 | Access Dashboard without login | Navigate to `/dashboard` while logged out | Redirects to `/login` | ☐ PASS ☐ FAIL | |
| 8.2 | Login with valid credentials | Enter valid email/password → Submit | Logs in, redirects to dashboard | ☐ PASS ☐ FAIL | |
| 8.3 | Login with invalid credentials | Enter invalid email/password → Submit | Shows error message | ☐ PASS ☐ FAIL | |
| 8.4 | Logout | Click user menu → Logout | Logs out, redirects to login page | ☐ PASS ☐ FAIL | |
| 8.5 | Session persistence | Refresh page while logged in | Remains logged in | ☐ PASS ☐ FAIL | |

---

## 9. DATA VALIDATION TESTS

| # | Test Case | Input | Expected Result | Status | Notes |
|---|-----------|-------|----------------|--------|-------|
| 9.1 | Create case with missing required field | Leave "Student" field empty → Submit | Shows validation error | ☐ PASS ☐ FAIL | |
| 9.2 | Create case with invalid tier | Enter tier "5" | Shows error or restricts to 1-3 | ☐ PASS ☐ FAIL | |
| 9.3 | Create case with invalid date | Enter date "13/45/2025" | Shows date format error | ☐ PASS ☐ FAIL | |
| 9.4 | Search with empty query | Enter nothing → Click search | Shows all cases or helpful message | ☐ PASS ☐ FAIL | |

---

## 10. ACCESSIBILITY TESTS

| # | Test Case | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 10.1 | Keyboard Navigation | Can navigate entire app with Tab key | ☐ PASS ☐ FAIL | |
| 10.2 | Focus Indicators | All interactive elements show focus state | ☐ PASS ☐ FAIL | |
| 10.3 | Screen Reader | All images have alt text | ☐ PASS ☐ FAIL | |
| 10.4 | Color Contrast | All text meets WCAG AA contrast ratio | ☐ PASS ☐ FAIL | |

---

## 11. BROWSER COMPATIBILITY TESTS

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ☐ PASS ☐ FAIL | |
| Firefox | Latest | ☐ PASS ☐ FAIL | |
| Safari | Latest | ☐ PASS ☐ FAIL | |
| Edge | Latest | ☐ PASS ☐ FAIL | |

---

## 12. KNOWN ISSUES & BUGS

### Critical Bugs (P0)
| # | Bug Description | Steps to Reproduce | Expected | Actual | Status |
|---|----------------|-------------------|----------|--------|--------|
| | | | | | |

### High Priority Bugs (P1)
| # | Bug Description | Steps to Reproduce | Expected | Actual | Status |
|---|----------------|-------------------|----------|--------|--------|
| | | | | | |

### Medium Priority Bugs (P2)
| # | Bug Description | Steps to Reproduce | Expected | Actual | Status |
|---|----------------|-------------------|----------|--------|--------|
| | | | | | |

### Low Priority Bugs (P3)
| # | Bug Description | Steps to Reproduce | Expected | Actual | Status |
|---|----------------|-------------------|----------|--------|--------|
| | | | | | |

---

## 13. FEATURE IMPLEMENTATION STATUS

| Feature | Status | Notes |
|---------|--------|-------|
| Case Management | ✅ Partially Complete | List and detail view working |
| Case CRUD | ⚠️ In Progress | Read works, Create/Update/Delete need implementation |
| Student Management | ❌ Not Started | Placeholder page only |
| Interventions | ❌ Not Started | Placeholder page only |
| Meetings | ❌ Not Started | Placeholder page only |
| Analytics | ❌ Not Started | Placeholder page only |
| File Uploads | ❌ Not Started | Button present but not functional |
| Google Calendar Integration | ❌ Not Started | Not implemented |
| Filters | ✅ Complete | All filters working on Cases page |
| Search | ✅ Complete | Student name search working |
| Authentication | ✅ Complete | Login/logout working |
| Mobile Navigation | ✅ Complete | Responsive menu working |

---

## TESTING SIGN-OFF

### Test Summary
- **Total Tests Executed:** ___
- **Passed:** ___
- **Failed:** ___
- **Blocked/N/A:** ___
- **Pass Rate:** ___%

### Critical Issues Found
1.
2.
3.

### Recommendations
1.
2.
3.

### Sign-Off
- **Tester:** QATestingAgent
- **Date:** November 18, 2025
- **Recommendation:** ☐ APPROVE FOR RELEASE ☐ NEEDS FIXES ☐ MAJOR ISSUES

---

## APPENDIX A: TEST DATA

### Test User Credentials
- **Email:** test@atlas.com
- **Password:** [See .env.local]
- **Role:** SSS Staff

### Test Cases
- Case ID: 1 - Sofia Martinez (Academic Support, Tier 2, OPEN)
- Case ID: 2 - Lucas Chen (Bullying, Tier 3, OPEN, URGENT)
- Case ID: 3 - Emma Thompson (SEL, Tier 1, OPEN)
- Case ID: 4 - Omar Hassan (Conflict Resolution, Tier 2, ON_HOLD)
- Case ID: 5 - Isabella Rodriguez (Academic Support, Tier 1, CLOSED)

---

## APPENDIX B: TESTING TOOLS

### Recommended Tools
- **Browser:** Chrome DevTools
- **Screen Readers:** NVDA, JAWS
- **Responsive Testing:** Chrome Device Mode, BrowserStack
- **Performance:** Lighthouse, WebPageTest
- **Accessibility:** axe DevTools, WAVE

### How to Run Automated Tests
```bash
# Install dependencies
npm install

# Run integration tests
npm test tests/integration.test.ts

# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

---

**Document Version:** 1.0
**Last Updated:** November 18, 2025
**Next Review:** Before MVP launch
