# Validation System

This validation system automatically checks newly created files and updates the checklist with pass/fail status.

## Usage

After creating a new file (server action, page, component, etc.), run:

```bash
npm run validate <file-path> [item-name]
```

### Examples

```bash
# Validate a server action
npm run validate lib/actions/accounts.ts "Server Action: accounts.ts"

# Validate a page
npm run validate app/accounts/page.tsx "Page: Accounts List"

# Validate a component
npm run validate components/ui/account-card.tsx "Component: Account Card"

# Validate a migration
npm run validate supabase/migrations/add_new_table.sql "Migration: Add New Table"
```

## What Gets Validated

### Server Actions (`lib/actions/*.ts`)
- ✅ Has `'use server'` directive
- ✅ Includes role-based authorization checks
- ✅ Has error handling
- ✅ Validates state transitions (if applicable)
- ✅ Enforces Operations visibility restrictions (for quotes)

### Pages (`app/**/page.tsx`)
- ✅ Proper component type (client/server)
- ✅ Protected route (authentication check)
- ✅ Role-based UI logic (if applicable)

### Components (`components/**/*.tsx`)
- ✅ Proper component export
- ✅ TypeScript types for props

### Migrations (`supabase/**/*.sql`)
- ✅ RLS policies for new tables
- ✅ Updated_at triggers

## Checklist Updates

Validation results are automatically added to `SETUP_CHECKLIST.md` in a new section:

```markdown
## 🔍 VALIDATION RESULTS

### Server Action: accounts.ts
- **Status**: passed
- **Validation**: passed

### Page: Accounts List
- **Status**: failed
- **Validation**: failed - Actions needed:
  1. Add authentication check using getCurrentUser() or getUserProfile()
  2. Redirect to login if user is not authenticated
```

## Integration

You can also use the validation functions programmatically:

```typescript
import { validateFile, formatForChecklist } from '@/lib/validation'
import { updateChecklist } from '@/lib/validation/checklist-updater'

const checks = validateFile('lib/actions/accounts.ts')
const result = formatForChecklist(checks)
updateChecklist('Server Action: accounts.ts', checks)
```

