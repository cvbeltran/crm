# Role Simulation & Gap Analysis

## Role Personas & Workflows

### 👔 Executive Role
**Persona**: CEO/VP who needs full visibility and control
**Workflows**:
1. ✅ View all accounts, opportunities, quotes, handovers
2. ✅ Create accounts and opportunities
3. ✅ Create quotes
4. ✅ Approve/reject quotes
5. ✅ Create handovers
6. ✅ See all financial data (cost, margin, discounts)
7. ❌ **MISSING**: View approval history/comments
8. ❌ **MISSING**: Dashboard with key metrics

### 💼 Sales Role
**Persona**: Sales rep managing pipeline
**Workflows**:
1. ✅ Create accounts
2. ✅ Create opportunities
3. ✅ Move opportunities through pipeline (lead → qualified → proposal)
4. ✅ Create quotes
5. ✅ Submit quotes for approval
6. ✅ Edit opportunities and quotes
7. ✅ Create handovers
8. ❌ **MISSING**: Cannot see approval comments when quote is rejected
9. ❌ **MISSING**: No validation that opportunity must be "proposal" before creating quote
10. ❌ **MISSING**: Quote number uniqueness not validated in UI

### 💰 Finance Role
**Persona**: Finance manager protecting margins
**Workflows**:
1. ✅ View all quotes with financial data
2. ✅ Approve/reject quotes
3. ✅ See cost, margin, discounts
4. ❌ **MISSING**: Approval records not created when approving/rejecting
5. ❌ **MISSING**: Cannot add comments when approving/rejecting
6. ❌ **MISSING**: No approval history view
7. ❌ **MISSING**: Cannot see who approved/rejected and when

### 🔧 Operations Role
**Persona**: Operations manager accepting handovers
**Workflows**:
1. ✅ View opportunities (deal value, scope, dates)
2. ✅ View quotes (restricted - no cost/margin/discounts) ✅
3. ✅ View handovers
4. ✅ Accept handovers
5. ✅ Flag handovers with reason
6. ❌ **MISSING**: Cannot see approval history (correct per plan, but should verify)
7. ✅ Cannot see cost/margin/discounts (correctly hidden)

---

## Edge Cases & Missing Features

### 🔴 Critical Missing Features

1. **Approval Records Not Created**
   - When Finance approves/rejects a quote, no record is created in `approvals` table
   - Approval history is lost
   - Cannot track who approved/rejected and when

2. **No Approval Comments**
   - Finance cannot add comments when approving/rejecting
   - Sales cannot see rejection reasons

3. **No Approval History UI**
   - Approval table exists but no UI to view it
   - Finance/Sales/Executive should see approval history

4. **Quote Number Uniqueness**
   - Database has UNIQUE constraint but UI doesn't validate
   - User could submit duplicate quote number and get error

5. **Handover Validation**
   - Can create handover from any opportunity state
   - Should only allow handovers from `closed_won` opportunities

6. **Quote Creation Validation**
   - Can create quote for any opportunity state
   - Should validate opportunity is in appropriate state (proposal or closed_won?)

### 🟡 Important Missing Features

7. **Dashboard Empty**
   - Home page is just placeholder
   - No key metrics or recent activity

8. **User Profile Management**
   - Cannot view/edit own profile
   - Cannot see other users' profiles

9. **Error Handling**
   - No error boundaries
   - Some errors might crash the app

10. **Loading States**
    - List pages don't show loading states
    - Could show skeleton loaders

11. **Empty States**
    - Some empty states could be more helpful
    - Could suggest actions

12. **Form Validation**
    - Client-side validation could be improved
    - Better error messages

### 🟢 Nice-to-Have Missing Features

13. **Search/Filter**
    - No search functionality
    - No filters on list pages

14. **Pagination**
    - All records loaded at once
    - Could paginate for performance

15. **Breadcrumbs**
    - Navigation could use breadcrumbs

16. **Success Messages**
    - No toast notifications for successful actions

17. **Confirmation Dialogs**
    - No confirmation for destructive actions (reject quote, flag handover)

---

## Gap Checklist

### ❌ Critical Gaps

- [ ] **Approval records not created** - When approving/rejecting quotes
- [ ] **No approval comments** - Finance cannot add comments
- [ ] **No approval history UI** - Cannot view approval records
- [ ] **Quote number uniqueness** - Not validated in UI before submit
- [ ] **Handover validation** - Should only allow from closed_won opportunities
- [ ] **Quote creation validation** - Should validate opportunity state

### ⚠️ Important Gaps

- [ ] **Dashboard empty** - No metrics or activity
- [ ] **User profile management** - Cannot view/edit profiles
- [ ] **Error boundaries** - No error handling for crashes
- [ ] **Loading states** - List pages don't show loading
- [ ] **Better empty states** - Could be more helpful
- [ ] **Form validation** - Client-side validation improvements

### 💡 Nice-to-Have Gaps

- [ ] **Search/Filter** - No search functionality
- [ ] **Pagination** - All records loaded at once
- [ ] **Breadcrumbs** - Navigation improvements
- [ ] **Success messages** - No toast notifications
- [ ] **Confirmation dialogs** - No confirmations for destructive actions

---

## Task List to Fix/Add (Priority Order)

### Priority 1: Critical Fixes

1. **Create Approval Records**
   - Modify `transitionQuoteState` to create approval record
   - Include approver_id, status, comments
   - Link to quote_id

2. **Add Approval Comments**
   - Add comment field to approval UI
   - Update approval form to include comments
   - Store comments in approval record

3. **Create Approval History UI**
   - Add approval history section to quote detail page
   - Show approver, status, comments, timestamp
   - Hide from Operations role (per visibility rules)

4. **Quote Number Uniqueness Validation**
   - Add client-side check before form submit
   - Show error if duplicate
   - Check against existing quote numbers

5. **Handover Creation Validation**
   - Validate opportunity state is `closed_won`
   - Show error if not closed_won
   - Update create form validation

6. **Quote Creation Validation**
   - Validate opportunity state (proposal or closed_won?)
   - Show error if invalid state
   - Update create form validation

### Priority 2: Important Features

7. **Dashboard with Metrics**
   - Add key metrics (total opportunities, quotes, handovers)
   - Show recent activity
   - Role-based metrics

8. **User Profile Management**
   - Add profile page
   - Allow editing own profile (name, email)
   - View other users (for dropdowns)

9. **Error Boundaries**
   - Add error boundary component
   - Wrap pages in error boundaries
   - Show friendly error messages

10. **Loading States**
    - Add loading skeletons to list pages
    - Show loading indicators during data fetch

11. **Better Empty States**
    - Improve empty state messages
    - Add helpful actions

12. **Form Validation Improvements**
    - Add Zod validation
    - Better error messages
    - Client-side validation

### Priority 3: Nice-to-Have

13. **Search/Filter**
    - Add search to list pages
    - Add filters (state, date range, etc.)

14. **Pagination**
    - Implement pagination for list pages
    - Limit records per page

15. **Breadcrumbs**
    - Add breadcrumb navigation
    - Show current location

16. **Success Messages**
    - Add toast notifications
    - Show success messages for actions

17. **Confirmation Dialogs**
    - Add confirmations for destructive actions
    - Prevent accidental rejections/flags

---

## Test Plan (If No Gaps Found)

Since we found gaps, here's the test plan for after fixes:

### Manual Testing Checklist

#### Authentication
- [ ] Sign up with each role (Executive, Sales, Finance, Operations)
- [ ] Login with each role
- [ ] Logout works
- [ ] Protected routes redirect to login

#### Executive Role Tests
- [ ] Can view all accounts
- [ ] Can create/edit accounts
- [ ] Can view all opportunities
- [ ] Can create/edit opportunities
- [ ] Can transition opportunity states
- [ ] Can view all quotes with financial data
- [ ] Can create/edit quotes
- [ ] Can approve/reject quotes
- [ ] Can view approval history
- [ ] Can view all handovers
- [ ] Can create handovers

#### Sales Role Tests
- [ ] Can create/edit accounts
- [ ] Can create/edit opportunities
- [ ] Can transition opportunities (lead → qualified → proposal)
- [ ] Cannot transition to closed_won/lost (Finance only?)
- [ ] Can create quotes
- [ ] Can submit quotes for approval
- [ ] Can see approval comments when rejected
- [ ] Can create handovers
- [ ] Cannot approve quotes

#### Finance Role Tests
- [ ] Can view all quotes with financial data
- [ ] Can approve quotes with comments
- [ ] Can reject quotes with comments
- [ ] Can view approval history
- [ ] Cannot create opportunities/quotes
- [ ] Cannot create handovers

#### Operations Role Tests
- [ ] Can view opportunities (deal value, scope, dates)
- [ ] Can view quotes (NO cost, margin, discounts visible)
- [ ] Cannot see approval history
- [ ] Can view handovers
- [ ] Can accept handovers
- [ ] Can flag handovers with reason
- [ ] Cannot create anything
- [ ] Cannot edit opportunity/quote details

#### Edge Cases
- [ ] Cannot create duplicate quote numbers
- [ ] Cannot create handover from non-closed_won opportunity
- [ ] Cannot create quote from invalid opportunity state
- [ ] Cannot transition from closed states
- [ ] Cannot see sensitive data as Operations
- [ ] Approval records created when approving/rejecting
- [ ] Comments saved with approvals

#### Data Integrity
- [ ] State transitions validated
- [ ] Role permissions enforced
- [ ] Visibility rules enforced
- [ ] Foreign key relationships maintained
- [ ] Cascade deletes work correctly

---

## Summary

**Critical Gaps Found**: 6
**Important Gaps Found**: 6
**Nice-to-Have Gaps Found**: 5

**Total Gaps**: 17

**Recommendation**: Fix Priority 1 items before considering the app complete. Priority 2 items should be addressed for production readiness. Priority 3 items can be added incrementally.

