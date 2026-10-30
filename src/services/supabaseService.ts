import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  INITIAL_CLIENTS,
  INITIAL_INVOICES,
  INITIAL_CUENTAS_COBRO,
  INITIAL_SERVICES,
  INITIAL_CONTRACT,
  INITIAL_FREELANCER_PROFILE,
} from '../data/mockData';
import { Client, Invoice, CuentaCobro, ServiceItem, Contract } from '../types';

// Mock data is only used when Supabase is not configured. Real errors are thrown
// so the UI can show them instead of silently displaying fake data.

const toClient = (row: any): Client => ({
  id: row.id,
  name: row.name,
  legalName: row.legal_name ?? undefined,
  nit: row.nit,
  sector: row.sector ?? '',
  city: row.city ?? '',
  address: row.address ?? '',
  contactName: row.contact_name ?? '',
  contactRole: row.contact_role ?? undefined,
  email: row.email ?? '',
  phone: row.phone ?? '',
  pendingBalance: Number(row.pending_balance ?? 0),
  totalBilled: Number(row.total_billed ?? 0),
  status: row.status,
  avatarInitials: row.avatar_initials ?? '',
  avatarBg: row.avatar_bg ?? undefined,
  avatarColor: row.avatar_color ?? undefined,
  taxRegime: row.tax_regime ?? undefined,
  icaRate: row.ica_rate ?? undefined,
  reteFuenteRate: row.rete_fuente_rate ?? undefined,
});

export async function getClients(): Promise<Client[]> {
  if (!isSupabaseConfigured) return INITIAL_CLIENTS;
  const { data, error } = await supabase.from('clients').select('*').order('name');
  if (error) throw error;
  return (data ?? []).map(toClient);
}

export async function getInvoices(): Promise<Invoice[]> {
  if (!isSupabaseConfigured) return INITIAL_INVOICES;
  const { data, error } = await supabase.from('invoices').select('*').order('id');
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    id: row.id,
    number: row.number,
    clientId: row.client_id,
    clientName: row.client_name,
    nit: row.nit,
    date: row.date,
    dueDate: row.due_date,
    amount: Number(row.amount ?? 0),
    status: row.status,
  }));
}

export async function getCuentasCobro(): Promise<CuentaCobro[]> {
  if (!isSupabaseConfigured) return INITIAL_CUENTAS_COBRO;
  const { data, error } = await supabase.from('cuentas_cobro').select('*').order('date', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    id: row.id,
    number: row.number,
    clientId: row.client_id,
    clientName: row.client_name,
    nit: row.nit,
    contractRef: row.contract_ref,
    date: row.date,
    dueDate: row.due_date,
    amount: Number(row.amount ?? 0),
    concept: row.concept,
    status: row.status,
  }));
}

export async function getServices(): Promise<ServiceItem[]> {
  if (!isSupabaseConfigured) return INITIAL_SERVICES;
  const { data, error } = await supabase.from('services').select('*').order('id');
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    code: row.code,
    category: row.category,
    unit: row.unit,
    price: Number(row.price ?? 0),
    ivaText: row.iva_text,
    description: row.description,
    tags: row.tags ?? [],
  }));
}

/** Returns null when there is no contract stored yet. */
export async function getContract(): Promise<Contract | null> {
  if (!isSupabaseConfigured) return INITIAL_CONTRACT;
  const { data: contractRow, error: cErr } = await supabase.from('contracts').select('*').limit(1).maybeSingle();
  if (cErr) throw cErr;
  if (!contractRow) return null;
  const { data: clauses, error: clErr } = await supabase
    .from('contract_clauses')
    .select('*')
    .eq('contract_id', contractRow.id)
    .order('sort_order');
  if (clErr) throw clErr;
  return {
    id: contractRow.id,
    number: contractRow.number,
    clientId: contractRow.client_id,
    clientName: contractRow.client_name,
    nit: contractRow.nit,
    object: contractRow.object,
    scope: contractRow.scope,
    duration: contractRow.duration,
    totalValue: Number(contractRow.total_value ?? 0),
    paymentSchedule: contractRow.payment_schedule,
    status: contractRow.status,
    clauses: (clauses ?? []).map((cl: any) => ({
      id: cl.id,
      title: cl.title,
      icon: cl.icon,
      content: cl.content,
      isOpen: cl.is_open,
    })),
  };
}

/** Returns null when the profile row does not exist yet. */
export async function getFreelancerProfile() {
  if (!isSupabaseConfigured) return INITIAL_FREELANCER_PROFILE;
  const { data, error } = await supabase.from('freelancer_profile').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    name: data.name,
    legalName: data.legal_name,
    docTypeAndNumber: data.doc_type_and_number,
    nit: data.nit,
    regime: data.regime,
    ciiu: data.ciiu,
    address: data.address,
    city: data.city,
    phone: data.phone,
    email: data.email,
    bankName: data.bank_name,
    bankAccount: data.bank_account,
    maskedAccount: data.masked_account,
    transfiyaPhone: data.transfiya_phone,
  };
}

/** In mock mode the client is returned as-is (kept only in memory). */
export async function createClient(client: Client): Promise<Client> {
  if (!isSupabaseConfigured) return client;
  const payload: any = {
    id: client.id,
    name: client.name,
    legal_name: client.legalName,
    nit: client.nit,
    sector: client.sector,
    city: client.city,
    address: client.address,
    contact_name: client.contactName,
    contact_role: client.contactRole,
    email: client.email,
    phone: client.phone,
    pending_balance: client.pendingBalance,
    total_billed: client.totalBilled,
    status: client.status,
    avatar_initials: client.avatarInitials,
    avatar_bg: client.avatarBg,
    avatar_color: client.avatarColor,
    tax_regime: client.taxRegime,
    ica_rate: client.icaRate,
    rete_fuente_rate: client.reteFuenteRate,
  };
  const { data, error } = await supabase.from('clients').insert(payload).select().single();
  if (error) throw error;
  return toClient(data);
}

export async function updateClient(id: string, client: Partial<Client>) {
  if (!isSupabaseConfigured) return null;
  const payload: any = {
    name: client.name,
    legal_name: client.legalName,
    nit: client.nit,
    sector: client.sector,
    city: client.city,
    address: client.address,
    contact_name: client.contactName,
    contact_role: client.contactRole,
    email: client.email,
    phone: client.phone,
    pending_balance: client.pendingBalance,
    total_billed: client.totalBilled,
    status: client.status,
    avatar_initials: client.avatarInitials,
    avatar_bg: client.avatarBg,
    avatar_color: client.avatarColor,
    tax_regime: client.taxRegime,
    ica_rate: client.icaRate,
    rete_fuente_rate: client.reteFuenteRate,
  };
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
  const { data, error } = await supabase.from('clients').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteClient(id: string) {
  if (!isSupabaseConfigured) return null;
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw error;
  return true;
}
