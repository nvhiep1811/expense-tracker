-- =====================================================================
-- Expense Tracker - Supabase Migration (schema + RLS + triggers + views)
-- Updated: 2026-01-30
-- Notes:
-- - Includes: profiles, accounts, categories, transactions, budgets, alerts,
--            recurring_rules, audit_log
-- - Includes RLS policies, updated_at triggers, balance maintenance trigger,
--            audit log trigger, and reporting views.
-- =====================================================================

-- ---------------------------
-- Extensions (usually enabled in Supabase)
-- ---------------------------
create extension if not exists pgcrypto;

-- ---------------------------
-- Enums
-- ---------------------------
do $$ begin
  create type public.account_type as enum ('cash','bank','e_wallet');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.tx_type as enum ('income','expense','transfer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.category_side as enum ('income','expense');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.budget_period as enum ('weekly','monthly','yearly');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.alert_type as enum (
    'budget_near_limit',
    'budget_over_limit',
    'recurring_reminder',
    'account_low_balance',
    'goal_achieved'
  );
exception when duplicate_object then null; end $$;

-- Add new alert types if enum already exists
do $$ begin
  ALTER TYPE public.alert_type ADD VALUE IF NOT EXISTS 'recurring_reminder';
exception when duplicate_object then null; end $$;

do $$ begin
  ALTER TYPE public.alert_type ADD VALUE IF NOT EXISTS 'account_low_balance';
exception when duplicate_object then null; end $$;

do $$ begin
  ALTER TYPE public.alert_type ADD VALUE IF NOT EXISTS 'goal_achieved';
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.recurring_freq as enum ('daily','weekly','monthly','yearly');
exception when duplicate_object then null; end $$;

-- =====================================================================
-- TABLE: profiles (1-1 with auth.users)
-- =====================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,
  avatar_url text,

  default_currency text not null default 'VND',
  timezone text not null default 'Asia/Ho_Chi_Minh',
  month_start_day int not null default 1 check (month_start_day between 1 and 28),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- RLS policies: profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Function to auto-create profile when a new user signs up
-- Uses UPSERT to handle case where profile already exists (e.g., email user logs in with OAuth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  avatar text;
  user_name text;
begin
  -- Get avatar_url from OAuth metadata (Google, Facebook, etc.)
  -- Google uses: avatar_url or picture
  -- Facebook uses: avatar_url or picture.data.url
  avatar := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture',
    new.raw_user_meta_data->'picture'->'data'->>'url'
  );

  -- Get name from OAuth metadata
  user_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  -- Use UPSERT: Insert new profile or update existing one with OAuth data
  insert into public.profiles (id, full_name, avatar_url, default_currency, timezone, month_start_day)
  values (
    new.id,
    user_name,
    avatar,
    'VND',
    'Asia/Ho_Chi_Minh',
    1
  )
  on conflict (id) do update set
    -- Only update avatar_url if it was null and OAuth provides one
    avatar_url = coalesce(profiles.avatar_url, excluded.avatar_url),
    -- Only update full_name if it was null/default and OAuth provides one
    full_name = case 
      when profiles.full_name is null or profiles.full_name = split_part(new.email, '@', 1)
      then coalesce(excluded.full_name, profiles.full_name)
      else profiles.full_name
    end,
    updated_at = now();

  -- NOTE: Default categories are now system-wide (user_id = NULL)
  -- No need to create per-user categories anymore

  return new;
end;
$$;

-- DEPRECATED: Function create_default_categories
-- Default categories are now system-wide (user_id = NULL) in 05_system_categories.sql
-- Keeping empty function for backward compatibility
create or replace function public.create_default_categories(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- No longer needed - system categories are shared across all users
  -- See 05_system_categories.sql for system category definitions
  null;
end $$;

-- Function check email existence before creating profile
CREATE OR REPLACE FUNCTION public.check_email_exists(email_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE email = email_input
  ) INTO email_exists;
  
  RETURN email_exists;
END;
$$;

-- Trigger to call the function after insert on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- TABLE: accounts
-- =====================================================================
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  name text not null,
  type public.account_type not null,
  color text,
  currency text not null default 'VND',

  opening_balance bigint not null default 0,
  current_balance bigint not null default 0,

  is_archived boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists accounts_user_idx
  on public.accounts(user_id) where deleted_at is null;

alter table public.accounts enable row level security;

-- RLS policies: accounts
drop policy if exists "accounts_select_own" on public.accounts;
create policy "accounts_select_own"
on public.accounts for select
using (auth.uid() = user_id);

drop policy if exists "accounts_insert_own" on public.accounts;
create policy "accounts_insert_own"
on public.accounts for insert
with check (auth.uid() = user_id);

drop policy if exists "accounts_update_own" on public.accounts;
create policy "accounts_update_own"
on public.accounts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "accounts_delete_own" on public.accounts;
create policy "accounts_delete_own"
on public.accounts for delete
using (auth.uid() = user_id);

-- =====================================================================
-- TABLE: categories
-- NOTE: System categories have user_id = NULL and is_system = true
-- =====================================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- NULL for system categories

  name text not null,
  side public.category_side not null default 'expense', -- income|expense

  icon text,
  color text,
  parent_id uuid references public.categories(id),
  sort_order int not null default 0,
  is_system boolean not null default false, -- true for shared system categories

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Unique constraint for user-specific categories
create unique index if not exists categories_user_name_side_unique 
  on public.categories (user_id, name, side) 
  where user_id is not null and deleted_at is null;

-- Unique constraint for system categories (where user_id is NULL)
create unique index if not exists categories_system_name_side_unique 
  on public.categories (name, side) 
  where user_id is null and deleted_at is null;

create index if not exists categories_user_idx
  on public.categories(user_id) where deleted_at is null;

alter table public.categories enable row level security;

-- RLS policies: categories (updated for system categories)
drop policy if exists "categories_select_own" on public.categories;
drop policy if exists "categories_select_own_and_system" on public.categories;
create policy "categories_select_own_and_system"
on public.categories for select
using (
  user_id is null  -- System categories visible to all
  or auth.uid() = user_id  -- User's own categories
);

drop policy if exists "categories_insert_own" on public.categories;
create policy "categories_insert_own"
on public.categories for insert
with check (auth.uid() = user_id);

drop policy if exists "categories_update_own" on public.categories;
create policy "categories_update_own"
on public.categories for update
using (auth.uid() = user_id and user_id is not null)
with check (auth.uid() = user_id and user_id is not null);

drop policy if exists "categories_delete_own" on public.categories;
create policy "categories_delete_own"
on public.categories for delete
using (auth.uid() = user_id and user_id is not null);

-- Insert default system categories (idempotent - uses ON CONFLICT)
INSERT INTO public.categories (user_id, name, side, icon, color, sort_order, is_system)
VALUES 
  -- Income categories
  (NULL, 'Lương chính', 'income', '💰', '#10B981', 1, true),
  (NULL, 'Lương thêm', 'income', '💵', '#34D399', 2, true),
  (NULL, 'Tiền thưởng', 'income', '🎁', '#6EE7B7', 3, true),
  (NULL, 'Lãi suất', 'income', '📈', '#A7F3D0', 4, true),
  (NULL, 'Thu nhập khác', 'income', '📊', '#D1FAE5', 5, true),
  -- Expense categories  
  (NULL, 'Ăn uống', 'expense', '🍔', '#EF4444', 1, true),
  (NULL, 'Mua sắm', 'expense', '🛍️', '#F87171', 2, true),
  (NULL, 'Giao thông', 'expense', '🚗', '#FB7185', 3, true),
  (NULL, 'Giải trí', 'expense', '🎬', '#FCA5A5', 4, true),
  (NULL, 'Điện, nước, gas', 'expense', '💡', '#FDCAC1', 5, true),
  (NULL, 'Sức khỏe', 'expense', '🏥', '#FED7AA', 6, true),
  (NULL, 'Giáo dục', 'expense', '📚', '#FCD34D', 7, true),
  (NULL, 'Nhà ở', 'expense', '🏠', '#FBBF24', 8, true),
  (NULL, 'Bảo hiểm', 'expense', '🛡️', '#F59E0B', 9, true),
  (NULL, 'Chi tiêu khác', 'expense', '📌', '#D97706', 10, true)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- TABLE: recurring_rules
-- =====================================================================
create table if not exists public.recurring_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  type public.tx_type not null, -- should be income|expense; enforce via check below
  amount bigint not null check (amount > 0),

  account_id uuid not null references public.accounts(id),
  category_id uuid references public.categories(id),

  description text,

  freq public.recurring_freq not null,
  interval int not null default 1 check (interval >= 1),
  byweekday int[],        -- optional for weekly (1..7)
  bymonthday int,         -- optional for monthly (1..28/29/30/31 - validate in app)

  start_on date not null,
  end_on date,
  last_generated_on date,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  constraint recurring_rules_type_check check (type in ('income','expense'))
);

create index if not exists recurring_rules_user_idx
  on public.recurring_rules(user_id) where deleted_at is null;

alter table public.recurring_rules enable row level security;

-- RLS policies: recurring_rules
drop policy if exists "recurring_select_own" on public.recurring_rules;
create policy "recurring_select_own"
on public.recurring_rules for select
using (auth.uid() = user_id);

drop policy if exists "recurring_insert_own" on public.recurring_rules;
create policy "recurring_insert_own"
on public.recurring_rules for insert
with check (auth.uid() = user_id);

drop policy if exists "recurring_update_own" on public.recurring_rules;
create policy "recurring_update_own"
on public.recurring_rules for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "recurring_delete_own" on public.recurring_rules;
create policy "recurring_delete_own"
on public.recurring_rules for delete
using (auth.uid() = user_id);

-- =====================================================================
-- TABLE: transactions
-- =====================================================================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  type public.tx_type not null,
  amount bigint not null check (amount > 0),
  occurred_on date not null,

  account_id uuid not null references public.accounts(id),
  category_id uuid references public.categories(id),

  description text,
  note text,

  tags text[],
  attachments jsonb not null default '{}'::jsonb,

  -- transfer fields
  transfer_account_id uuid references public.accounts(id),

  -- recurring link
  recurring_rule_id uuid references public.recurring_rules(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  -- basic consistency checks
  constraint tx_transfer_requires_target check (
    (type <> 'transfer' and transfer_account_id is null)
    or
    (type = 'transfer' and transfer_account_id is not null and transfer_account_id <> account_id)
  ),
  
  -- Category should not be set for transfers
  constraint tx_transfer_no_category check (
    (type = 'transfer' and category_id is null)
    or
    (type <> 'transfer')
  )
);

create index if not exists tx_user_date_idx
  on public.transactions(user_id, occurred_on desc) where deleted_at is null;

create index if not exists tx_user_account_idx
  on public.transactions(user_id, account_id) where deleted_at is null;

create index if not exists tx_user_category_idx
  on public.transactions(user_id, category_id) where deleted_at is null;

alter table public.transactions enable row level security;

-- RLS policies: transactions
drop policy if exists "tx_select_own" on public.transactions;
create policy "tx_select_own"
on public.transactions for select
using (auth.uid() = user_id);

drop policy if exists "tx_insert_own" on public.transactions;
create policy "tx_insert_own"
on public.transactions for insert
with check (auth.uid() = user_id);

drop policy if exists "tx_update_own" on public.transactions;
create policy "tx_update_own"
on public.transactions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "tx_delete_own" on public.transactions;
create policy "tx_delete_own"
on public.transactions for delete
using (auth.uid() = user_id);

-- =====================================================================
-- TABLE: budgets
-- =====================================================================
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  category_id uuid not null references public.categories(id),

  period public.budget_period not null default 'monthly',
  start_date date not null,
  end_date date not null,

  limit_amount bigint not null check (limit_amount >= 0),
  alert_threshold_pct int not null default 80 check (alert_threshold_pct between 1 and 100),
  rollover boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  constraint budgets_date_range check (start_date <= end_date),
  unique(user_id, category_id, start_date, end_date)
);

create index if not exists budgets_user_range_idx
  on public.budgets(user_id, start_date, end_date) where deleted_at is null;

alter table public.budgets enable row level security;

-- RLS policies: budgets
drop policy if exists "budgets_select_own" on public.budgets;
create policy "budgets_select_own"
on public.budgets for select
using (auth.uid() = user_id);

drop policy if exists "budgets_insert_own" on public.budgets;
create policy "budgets_insert_own"
on public.budgets for insert
with check (auth.uid() = user_id);

drop policy if exists "budgets_update_own" on public.budgets;
create policy "budgets_update_own"
on public.budgets for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "budgets_delete_own" on public.budgets;
create policy "budgets_delete_own"
on public.budgets for delete
using (auth.uid() = user_id);

-- =====================================================================
-- TABLE: alerts
-- =====================================================================
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  type public.alert_type not null,
  budget_id uuid references public.budgets(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,

  payload jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  dismissed_at timestamptz,
  occurred_at timestamptz not null default now()
);

-- Add dismissed_at column if table already exists
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS dismissed_at timestamptz;

create index if not exists alerts_user_time_idx
  on public.alerts(user_id, occurred_at desc);

alter table public.alerts enable row level security;

-- RLS policies: alerts
drop policy if exists "alerts_select_own" on public.alerts;
create policy "alerts_select_own"
on public.alerts for select
using (auth.uid() = user_id);

drop policy if exists "alerts_insert_own" on public.alerts;
create policy "alerts_insert_own"
on public.alerts for insert
with check (auth.uid() = user_id);

drop policy if exists "alerts_update_own" on public.alerts;
create policy "alerts_update_own"
on public.alerts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "alerts_delete_own" on public.alerts;
create policy "alerts_delete_own"
on public.alerts for delete
using (auth.uid() = user_id);

-- =====================================================================
-- TABLE: audit_log (append-only)
-- =====================================================================
create table if not exists public.audit_log (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,

  table_name text not null,
  row_id uuid,
  action text not null, -- INSERT/UPDATE/DELETE/SOFT_DELETE
  changes jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists audit_user_time_idx
  on public.audit_log(user_id, occurred_at desc);

alter table public.audit_log enable row level security;

-- RLS policies: audit_log (read-only own)
drop policy if exists "audit_select_own" on public.audit_log;
create policy "audit_select_own"
on public.audit_log for select
using (auth.uid() = user_id);

-- No write policies on purpose; triggers write via SECURITY DEFINER.

-- =====================================================================
-- COMMON TRIGGER: updated_at
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_accounts_updated_at on public.accounts;
create trigger trg_accounts_updated_at
before update on public.accounts
for each row execute function public.set_updated_at();

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_transactions_updated_at on public.transactions;
create trigger trg_transactions_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

drop trigger if exists trg_budgets_updated_at on public.budgets;
create trigger trg_budgets_updated_at
before update on public.budgets
for each row execute function public.set_updated_at();

drop trigger if exists trg_recurring_updated_at on public.recurring_rules;
create trigger trg_recurring_updated_at
before update on public.recurring_rules
for each row execute function public.set_updated_at();

-- =====================================================================
-- TRIGGER: Maintain account current_balance from transactions
-- =====================================================================
create or replace function public.apply_tx_to_balance(
  p_type public.tx_type,
  p_amount bigint,
  p_account uuid,
  p_transfer uuid,
  p_sign int
)
returns void
language plpgsql
as $$
declare
  delta bigint;
begin
  delta := p_amount * p_sign;

  if p_type = 'income' then
    update public.accounts
      set current_balance = current_balance + delta
      where id = p_account;

  elsif p_type = 'expense' then
    update public.accounts
      set current_balance = current_balance - delta
      where id = p_account;

  elsif p_type = 'transfer' then
    update public.accounts
      set current_balance = current_balance - delta
      where id = p_account;

    update public.accounts
      set current_balance = current_balance + delta
      where id = p_transfer;
  end if;
end $$;

create or replace function public.trg_transactions_balance()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'INSERT') then
    if new.deleted_at is null then
      perform public.apply_tx_to_balance(new.type, new.amount, new.account_id, new.transfer_account_id, 1);
    end if;
    return new;

  elsif (tg_op = 'UPDATE') then
    if old.deleted_at is null then
      perform public.apply_tx_to_balance(old.type, old.amount, old.account_id, old.transfer_account_id, -1);
    end if;

    if new.deleted_at is null then
      perform public.apply_tx_to_balance(new.type, new.amount, new.account_id, new.transfer_account_id, 1);
    end if;

    return new;

  elsif (tg_op = 'DELETE') then
    if old.deleted_at is null then
      perform public.apply_tx_to_balance(old.type, old.amount, old.account_id, old.transfer_account_id, -1);
    end if;
    return old;
  end if;

  return null;
end $$;

drop trigger if exists trg_transactions_balance on public.transactions;
create trigger trg_transactions_balance
after insert or update or delete on public.transactions
for each row execute function public.trg_transactions_balance();

-- =====================================================================
-- TRIGGER: Set current_balance = opening_balance for new accounts
-- =====================================================================
create or replace function public.trg_accounts_init_balance()
returns trigger
language plpgsql
as $$
begin
  -- Set current_balance to opening_balance when creating a new account
  new.current_balance := new.opening_balance;
  return new;
end $$;

drop trigger if exists trg_accounts_init_balance on public.accounts;
create trigger trg_accounts_init_balance
before insert on public.accounts
for each row execute function public.trg_accounts_init_balance();

-- =====================================================================
-- TRIGGER: Audit log for key tables
-- =====================================================================
create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
  v_row_id uuid;
  v_action text;
  v_changes jsonb;
begin
  if (tg_op = 'INSERT') then
    v_action := 'INSERT';
    v_changes := to_jsonb(new);
    v_row_id := new.id;
    v_user := new.user_id;

  elsif (tg_op = 'UPDATE') then
    if old.deleted_at is null and new.deleted_at is not null then
      v_action := 'SOFT_DELETE';
    else
      v_action := 'UPDATE';
    end if;

    v_changes := jsonb_build_object(
      'old', to_jsonb(old),
      'new', to_jsonb(new)
    );
    v_row_id := new.id;
    v_user := new.user_id;

  elsif (tg_op = 'DELETE') then
    v_action := 'DELETE';
    v_changes := to_jsonb(old);
    v_row_id := old.id;
    v_user := old.user_id;
  end if;

  insert into public.audit_log(user_id, table_name, row_id, action, changes)
  values (v_user, tg_table_name, v_row_id, v_action, v_changes);

  return coalesce(new, old);
end $$;

-- (Re)create audit triggers deterministically
drop trigger if exists trg_audit_accounts on public.accounts;
create trigger trg_audit_accounts
after insert or update or delete on public.accounts
for each row execute function public.audit_row_change();

drop trigger if exists trg_audit_categories on public.categories;
create trigger trg_audit_categories
after insert or update or delete on public.categories
for each row execute function public.audit_row_change();

drop trigger if exists trg_audit_transactions on public.transactions;
create trigger trg_audit_transactions
after insert or update or delete on public.transactions
for each row execute function public.audit_row_change();

drop trigger if exists trg_audit_budgets on public.budgets;
create trigger trg_audit_budgets
after insert or update or delete on public.budgets
for each row execute function public.audit_row_change();

drop trigger if exists trg_audit_recurring_rules on public.recurring_rules;
create trigger trg_audit_recurring_rules
after insert or update or delete on public.recurring_rules
for each row execute function public.audit_row_change();

-- =====================================================================
-- End of Schema
-- Note: Views are in database/02_views.sql
-- Note: Indexes are in database/03_indexes.sql
-- =====================================================================
