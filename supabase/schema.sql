-- FreelanceOS schema for Supabase (Postgres)
-- Run this in Supabase SQL Editor

-- Enable extensions if needed
create extension if not exists "pgcrypto";

-- clients
create table if not exists public.clients (
  id text primary key,
  name text not null,
  legal_name text,
  nit text not null,
  sector text,
  city text,
  address text,
  contact_name text,
  contact_role text,
  email text,
  phone text,
  pending_balance numeric(12,2) default 0,
  total_billed numeric(12,2) default 0,
  status text check (status in ('Activo','Pendiente','Inactivo')) default 'Activo',
  avatar_initials text,
  avatar_bg text,
  avatar_color text,
  tax_regime text,
  ica_rate text,
  rete_fuente_rate text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- services
create table if not exists public.services (
  id text primary key,
  title text not null,
  code text,
  category text check (category in ('uiux','dev','consulting')) not null,
  unit text check (unit in ('Hora','Proyecto','Mes')) not null,
  price numeric(12,2) not null,
  iva_text text,
  description text,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- contracts
create table if not exists public.contracts (
  id text primary key,
  number text,
  client_id text references public.clients(id) on delete set null,
  client_name text,
  nit text,
  object text,
  scope text,
  duration text,
  total_value numeric(12,2) default 0,
  payment_schedule text,
  status text check (status in ('Borrador','En ejecución','Firmado')) default 'Borrador',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- contract_clauses
create table if not exists public.contract_clauses (
  id text primary key,
  contract_id text references public.contracts(id) on delete cascade,
  title text,
  icon text,
  content text,
  is_open boolean default false,
  sort_order int default 0
);

-- invoices
create table if not exists public.invoices (
  id text primary key,
  number text,
  client_id text references public.clients(id) on delete set null,
  client_name text,
  nit text,
  date text,
  due_date text,
  amount numeric(12,2) default 0,
  status text check (status in ('Pagada','Enviada','Pendiente','Vencida','Borrador')) default 'Borrador',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- invoice_items
create table if not exists public.invoice_items (
  id text primary key,
  invoice_id text references public.invoices(id) on delete cascade,
  description text,
  quantity text,
  unit_price numeric(12,2) default 0,
  iva_rate numeric(5,2) default 0,
  subtotal numeric(12,2) default 0,
  sort_order int default 0
);

-- cuentas_cobro
create table if not exists public.cuentas_cobro (
  id text primary key,
  number text,
  client_id text references public.clients(id) on delete set null,
  client_name text,
  nit text,
  contract_ref text,
  date text,
  due_date text,
  amount numeric(12,2) default 0,
  concept text,
  status text check (status in ('Pagada','Pendiente','Vencida','Borrador')) default 'Borrador',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- freelancer_profile
create table if not exists public.freelancer_profile (
  id int primary key default 1,
  name text,
  legal_name text,
  doc_type_and_number text,
  nit text,
  regime text,
  ciiu text,
  address text,
  city text,
  phone text,
  email text,
  bank_name text,
  bank_account text,
  masked_account text,
  transfiya_phone text,
  updated_at timestamptz default now()
);

-- updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_clients on public.clients;
create trigger set_updated_at_clients before update on public.clients for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at_services on public.services;
create trigger set_updated_at_services before update on public.services for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at_contracts on public.contracts;
create trigger set_updated_at_contracts before update on public.contracts for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at_invoices on public.invoices;
create trigger set_updated_at_invoices before update on public.invoices for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at_cuentas_cobro on public.cuentas_cobro;
create trigger set_updated_at_cuentas_cobro before update on public.cuentas_cobro for each row execute function public.handle_updated_at();

-- RLS
alter table public.clients enable row level security;
alter table public.services enable row level security;
alter table public.contracts enable row level security;
alter table public.contract_clauses enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.cuentas_cobro enable row level security;
alter table public.freelancer_profile enable row level security;

-- Only signed-in users can read or write. Single-user app: disable sign-ups in
-- Supabase (Authentication > Sign In / Providers > "Allow new users to sign up" off)
-- and create your user by hand, otherwise anyone could register and get access.
-- shortcut: no owner_id per row, all signed-in users share the data; add owner_id = auth.uid() for multi-user.

drop policy if exists "allow_all_clients" on public.clients;
drop policy if exists "authenticated_all_clients" on public.clients;
create policy "authenticated_all_clients" on public.clients for all to authenticated using (true) with check (true);

drop policy if exists "allow_all_services" on public.services;
drop policy if exists "authenticated_all_services" on public.services;
create policy "authenticated_all_services" on public.services for all to authenticated using (true) with check (true);

drop policy if exists "allow_all_contracts" on public.contracts;
drop policy if exists "authenticated_all_contracts" on public.contracts;
create policy "authenticated_all_contracts" on public.contracts for all to authenticated using (true) with check (true);

drop policy if exists "allow_all_contract_clauses" on public.contract_clauses;
drop policy if exists "authenticated_all_contract_clauses" on public.contract_clauses;
create policy "authenticated_all_contract_clauses" on public.contract_clauses for all to authenticated using (true) with check (true);

drop policy if exists "allow_all_invoices" on public.invoices;
drop policy if exists "authenticated_all_invoices" on public.invoices;
create policy "authenticated_all_invoices" on public.invoices for all to authenticated using (true) with check (true);

drop policy if exists "allow_all_invoice_items" on public.invoice_items;
drop policy if exists "authenticated_all_invoice_items" on public.invoice_items;
create policy "authenticated_all_invoice_items" on public.invoice_items for all to authenticated using (true) with check (true);

drop policy if exists "allow_all_cuentas_cobro" on public.cuentas_cobro;
drop policy if exists "authenticated_all_cuentas_cobro" on public.cuentas_cobro;
create policy "authenticated_all_cuentas_cobro" on public.cuentas_cobro for all to authenticated using (true) with check (true);

drop policy if exists "allow_all_freelancer_profile" on public.freelancer_profile;
drop policy if exists "authenticated_all_freelancer_profile" on public.freelancer_profile;
create policy "authenticated_all_freelancer_profile" on public.freelancer_profile for all to authenticated using (true) with check (true);
