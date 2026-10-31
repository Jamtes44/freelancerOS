-- One-time migration: adds the signature column used by Configuración > Firma.
-- Run it once in the Supabase SQL Editor on a database created before this column existed.
alter table public.freelancer_profile add column if not exists signature text;
