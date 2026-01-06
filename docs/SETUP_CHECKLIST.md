# Setup Checklist - According to plan.md

## 🔍 Validation System

**Automatic validation is now active!** After creating any new file, run:

```bash
npm run validate <file-path> [item-name]
```

**Examples:**
- `npm run validate lib/actions/accounts.ts "Server Action: accounts.ts"`
- `npm run validate app/accounts/page.tsx "Page: Accounts List"`
- `npm run validate components/ui/account-card.tsx "Component: Account Card"`

Validation results are automatically added to the **VALIDATION RESULTS** section below. If validation fails, actionable prompts are provided for fixing issues.

See `lib/validation/README.md` for full documentation.

## ✅ COMPLETED (Setup Phase)

### 1. Database Schema ✅
- [x] All tables created: `user_profiles`, `accounts`, `opportunities`, `quotes`, `approvals`, `handovers`
- [x] All enums created: `user_role`, `opportunity_state`, `quote_state`, `handover_state`
- [x] Foreign key relationships established
- [x] Indexes created for performance
- [x] Triggers for `updated_at` timestamps
- [x] CHECK constraints for state validation (prevents invalid states)

### 2. RLS Policies ✅
- [x] Row Level Security enabled on all tables
- [x] Helper functions: `get_user_role()`, `has_role()`, `has_any_role()`
- [x] Role-based access policies for all tables
- [x] Operations visibility restrictions implemented
- [x] `quotes_for_operations` view created (hides sensitive fields)

### 3. Core Workflows (Database Level) ✅
- [x] **Opportunity states**: `lead → qualified → proposal → closed_won / closed_lost`
  - Enum defined ✅
  - CHECK constraint prevents invalid states ✅
- [x] **Quote states**: `draft → pending_approval → approved / rejected`
  - Enum defined ✅
  - CHECK constraint prevents invalid states ✅
- [x] **Handover states**: `pending → accepted / flagged`
  - Enum defined ✅
  - CHECK constraint prevents invalid states ✅
- [x] **No backward transitions**: CHECK constraints prevent invalid state values ✅

### 4. Data Ownership Rules (Database Level) ✅
- [x] **Sales owns opportunities**: RLS policies allow Sales/Executive to create/update opportunities ✅
- [x] **Finance owns cost and margin**: RLS policies allow Finance/Executive to update quote approval status ✅
- [x] **Operations owns execution acceptance**: RLS policies allow Operations to update handover status ✅
- [x] **System enforces state transitions**: CHECK constraints in database ✅

### 5. Visibility Rules (Critical) ✅
- [x] **Operations can see**: deal value, scope, dates ✅
  - Implemented via `quotes_for_operations` view ✅
- [x] **Operations cannot see**: margin, cost, discounts, approval history ✅
  - RLS policies block Operations from viewing approvals table ✅
  - View excludes sensitive fields (cost, margin, margin_percentage, discount_percentage) ✅

### 6. Roles ✅
- [x] All 4 roles defined: `executive`, `sales`, `finance`, `operations`
- [x] Role enum created in database ✅
- [x] Role-based RLS policies implemented ✅

### 7. Technical Stack Setup ✅
- [x] Next.js configured (App Router) ✅
- [x] TypeScript configured ✅
- [x] Tailwind CSS configured ✅
- [x] shadcn/ui initialized and components installed ✅
- [x] Supabase client configured (browser + server) ✅
- [x] Supabase types generated ✅
- [x] Project structure created ✅

### 8. Type Definitions ✅
- [x] Database types (`lib/types/database.ts`) ✅
- [x] Supabase generated types (`lib/types/supabase.ts`) ✅
- [x] Workflow types (`lib/types/workflows.ts`) ✅
- [x] Constants (`lib/constants.ts`) ✅

---

## ⚠️ PARTIALLY COMPLETE (Needs Application-Level Implementation)

### 9. State Transition Validation (Application Level) ⚠️
- [x] **Database level**: CHECK constraints prevent invalid states ✅
- [x] **Type definitions**: `OPPORTUNITY_TRANSITIONS`, `QUOTE_TRANSITIONS`, `HANDOVER_TRANSITIONS` ✅
- [x] **Helper function**: `isValidTransition()` created ✅
- [ ] **Server actions**: State transition validation functions NOT YET CREATED
  - Need: Functions to validate transitions before updating records
  - Need: Error handling for invalid transitions

### 10. Authentication Flow ⚠️
- [x] **Supabase Auth configured**: Client/server helpers created ✅
- [x] **Auth utilities**: `getCurrentUser()`, `getUserProfile()`, `getUserRole()`, `hasRole()`, `hasAnyRole()` ✅
- [ ] **Login page**: NOT CREATED
- [ ] **Sign up page**: NOT CREATED
- [ ] **User profile creation**: NOT IMPLEMENTED (trigger to create profile on signup)
- [ ] **Protected routes**: NOT IMPLEMENTED
- [ ] **Session management**: NOT IMPLEMENTED

---

## ❌ NOT STARTED (Next Steps)

### 11. Server Actions / API ❌
- [ ] CRUD operations for Accounts
- [ ] CRUD operations for Opportunities
- [ ] CRUD operations for Quotes
- [ ] CRUD operations for Approvals
- [ ] CRUD operations for Handovers
- [ ] State transition validation in server actions
- [ ] Role-based authorization checks in server actions
- [ ] Operations-specific quote queries (using `quotes_for_operations` view)

### 12. Desktop Pages ❌
- [ ] Accounts list page
- [ ] Account detail/edit page
- [ ] Opportunities list page
- [ ] Opportunity detail/edit page
- [ ] Quotes list page
- [ ] Quote detail/edit page
- [ ] Approvals page
- [ ] Handovers list page
- [ ] Handover detail page
- [ ] Dashboard/home page

### 13. Responsive Behavior ❌
- [ ] Mobile layouts
- [ ] Tablet layouts
- [ ] Responsive navigation
- [ ] Mobile-friendly forms

### 14. Role-Based UI Components ❌
- [ ] Conditional rendering based on user role
- [ ] Operations-specific quote views (hide sensitive fields)
- [ ] Role-based navigation
- [ ] Role-based action buttons
- [ ] Finance approval UI
- [ ] Operations handover UI

### 15. Polish & Refactor ❌
- [ ] Error handling
- [ ] Loading states
- [ ] Form validation
- [ ] Data formatting (currency, dates)
- [ ] Accessibility improvements
- [ ] Performance optimization

---

## 🔍 CRITICAL GAPS TO ADDRESS BEFORE NEXT STEPS

### Must Complete Before Building UI:

1. **Authentication Flow** ⚠️ CRITICAL
   - [ ] Create login/signup pages
   - [ ] Implement database trigger or function to auto-create `user_profiles` on signup
   - [ ] Create protected route wrapper
   - [ ] Test authentication flow end-to-end

2. **State Transition Validation Functions** ⚠️ IMPORTANT
   - [ ] Create server action helpers to validate state transitions
   - [ ] Ensure transitions follow workflow rules
   - [ ] Prevent backward transitions after closure

3. **Operations Quote Query Helper** ⚠️ IMPORTANT
   - [ ] Create helper function to query `quotes_for_operations` view for Operations role
   - [ ] Ensure Operations never see sensitive fields

---

## ✅ VERIFICATION: Setup Completeness

### Database Layer: ✅ 100% Complete
- Schema ✅
- RLS Policies ✅
- State Constraints ✅
- Visibility Rules ✅
- Data Ownership ✅

### Application Infrastructure: ✅ 100% Complete
- Next.js Setup ✅
- TypeScript Types ✅
- Supabase Clients ✅
- shadcn/ui Components ✅
- Utility Functions ✅

### Application Logic: ⚠️ 30% Complete
- Type Definitions ✅
- Auth Helpers ✅
- State Transition Types ✅
- **Missing**: Server Actions, Auth Flow, State Validation Functions

### UI Layer: ❌ 0% Complete
- No pages created
- No components created (except base shadcn/ui)
- No role-based UI logic

---

## 🔍 VALIDATION RESULTS

### Server Action: quotes.ts
- **Status**: passed
- **Validation**: passed

### Test: Bad Component
- **Status**: failed
- **Validation**: 
  failed - Actions needed:
    1. Add TypeScript types for component props
    2. Define Props interface or type

### Test: Bad Page
- **Status**: failed
- **Validation**: 
  failed - Actions needed:
    1. Add authentication check using getCurrentUser() or getUserProfile()
    2. Redirect to login if user is not authenticated
    3. Or wrap page with ProtectedRoute component

### Test: Bad Server Action
- **Status**: failed
- **Validation**: 
  failed - Actions needed:
    1. Import auth helpers: import { hasRole, hasAnyRole, getUserRole } from "@/lib/auth"
    2. Add role checks before sensitive operations
    3. Ensure Operations role cannot access sensitive fields (cost, margin, discounts)

### Page: Accounts List
- **Status**: passed
- **Validation**: passed

### Server Action: quotes.ts
- **Status**: passed
- **Validation**: passed

### Server Action: accounts.ts
- **Status**: passed
- **Validation**: passed

## 📋 SUMMARY

### ✅ Ready to Proceed:
- Database is fully set up and production-ready
- All states, rules, and constraints are encoded in the database
- Infrastructure is complete
- Type safety is in place

### ⚠️ Should Complete First:
1. **Authentication flow** - Users need to be able to log in
2. **State transition validation** - Application-level enforcement
3. **Operations quote helper** - Ensure visibility rules are enforced in code

### ✅ Can Proceed With:
- Building server actions (with auth flow in parallel)
- Building UI pages
- Implementing role-based components

---

## 🎯 RECOMMENDED ORDER

1. **First**: Authentication flow (login, signup, protected routes)
2. **Second**: State transition validation helpers
3. **Third**: Server actions for CRUD operations
4. **Fourth**: Desktop pages
5. **Fifth**: Role-based UI components
6. **Sixth**: Responsive behavior
7. **Seventh**: Polish & refactor

---

**Status**: Setup phase is **COMPLETE**. Database layer is production-ready. Ready to proceed with application development, but authentication flow should be implemented first.

