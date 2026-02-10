-- =====================================================================
-- Performance Indexes for Expense Tracker
-- Run after 01_schema.sql and 02_views.sql
-- These indexes optimize common query patterns used by views and API endpoints
-- =====================================================================
-- Index 1: Support for month-based view queries (v_monthly_cashflow, v_category_spend_monthly)
-- PostgreSQL query planner uses this for DATE_TRUNC grouping
CREATE INDEX IF NOT EXISTS tx_user_date_type_idx ON public.transactions (user_id, occurred_on DESC, type)
WHERE
  deleted_at IS NULL;

-- Index 2: Transactions filtering by type and date range
-- Useful for filtering income/expense by date range in API
CREATE INDEX IF NOT EXISTS tx_user_type_date_idx ON public.transactions (user_id, type, occurred_on DESC)
WHERE
  deleted_at IS NULL;

-- Index 3: Budget queries with category and date range
-- Critical for v_budget_status view and dashboard budget calculations
CREATE INDEX IF NOT EXISTS budgets_user_category_date_idx ON public.budgets (user_id, category_id, start_date, end_date)
WHERE
  deleted_at IS NULL;

-- Index 4: Active recurring rules for processing
-- Useful for finding active recurring rules to generate transactions
CREATE INDEX IF NOT EXISTS recurring_active_next_idx ON public.recurring_rules (user_id, is_active, start_on)
WHERE
  deleted_at IS NULL
  AND is_active = true;

-- Index 5: Tag-based filtering (GIN index for array operations)
-- Enables fast tag searches on transactions
CREATE INDEX IF NOT EXISTS tx_tags_idx ON public.transactions USING GIN (tags)
WHERE
  deleted_at IS NULL
  AND tags IS NOT NULL;

-- Index 6: Accounts sorted by balance
-- Useful for accounts list sorted by balance
CREATE INDEX IF NOT EXISTS accounts_user_balance_idx ON public.accounts (user_id, current_balance DESC)
WHERE
  deleted_at IS NULL;

-- Index 7: Unread alerts (partial index)
-- Highly selective index for fetching unread notifications
CREATE INDEX IF NOT EXISTS alerts_user_unread_idx ON public.alerts (user_id, occurred_at DESC)
WHERE
  is_read = false;

-- Index 8: Active (non-dismissed) alerts (partial index)
-- Optimized for fetching alerts that haven't been dismissed
CREATE INDEX IF NOT EXISTS alerts_user_active_idx ON public.alerts (user_id, occurred_at DESC)
WHERE
  is_read = false
  AND dismissed_at IS NULL;

-- Index 9: Profile timezone queries
-- Useful if filtering/grouping by timezone in analytics
CREATE INDEX IF NOT EXISTS profiles_timezone_idx ON public.profiles (timezone);

-- Index 10: Covering index for transaction lists
-- Includes commonly queried columns to avoid table lookups
CREATE INDEX IF NOT EXISTS tx_user_date_covering_idx ON public.transactions (
  user_id,
  occurred_on DESC,
  type,
  amount,
  account_id,
  category_id
)
WHERE
  deleted_at IS NULL;

-- Index 11: Category lookups by user and side (income vs expense)
-- Useful for filtering expense/income categories in forms
CREATE INDEX IF NOT EXISTS categories_user_side_idx ON public.categories (user_id, side, sort_order)
WHERE
  deleted_at IS NULL;

-- Index 12: Audit log global time queries (for admin/reporting)
-- Useful for audit reports across all users
CREATE INDEX IF NOT EXISTS audit_occurred_at_idx ON public.audit_log (occurred_at DESC, table_name);

-- =====================================================================
-- Post-Index Maintenance Commands (run in Supabase SQL Editor):
-- =====================================================================
-- 1. Analyze tables to update statistics:
--    ANALYZE public.transactions;
--    ANALYZE public.budgets;
--    ANALYZE public.accounts;
--
-- 2. Monitor index usage:
--    SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
--    FROM pg_stat_user_indexes 
--    WHERE schemaname = 'public'
--    ORDER BY idx_scan DESC;
--
-- 3. Find unused indexes (idx_scan = 0):
--    SELECT schemaname, tablename, indexname
--    FROM pg_stat_user_indexes 
--    WHERE schemaname = 'public' AND idx_scan = 0;
--
-- 4. Check slow queries (requires pg_stat_statements extension):
--    SELECT query, mean_exec_time, calls
--    FROM pg_stat_statements 
--    ORDER BY mean_exec_time DESC 
--    LIMIT 10;
-- =====================================================================