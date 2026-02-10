-- =====================================================================
-- Expense Tracker - Budget Alerts Enhancement
-- Run after 01_schema.sql
-- Description: Add functions to automatically create budget alerts
-- =====================================================================

-- Add new alert types if not exists (budget_ending_soon for future use)
DO $$ BEGIN
  -- First check if enum exists and add new values if needed
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type') THEN
    -- Budget ending soon alert (optional - for future implementation)
    BEGIN
      ALTER TYPE public.alert_type ADD VALUE IF NOT EXISTS 'budget_ending_soon';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- =====================================================================
-- FUNCTION: Check and create budget alerts for a user
-- This can be called periodically or after transaction changes
-- =====================================================================
CREATE OR REPLACE FUNCTION public.check_budget_alerts(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_budget RECORD;
  v_existing_alert_count int;
  v_today date := CURRENT_DATE;
  v_alert_type public.alert_type;
BEGIN
  -- Loop through all active budgets for this user
  FOR v_budget IN
    SELECT
      b.id AS budget_id,
      b.user_id,
      b.category_id,
      b.period,
      b.start_date,
      b.end_date,
      b.limit_amount,
      b.alert_threshold_pct,
      c.name AS category_name,
      COALESCE(t.spent, 0) AS spent,
      b.limit_amount - COALESCE(t.spent, 0) AS remaining,
      CASE 
        WHEN b.limit_amount > 0 
        THEN (COALESCE(t.spent, 0)::decimal / b.limit_amount * 100)
        ELSE 0 
      END AS percentage
    FROM public.budgets b
    LEFT JOIN public.categories c ON c.id = b.category_id AND c.deleted_at IS NULL
    LEFT JOIN (
      SELECT
        tx.category_id,
        tx.user_id,
        b2.id AS budget_id,
        SUM(tx.amount) AS spent
      FROM public.transactions tx
      INNER JOIN public.budgets b2 ON 
        b2.user_id = tx.user_id 
        AND b2.category_id = tx.category_id
        AND tx.occurred_on >= b2.start_date 
        AND tx.occurred_on <= b2.end_date
        AND b2.deleted_at IS NULL
      WHERE tx.type = 'expense' AND tx.deleted_at IS NULL
      GROUP BY tx.category_id, tx.user_id, b2.id
    ) t ON t.budget_id = b.id
    WHERE b.user_id = p_user_id
      AND b.deleted_at IS NULL
      AND v_today BETWEEN b.start_date AND b.end_date
  LOOP
    -- Determine alert type based on percentage
    IF v_budget.percentage >= 100 THEN
      v_alert_type := 'budget_over_limit';
    ELSIF v_budget.percentage >= v_budget.alert_threshold_pct THEN
      v_alert_type := 'budget_near_limit';
    ELSE
      CONTINUE; -- No alert needed
    END IF;

    -- Check if we already created an alert for this budget today
    SELECT COUNT(*) INTO v_existing_alert_count
    FROM public.alerts
    WHERE user_id = p_user_id
      AND budget_id = v_budget.budget_id
      AND type = v_alert_type
      AND occurred_at::date = v_today;

    -- Only create alert if none exists today
    IF v_existing_alert_count = 0 THEN
      INSERT INTO public.alerts (
        user_id,
        type,
        budget_id,
        category_id,
        payload,
        is_read,
        occurred_at
      ) VALUES (
        p_user_id,
        v_alert_type,
        v_budget.budget_id,
        v_budget.category_id,
        jsonb_build_object(
          'budget_id', v_budget.budget_id,
          'category_id', v_budget.category_id,
          'category_name', v_budget.category_name,
          'spent', v_budget.spent,
          'limit_amount', v_budget.limit_amount,
          'percentage', v_budget.percentage,
          'remaining', v_budget.remaining,
          'period', v_budget.period
        ),
        false,
        NOW()
      );
    END IF;
  END LOOP;
END $$;

-- =====================================================================
-- TRIGGER: Automatically check budget alerts after expense transactions
-- =====================================================================
CREATE OR REPLACE FUNCTION public.trg_check_budget_alerts_after_tx()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only check for expense transactions
  IF TG_OP = 'INSERT' THEN
    IF NEW.type = 'expense' AND NEW.deleted_at IS NULL THEN
      PERFORM public.check_budget_alerts(NEW.user_id);
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.type = 'expense' OR OLD.type = 'expense' THEN
      PERFORM public.check_budget_alerts(NEW.user_id);
    END IF;
  END IF;
  
  RETURN NULL; -- AFTER trigger, return value is ignored
END $$;

-- Create the trigger for automatic budget alerts
-- This ensures alerts are created regardless of how transactions are inserted
DROP TRIGGER IF EXISTS trg_check_budget_alerts_on_tx ON public.transactions;
CREATE TRIGGER trg_check_budget_alerts_on_tx
  AFTER INSERT OR UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_check_budget_alerts_after_tx();

-- =====================================================================
-- Add index for faster alert queries
-- =====================================================================
CREATE INDEX IF NOT EXISTS alerts_budget_date_idx
  ON public.alerts(budget_id, occurred_at)
  WHERE budget_id IS NOT NULL;

-- =====================================================================
-- End of Budget Alerts Enhancement
-- =====================================================================
