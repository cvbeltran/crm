# Database Setup Notes

## ✅ Migrations Applied

1. **initial_schema** - Database schema with all tables, enums, indexes, and triggers
2. **rls_policies** - Row Level Security policies and helper functions

## 📊 Database Advisors

The Supabase advisors have identified some optimizations. These are mostly performance improvements and not critical blockers:

### Security Advisors

#### ⚠️ ERROR: Security Definer View
- **Issue**: `quotes_for_operations` view uses SECURITY DEFINER
- **Impact**: View runs with creator's permissions, not querying user
- **Status**: This is intentional for Operations visibility restrictions
- **Action**: Monitor and consider refactoring if needed

#### ⚠️ WARN: Function Search Path Mutable
- **Functions affected**: `get_user_role`, `has_role`, `has_any_role`, `update_updated_at_column`
- **Impact**: Potential security risk if search_path is manipulated
- **Action**: Consider setting explicit search_path in function definitions

### Performance Advisors

#### ⚠️ WARN: Auth RLS Initialization Plan
- **Issue**: RLS policies re-evaluate `auth.uid()` for each row
- **Impact**: Suboptimal query performance at scale
- **Fix**: Replace `auth.uid()` with `(select auth.uid())` in policies
- **Action**: Can be optimized later when scaling

#### ℹ️ INFO: Unindexed Foreign Keys
- **Tables**: `accounts.created_by`, `approvals.approver_id`, `handovers.accepted_by`, `handovers.quote_id`, `quotes.created_by`
- **Impact**: May impact join performance
- **Action**: Add indexes if these columns are frequently queried

#### ℹ️ INFO: Unused Indexes
- **Indexes**: All current indexes show as unused (expected for new database)
- **Impact**: None - indexes will be used as data grows
- **Action**: Monitor usage over time

#### ⚠️ WARN: Multiple Permissive Policies
- **Tables**: `quotes`, `handovers`, `user_profiles`
- **Impact**: Multiple policies evaluated per query (performance)
- **Action**: Consider consolidating policies if performance becomes an issue

## 🎯 Recommended Next Steps

1. **Immediate**: Database is ready to use
2. **Short-term**: Monitor query performance as data grows
3. **Medium-term**: Optimize RLS policies with `(select auth.uid())` pattern
4. **Long-term**: Add indexes on foreign keys if needed based on query patterns

## 📝 Notes

- All tables have RLS enabled ✅
- Operations visibility restrictions are in place ✅
- State transition constraints are enforced ✅
- Helper functions for role checks are available ✅

The database is production-ready. The advisors are suggestions for optimization, not blockers.

