# Database Scripts

Folder này chứa các SQL scripts để setup database cho MoneyTrack.

## 📋 Thứ tự thực thi

Chạy các file theo thứ tự sau trong Supabase SQL Editor:

1. **01_schema.sql** - Tables, RLS policies, functions, triggers, system categories
2. **02_views.sql** - Optimized views
3. **03_indexes.sql** - Performance indexes
4. **04_budget_alerts.sql** - Budget alert triggers (tự động tạo alerts khi chi tiêu vượt ngưỡng)

## 📝 Mô tả chi tiết

### 01_schema.sql

**Nội dung:**

- Extensions: pgcrypto
- Enums: account_type, tx_type, category_side, budget_period, alert_type (5 types), recurring_freq
- Tables: profiles, accounts, categories, transactions, budgets, alerts, recurring_rules, audit_log
- RLS Policies: Tất cả tables có RLS với policies SELECT/INSERT/UPDATE/DELETE own
- Functions:
  - `handle_new_user()`: Tự động tạo profile khi signup (OAuth support)
  - `create_default_categories()`: [DEPRECATED] Không còn sử dụng - system categories được dùng thay thế
  - `check_email_exists()`: Kiểm tra email tồn tại
  - `set_updated_at()`: Auto-update updated_at timestamp
  - `apply_tx_to_balance()`: Tính toán balance cho transactions
  - `trg_accounts_init_balance()`: Set current_balance = opening_balance
  - `audit_row_change()`: Ghi audit log
- Triggers:
  - `on_auth_user_created`: Tạo profile khi user signup
  - `trg_*_updated_at`: Auto-update updated_at (6 tables)
  - `trg_transactions_balance`: Maintain account balance khi CRUD transactions
  - `trg_audit_*`: Ghi audit log (5 tables)
- Basic Indexes: 9 indexes cơ bản (user_id, date, etc.)

**⚠️ Quan trọng:**

- Categories table hỗ trợ system categories (user_id = NULL, is_system = true)
- 15 system categories mặc định (5 income + 10 expense) được tạo tự động
- User có thể tạo custom categories riêng (user_id = UUID)
- Balance được maintain tự động qua trigger
- Audit log tự động cho mọi thao tác INSERT/UPDATE/DELETE

### 02_views.sql

**4 Views:**

1. `v_monthly_cashflow`: Thu chi theo tháng (income, expense, net)
2. `v_category_spend_monthly`: Chi tiêu theo category + tháng (kèm name, color)
3. `v_net_worth`: Tổng tài sản (sum current_balance)
4. `v_budget_status`: Trạng thái ngân sách (spent, remaining, percentage, rollover)

### 03_indexes.sql

**12 Performance Indexes:**

1. `tx_user_date_type_idx`: Support views (DATE_TRUNC queries)
2. `tx_user_type_date_idx`: Filter income/expense by date
3. `budgets_user_category_date_idx`: Budget calculations
4. `recurring_active_next_idx`: Active recurring rules
5. `tx_tags_idx`: GIN index cho tag search
6. `accounts_user_balance_idx`: Sort accounts by balance
7. `alerts_user_unread_idx`: Partial index cho unread alerts
8. `alerts_user_active_idx`: Partial index cho active (non-dismissed) alerts
9. `profiles_timezone_idx`: Timezone queries
10. `tx_user_date_covering_idx`: Covering index (no table lookup)
11. `categories_user_side_idx`: Filter income/expense categories
12. `audit_occurred_at_idx`: Audit reports

### 04_budget_alerts.sql

**Budget Alert Automation:**

- Function `check_budget_alerts()`: Kiểm tra và tạo alerts khi chi tiêu vượt ngưỡng
- Trigger `trg_check_budget_after_tx`: Gọi function sau mỗi INSERT/UPDATE/DELETE trên transactions
- Alert Types:
  - `budget_near_limit`: Khi chi tiêu đạt % alert_threshold_pct
  - `budget_over_limit`: Khi chi tiêu vượt 100% ngân sách

## 🚀 Hướng dẫn setup

```sql
-- 1. Mở Supabase Dashboard → SQL Editor
-- 2. Tạo New Query và paste nội dung 01_schema.sql → Run
-- 3. Tạo New Query và paste nội dung 02_views.sql → Run
-- 4. Tạo New Query và paste nội dung 03_indexes.sql → Run
-- 5. Tạo New Query và paste nội dung 04_budget_alerts.sql → Run
```

**Lưu ý:** 01_schema.sql đã bao gồm 15 system categories mặc định (INSERT với ON CONFLICT DO NOTHING).

## ✅ Verify

Sau khi chạy xong, verify bằng cách:

```sql
-- Kiểm tra tables (nên có 8 tables)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Kiểm tra views (nên có 4 views)
SELECT table_name FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- Kiểm tra indexes
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY indexname;

-- Kiểm tra triggers
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Test functions
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

## 📊 Thống kê

- **Tables**: 8
- **Views**: 4
- **Functions**: 9 (8 core + check_budget_alerts)
- **Triggers**: 14 (13 core + trg_check_budget_after_tx)
- **Indexes**: 22 (9 basic + 12 performance + 1 budget alerts)
- **RLS Policies**: 30+
- **System Categories**: 15 (5 income + 10 expense)
- **Constraints**: CHECK, UNIQUE, Foreign Keys

## ✨ Features

- ✅ Row Level Security (RLS) đầy đủ
- ✅ System categories dùng chung cho tất cả users (giảm overhead DB)
- ✅ User có thể tạo custom categories riêng
- ✅ Auto profile creation với OAuth support
- ✅ Auto balance maintenance qua triggers
- ✅ Auto budget alerts khi vượt ngưỡng chi tiêu
- ✅ Audit logging cho compliance
- ✅ Soft delete pattern
- ✅ Optimized views và indexes
