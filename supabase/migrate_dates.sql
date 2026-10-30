-- One-time migration: turn the text date columns into real `date` columns.
-- Run it once in the Supabase SQL Editor on a database created with the old schema.
-- It understands both formats the app used to store: '2025-05-28' and '22 Oct 2024'.
-- Any other value makes the whole statement fail and nothing is changed.

alter table public.invoices
  alter column date type date using (
    case when nullif(trim(date), '') is null then null when date ~ '^\d{4}-\d{2}-\d{2}$' then date::date else to_date(date, 'DD Mon YYYY') end
  ),
  alter column due_date type date using (
    case when nullif(trim(due_date), '') is null then null when due_date ~ '^\d{4}-\d{2}-\d{2}$' then due_date::date else to_date(due_date, 'DD Mon YYYY') end
  );

alter table public.cuentas_cobro
  alter column date type date using (
    case when nullif(trim(date), '') is null then null when date ~ '^\d{4}-\d{2}-\d{2}$' then date::date else to_date(date, 'DD Mon YYYY') end
  ),
  alter column due_date type date using (
    case when nullif(trim(due_date), '') is null then null when due_date ~ '^\d{4}-\d{2}-\d{2}$' then due_date::date else to_date(due_date, 'DD Mon YYYY') end
  );
