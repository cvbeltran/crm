# Task List: Fixes & Enhancements

## Priority 1: Critical Fixes (Must Fix Before Production)

### Task 1.1: Create Approval Records When Approving/Rejecting Quotes
**File**: `lib/actions/quotes.ts`
**Action**: 
- Modify `transitionQuoteState` function
- When state changes to 'approved' or 'rejected', create record in `approvals` table
- Include: quote_id, approver_id (current user), status, comments (if provided)
- Update quote state AND create approval record atomically

**Files to modify**:
- `lib/actions/quotes.ts` - Update transitionQuoteState
- `lib/actions/approvals.ts` - Create new file with approval CRUD operations

---

### Task 1.2: Add Approval Comments Field
**Files**: 
- `components/quotes/quote-state-transition.tsx`
- `lib/actions/quotes.ts`

**Action**:
- Add textarea for comments in approval UI
- Pass comments to transitionQuoteState
- Store comments in approval record
- Display comments in approval history

**UI Changes**:
- Add comment field to approval form
- Show comments in approval history

---

### Task 1.3: Create Approval History UI Component
**Files**: 
- `components/quotes/approval-history.tsx` (new)
- `app/quotes/[id]/page.tsx` (modify)

**Action**:
- Create component to display approval history
- Show: approver name, status, comments, timestamp
- Hide from Operations role (per visibility rules)
- Add to quote detail page

**Server Action**:
- `lib/actions/approvals.ts` - Add getApprovalsByQuote function

---

### Task 1.4: Quote Number Uniqueness Validation
**Files**:
- `components/quotes/quote-create-form.tsx`
- `components/quotes/quote-edit-form.tsx` (if editing quote_number)

**Action**:
- Add server action to check quote number uniqueness
- Validate before form submit
- Show error message if duplicate
- Prevent submission if duplicate

**Server Action**:
- `lib/actions/quotes.ts` - Add checkQuoteNumberExists function

---

### Task 1.5: Handover Creation Validation
**Files**:
- `components/handovers/handover-create-form.tsx`
- `lib/actions/handovers.ts`

**Action**:
- Validate opportunity state is 'closed_won' before allowing handover creation
- Show error message if opportunity is not closed_won
- Disable form submission if invalid
- Update server action to validate

**Validation Logic**:
- Check opportunity state when opportunity is selected
- Show warning/error if not closed_won
- Prevent form submission

---

### Task 1.6: Quote Creation Validation
**Files**:
- `components/quotes/quote-create-form.tsx`
- `lib/actions/quotes.ts`

**Action**:
- Validate opportunity state before allowing quote creation
- Should be 'proposal' or 'closed_won' (decide based on business logic)
- Show error if invalid state
- Update server action to validate

**Validation Logic**:
- Check opportunity state when opportunity is selected
- Show warning/error if invalid state
- Prevent form submission

---

## Priority 2: Important Features (Should Fix for Production)

### Task 2.1: Dashboard with Metrics
**Files**:
- `app/page.tsx` (modify)
- `lib/actions/dashboard.ts` (new)

**Action**:
- Create dashboard with key metrics:
  - Total opportunities by state
  - Total quotes by state
  - Total handovers by state
  - Recent activity (last 10 items)
- Role-based metrics (Operations sees limited data)
- Add charts or cards for visualization

**Server Actions**:
- `lib/actions/dashboard.ts` - Add getDashboardMetrics function

---

### Task 2.2: User Profile Management
**Files**:
- `app/profile/page.tsx` (new)
- `components/profile/profile-form.tsx` (new)
- `lib/actions/profile.ts` (new)

**Action**:
- Create profile page to view/edit own profile
- Allow editing: full_name, email (if allowed)
- Cannot edit role (admin only)
- Show current role
- Add link in navigation

**Server Actions**:
- `lib/actions/profile.ts` - Add updateProfile function

---

### Task 2.3: Error Boundaries
**Files**:
- `components/error-boundary.tsx` (new)
- `app/layout.tsx` (modify)

**Action**:
- Create error boundary component
- Wrap pages in error boundary
- Show friendly error messages
- Add "Try again" button
- Log errors for debugging

---

### Task 2.4: Loading States
**Files**:
- `components/ui/skeleton.tsx` (new - shadcn component)
- All list pages (modify)

**Action**:
- Add skeleton loaders to list pages
- Show loading state during data fetch
- Use Suspense boundaries
- Improve UX during loading

**Pages to update**:
- `app/accounts/page.tsx`
- `app/opportunities/page.tsx`
- `app/quotes/page.tsx`
- `app/handovers/page.tsx`

---

### Task 2.5: Better Empty States
**Files**:
- All list pages (modify)

**Action**:
- Improve empty state messages
- Add helpful actions
- Show "Create your first X" messages
- Add quick action buttons

---

### Task 2.6: Form Validation Improvements
**Files**:
- All form components (modify)
- `lib/validations.ts` (new)

**Action**:
- Add Zod schemas for validation
- Client-side validation before submit
- Better error messages
- Validate required fields
- Validate data types and formats

**Schemas needed**:
- Account schema
- Opportunity schema
- Quote schema
- Handover schema

---

## Priority 3: Nice-to-Have Features

### Task 3.1: Search/Filter Functionality
**Files**:
- All list pages (modify)
- `components/search-filter.tsx` (new)

**Action**:
- Add search input to list pages
- Filter by state, date range, etc.
- Server-side filtering for performance
- Update server actions to accept filters

---

### Task 3.2: Pagination
**Files**:
- All list pages (modify)
- `components/pagination.tsx` (new)

**Action**:
- Implement pagination for list pages
- Limit records per page (e.g., 20)
- Add page navigation
- Update server actions to support pagination

---

### Task 3.3: Breadcrumbs
**Files**:
- `components/breadcrumbs.tsx` (new)
- All detail pages (modify)

**Action**:
- Add breadcrumb navigation
- Show current location
- Add links to parent pages
- Improve navigation UX

---

### Task 3.4: Success Messages (Toast Notifications)
**Files**:
- `components/ui/toast.tsx` (new - shadcn component)
- `components/ui/toaster.tsx` (new - shadcn component)
- All form components (modify)

**Action**:
- Add toast notification system
- Show success messages for actions
- Show error messages
- Auto-dismiss after timeout

---

### Task 3.5: Confirmation Dialogs
**Files**:
- `components/ui/alert-dialog.tsx` (new - shadcn component)
- `components/quotes/quote-state-transition.tsx` (modify)
- `components/handovers/handover-state-transition.tsx` (modify)

**Action**:
- Add confirmation dialogs for destructive actions
- Confirm before rejecting quote
- Confirm before flagging handover
- Prevent accidental actions

---

## Implementation Order Recommendation

1. **Start with Priority 1 tasks** (Critical fixes)
   - Task 1.1: Approval records
   - Task 1.2: Approval comments
   - Task 1.3: Approval history UI
   - Task 1.4: Quote number validation
   - Task 1.5: Handover validation
   - Task 1.6: Quote creation validation

2. **Then Priority 2 tasks** (Important features)
   - Task 2.1: Dashboard
   - Task 2.2: User profile
   - Task 2.3: Error boundaries
   - Task 2.4: Loading states
   - Task 2.5: Empty states
   - Task 2.6: Form validation

3. **Finally Priority 3 tasks** (Nice-to-have)
   - Implement as needed based on user feedback

---

## Testing After Fixes

After implementing Priority 1 fixes, run through the test plan in `ROLE_SIMULATION_ANALYSIS.md` to verify:
- All critical gaps are fixed
- Workflows work correctly
- Edge cases are handled
- Role permissions are enforced
- Data integrity is maintained

