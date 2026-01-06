# Sales Lead-to-Order System — Build Plan

## 1. Objective
Build a single-app, role-based Sales Lead-to-Order system
that supports:
- Sales execution
- Financial control
- Operational handover
without margin leakage or workflow ambiguity.

---

## 2. In Scope (Phase 1)
- Accounts
- Opportunities
- Quotes (no file uploads)
- Approvals
- Sales → Operations handover
- Role-based visibility
- Desktop-first, responsive UI

---

## 3. Out of Scope (Explicit)
- Quote / PO file uploads
- Notifications
- Realtime subscriptions
- External integrations
- Advanced reporting
- Automation beyond approvals

---

## 4. Roles
- Executive
- Sales
- Finance
- Operations

Roles are decision-based, not org-based.

---

## 5. Core Workflows

### Opportunity
lead → qualified → proposal → closed_won / closed_lost

### Quote
draft → pending_approval → approved / rejected

### Handover
pending → accepted / flagged

No backward transitions after closure.

---

## 6. Data Ownership Rules
- Sales owns opportunities and deal value
- Sales owns opportunities and deal value
- Finance owns cost and margin
- Operations owns execution acceptance
- System enforces state transitions

---

## 7. Visibility Rules (Critical)
- Operations can see deal value, scope, dates
- Operations cannot see:
  - margin
  - cost
  - discounts
  - approval history

---

## 8. Technical Stack
- Frontend: Next.js + shadcn
- Backend: Supabase (Postgres + RLS)
- Auth: Supabase Auth
- Build tool: Cursor with Supabase MCP

---

## 9. Build Order
1. Database schema
2. RLS policies
3. Server actions / API
4. Desktop pages
5. Responsive behavior
6. Polish & refactor

---

## 10. Design Principles
- Encode decisions, not behavior
- Visibility ≠ authority
- Sales sells, Finance protects, Operations delivers
- Simplicity over completeness

