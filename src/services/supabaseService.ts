import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  INITIAL_CLIENTS,
  INITIAL_INVOICES,
  INITIAL_CUENTAS_COBRO,
  INITIAL_SERVICES,
  INITIAL_CONTRACT,
  INITIAL_FREELANCER_PROFILE,
} from '../data/mockData';
import { Client, Invoice, InvoiceItem, CuentaCobro, ServiceItem, Contract, FreelancerProfile } from '../types';

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
  // Newest first; id breaks ties for rows inserted together (e.g. the seed).
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });
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

/** Creates or updates a catalog service (same id = update). In mock mode nothing is persisted. */
export async function saveService(s: ServiceItem): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('services').upsert({
    id: s.id,
    title: s.title,
    code: s.code,
    category: s.category,
    unit: s.unit,
    price: s.price,
    iva_text: s.ivaText,
    description: s.description,
    tags: s.tags,
  });
  if (error) throw error;
}

export async function deleteService(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}

/** All saved contracts with their clauses, newest first. Mock mode returns the template contract. */
export async function getContracts(): Promise<Contract[]> {
  if (!isSupabaseConfigured) return [INITIAL_CONTRACT];
  const [{ data: rows, error: cErr }, { data: clauses, error: clErr }] = await Promise.all([
    supabase.from('contracts').select('*').order('created_at', { ascending: false }),
    supabase.from('contract_clauses').select('*').order('sort_order'),
  ]);
  if (cErr) throw cErr;
  if (clErr) throw clErr;
  return (rows ?? []).map((row: any) => ({
    id: row.id,
    number: row.number,
    clientId: row.client_id,
    clientName: row.client_name,
    nit: row.nit,
    object: row.object,
    scope: row.scope,
    duration: row.duration,
    totalValue: Number(row.total_value ?? 0),
    paymentSchedule: row.payment_schedule,
    status: row.status,
    date: row.created_at ? String(row.created_at).slice(0, 10) : '',
    clauses: (clauses ?? [])
      .filter((cl: any) => cl.contract_id === row.id)
      .map((cl: any) => ({ id: cl.id, title: cl.title, icon: cl.icon, content: cl.content, isOpen: cl.is_open })),
  }));
}

/** Saves a new contract and its clauses. In mock mode it is returned as-is (kept only in memory). */
export async function createContract(c: Contract): Promise<Contract> {
  if (!isSupabaseConfigured) return c;
  const { error } = await supabase.from('contracts').insert({
    id: c.id,
    number: c.number,
    client_id: c.clientId,
    client_name: c.clientName,
    nit: c.nit,
    object: c.object,
    scope: c.scope,
    duration: c.duration,
    total_value: c.totalValue,
    payment_schedule: c.paymentSchedule,
    status: c.status,
  });
  if (error) throw error;
  const { error: clausesError } = await supabase.from('contract_clauses').insert(
    c.clauses.map((cl, i) => ({
      id: crypto.randomUUID(),
      contract_id: c.id,
      title: cl.title,
      icon: cl.icon,
      content: cl.content,
      is_open: false,
      sort_order: i,
    }))
  );
  if (clausesError) {
    // No transaction across the two inserts: remove the header so no contract is left without clauses.
    await supabase.from('contracts').delete().eq('id', c.id);
    throw clausesError;
  }
  return c;
}

/** Returns null when the profile row does not exist yet. */
export async function getFreelancerProfile(): Promise<FreelancerProfile | null> {
  if (!isSupabaseConfigured) return INITIAL_FREELANCER_PROFILE;
  const { data, error } = await supabase.from('freelancer_profile').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    name: data.name ?? '',
    legalName: data.legal_name ?? '',
    docTypeAndNumber: data.doc_type_and_number ?? '',
    nit: data.nit ?? '',
    regime: data.regime ?? '',
    ciiu: data.ciiu ?? '',
    address: data.address ?? '',
    city: data.city ?? '',
    phone: data.phone ?? '',
    email: data.email ?? '',
    bankName: data.bank_name ?? '',
    bankAccount: data.bank_account ?? '',
    maskedAccount: data.masked_account ?? '',
    transfiyaPhone: data.transfiya_phone ?? '',
    signature: data.signature ?? '',
  };
}

/** Single-row table: the profile always lives at id = 1. In mock mode nothing is persisted. */
export async function saveFreelancerProfile(p: FreelancerProfile): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('freelancer_profile').upsert({
    id: 1,
    name: p.name,
    legal_name: p.legalName,
    doc_type_and_number: p.docTypeAndNumber,
    nit: p.nit,
    regime: p.regime,
    ciiu: p.ciiu,
    address: p.address,
    city: p.city,
    phone: p.phone,
    email: p.email,
    bank_name: p.bankName,
    bank_account: p.bankAccount,
    masked_account: p.maskedAccount,
    transfiya_phone: p.transfiyaPhone,
    signature: p.signature,
  });
  if (error?.message.includes('signature')) {
    throw new Error('falta la columna de la firma. Ejecuta supabase/migrate_signature.sql en Supabase');
  }
  if (error) throw error;
}

/** Line items of a saved invoice, in their original order. Mock invoices have none. */
export async function getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('sort_order');
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    id: row.id,
    description: row.description ?? '',
    quantity: row.quantity ?? '',
    unitPrice: Number(row.unit_price ?? 0),
    ivaRate: Number(row.iva_rate ?? 0),
    subtotal: Number(row.subtotal ?? 0),
  }));
}

/** Saves an invoice and its items. In mock mode it is returned as-is (kept only in memory). */
export async function createInvoice(invoice: Invoice & { items: InvoiceItem[] }): Promise<Invoice> {
  if (!isSupabaseConfigured) return invoice;
  const { error } = await supabase.from('invoices').insert({
    id: invoice.id,
    number: invoice.number,
    client_id: invoice.clientId,
    client_name: invoice.clientName,
    nit: invoice.nit,
    date: invoice.date,
    due_date: invoice.dueDate,
    amount: invoice.amount,
    status: invoice.status,
  });
  if (error) throw error;
  const { error: itemsError } = await supabase.from('invoice_items').insert(
    invoice.items.map((it, i) => ({
      id: crypto.randomUUID(),
      invoice_id: invoice.id,
      description: it.description,
      quantity: it.quantity,
      unit_price: it.unitPrice,
      iva_rate: it.ivaRate,
      subtotal: it.subtotal,
      sort_order: i,
    }))
  );
  if (itemsError) {
    // No transaction across the two inserts: remove the header so no invoice is left without items.
    await supabase.from('invoices').delete().eq('id', invoice.id);
    throw itemsError;
  }
  return invoice;
}

/** In mock mode the cuenta de cobro is returned as-is (kept only in memory). */
export async function createCuentaCobro(cc: CuentaCobro): Promise<CuentaCobro> {
  if (!isSupabaseConfigured) return cc;
  const { error } = await supabase.from('cuentas_cobro').insert({
    id: cc.id,
    number: cc.number,
    client_id: cc.clientId,
    client_name: cc.clientName,
    nit: cc.nit,
    contract_ref: cc.contractRef,
    date: cc.date,
    due_date: cc.dueDate,
    amount: cc.amount,
    concept: cc.concept,
    status: cc.status,
  });
  if (error) throw error;
  return cc;
}

/** Changes the stored status of an invoice, cuenta de cobro or contract. In mock mode nothing is persisted. */
export async function updateDocumentStatus(
  kind: 'invoice' | 'cuenta' | 'contrato',
  id: string,
  status: Invoice['status'] | CuentaCobro['status'] | Contract['status']
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const table = kind === 'invoice' ? 'invoices' : kind === 'cuenta' ? 'cuentas_cobro' : 'contracts';
  const { error } = await supabase.from(table).update({ status }).eq('id', id);
  if (error) throw error;
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

/** Returns the saved client; in mock mode (nothing persisted) returns null. */
export async function updateClient(id: string, client: Partial<Client>): Promise<Client | null> {
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
  return toClient(data);
}

export async function deleteClient(id: string) {
  if (!isSupabaseConfigured) return null;
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw error;
  return true;
}
