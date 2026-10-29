import { supabase } from '../lib/supabaseClient';
import {
  INITIAL_CLIENTS,
  INITIAL_INVOICES,
  INITIAL_CUENTAS_COBRO,
  INITIAL_SERVICES,
  INITIAL_CONTRACT,
  INITIAL_FREELANCER_PROFILE,
} from '../data/mockData';
import { Client, Invoice, CuentaCobro, ServiceItem, Contract } from '../types';

const useSupabase = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key);
};

export async function getClients(): Promise<Client[]> {
  if (!useSupabase()) return INITIAL_CLIENTS;
  try {
    const { data, error } = await supabase.from('clients').select('*').order('name');
    if (error || !data) throw error;
    return data.map((row: any) => ({
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
    }));
  } catch (e) {
    console.warn('getClients fallback to mock', e);
    return INITIAL_CLIENTS;
  }
}

export async function getInvoices(): Promise<Invoice[]> {
  if (!useSupabase()) return INITIAL_INVOICES;
  try {
    const { data, error } = await supabase.from('invoices').select('*').order('id');
    if (error || !data) throw error;
    return data.map((row: any) => ({
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
  } catch (e) {
    console.warn('getInvoices fallback to mock', e);
    return INITIAL_INVOICES;
  }
}

export async function getCuentasCobro(): Promise<CuentaCobro[]> {
  if (!useSupabase()) return INITIAL_CUENTAS_COBRO;
  try {
    const { data, error } = await supabase.from('cuentas_cobro').select('*').order('date', { ascending: false });
    if (error || !data) throw error;
    return data.map((row: any) => ({
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
  } catch (e) {
    console.warn('getCuentasCobro fallback to mock', e);
    return INITIAL_CUENTAS_COBRO;
  }
}

export async function getServices(): Promise<ServiceItem[]> {
  if (!useSupabase()) return INITIAL_SERVICES;
  try {
    const { data, error } = await supabase.from('services').select('*').order('id');
    if (error || !data) throw error;
    return data.map((row: any) => ({
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
  } catch (e) {
    console.warn('getServices fallback to mock', e);
    return INITIAL_SERVICES;
  }
}

export async function getContract(): Promise<Contract> {
  if (!useSupabase()) return INITIAL_CONTRACT;
  try {
    const { data: contractRow, error: cErr } = await supabase.from('contracts').select('*').limit(1).maybeSingle();
    if (cErr || !contractRow) throw cErr;
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
  } catch (e) {
    console.warn('getContract fallback to mock', e);
    return INITIAL_CONTRACT;
  }
}

export async function getFreelancerProfile() {
  if (!useSupabase()) return INITIAL_FREELANCER_PROFILE;
  try {
    const { data, error } = await supabase.from('freelancer_profile').select('*').eq('id', 1).maybeSingle();
    if (error || !data) throw error;
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
  } catch (e) {
    console.warn('getFreelancerProfile fallback to mock', e);
    return INITIAL_FREELANCER_PROFILE;
  }
}

export async function createClient(client: Partial<Client>) {
  if (!useSupabase()) return null;
  const payload: any = {
    id: client.id || `cli-${Date.now()}`,
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
    pending_balance: client.pendingBalance ?? 0,
    total_billed: client.totalBilled ?? 0,
    status: client.status ?? 'Activo',
    avatar_initials: client.avatarInitials,
    avatar_bg: client.avatarBg,
    avatar_color: client.avatarColor,
    tax_regime: client.taxRegime,
    ica_rate: client.icaRate,
    rete_fuente_rate: client.reteFuenteRate,
  };
  const { data, error } = await supabase.from('clients').insert(payload).select().single();
  if (error) throw error;
  return data;
}
