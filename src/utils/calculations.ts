/**
 * Utility functions for Colombian Peso (COP) formatting, legal number-to-words,
 * and tax retention calculations under DIAN regulations.
 */

export function formatCOP(amount: number, withSuffix: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$0' + (withSuffix ? ' COP' : '');
  }
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${formatted}` + (withSuffix ? ' COP' : '');
}

export function parseCOP(formatted: string): number {
  if (!formatted) return 0;
  // Strip everything except digits and minus
  const cleaned = formatted.replace(/[^\d-]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

const UNIDADES: string[] = [
  '',
  'UN',
  'DOS',
  'TRES',
  'CUATRO',
  'CINCO',
  'SEIS',
  'SIETE',
  'OCHO',
  'NUEVE',
];

const DECENAS: string[] = [
  '',
  'DIEZ',
  'VEINTE',
  'TREINTA',
  'CUARENTA',
  'CINCUENTA',
  'SESENTA',
  'SETENTA',
  'OCHENTA',
  'NOVENTA',
];

const DIEZ_A_DIECINUEVE: string[] = [
  'DIEZ',
  'ONCE',
  'DOCE',
  'TRECE',
  'CATORCE',
  'QUINCE',
  'DIECISEIS',
  'DIECISIETE',
  'DIECIOCHO',
  'DIECINUEVE',
];

const CENTENAS: string[] = [
  '',
  'CIENTO',
  'DOSCIENTOS',
  'TRESCIENTOS',
  'CUATROCIENTOS',
  'QUINIENTOS',
  'SEISCIENTOS',
  'SETECIENTOS',
  'OCHOCIENTOS',
  'NOVECIENTOS',
];

function convertirCentenas(num: number): string {
  if (num === 0) return '';
  if (num === 100) return 'CIEN';

  const c = Math.floor(num / 100);
  const d = Math.floor((num % 100) / 10);
  const u = num % 10;

  let resultado = CENTENAS[c] ? CENTENAS[c] + ' ' : '';

  if (d === 1) {
    resultado += DIEZ_A_DIECINUEVE[u];
  } else if (d === 2 && u > 0) {
    resultado += 'VEINTI' + UNIDADES[u];
  } else {
    if (d > 0) {
      resultado += DECENAS[d];
      if (u > 0) resultado += ' Y ' + UNIDADES[u];
    } else if (u > 0) {
      resultado += UNIDADES[u];
    }
  }

  return resultado.trim();
}

/** 1..999.999 in words, e.g. 1500 -> "MIL QUINIENTOS". */
function convertirMiles(num: number): string {
  const miles = Math.floor(num / 1_000);
  const resto = num % 1_000;
  const partes: string[] = [];
  if (miles === 1) partes.push('MIL');
  else if (miles > 1) partes.push(convertirCentenas(miles) + ' MIL');
  if (resto > 0) partes.push(convertirCentenas(resto));
  return partes.join(' ');
}

/**
 * Converts a numeric amount to legal Spanish text for Colombian receipts and invoices.
 * Example: 2800000 -> "DOS MILLONES OCHOCIENTOS MIL PESOS M/CTE"
 * Exact millions take "DE": 18000000 -> "DIECIOCHO MILLONES DE PESOS M/CTE".
 * Supports up to 999.999.999.999 (e.g. "MIL QUINIENTOS MILLONES").
 */
export function numeroALetrasCOP(amount: number): string {
  const num = Math.abs(Math.round(amount));
  if (num === 0) return 'CERO PESOS M/CTE';

  const millones = Math.floor(num / 1_000_000);
  const resto = num % 1_000_000;

  const partes: string[] = [];
  if (amount < 0) partes.push('MENOS');
  if (millones === 1) partes.push('UN MILLON');
  else if (millones > 1) partes.push(convertirMiles(millones) + ' MILLONES');
  if (resto > 0) partes.push(convertirMiles(resto));

  const pesos = millones > 0 && resto === 0 ? 'DE PESOS' : 'PESOS';
  return `${partes.join(' ')} ${pesos} M/CTE`;
}

export interface TaxCalculationResult {
  subtotal: number;
  ivaAmount: number;
  reteFuenteAmount: number;
  reteIcaAmount: number;
  total: number;
}

/**
 * Calculates subtotal, standard Colombian IVA (19% on eligible items),
 * Retención en la fuente (-4% or configured), and net total.
 */
export function calculateTaxSummary(
  items: Array<{ subtotal: number; ivaRate: number }>,
  reteFuenteRate: number = 0.04, // default 4% for freelance services
  reteIcaRate: number = 0
): TaxCalculationResult {
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  // Round once on the total, like the retentions, so stored totals are whole pesos.
  const ivaAmount = Math.round(items.reduce((acc, item) => acc + item.subtotal * item.ivaRate, 0));
  const reteFuenteAmount = Math.round(subtotal * reteFuenteRate);
  const reteIcaAmount = Math.round(subtotal * reteIcaRate);
  const total = subtotal + ivaAmount - reteFuenteAmount - reteIcaAmount;

  return {
    subtotal,
    ivaAmount,
    reteFuenteAmount,
    reteIcaAmount,
    total,
  };
}

/**
 * Next consecutive document number, e.g. "FAC-2026-043".
 * The counter keeps growing across years (DIAN ranges are consecutive), only the year label changes.
 */
export function nextDocumentNumber(prefix: string, existing: string[], year: number = new Date().getFullYear()): string {
  const pattern = new RegExp(`^${prefix}-\\d{4}-(\\d+)$`);
  const max = existing.reduce((acc, n) => {
    const m = pattern.exec(n);
    return m ? Math.max(acc, parseInt(m[1], 10)) : acc;
  }, 0);
  return `${prefix}-${year}-${String(max + 1).padStart(3, '0')}`;
}

/** Parses a "YYYY-MM-DD" date (as Supabase returns `date` columns) in local time; null otherwise. */
export function parseFecha(iso: string | null | undefined): Date | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(`${iso}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "2024-10-22" -> "22 oct 2024". Anything that is not an ISO date is shown unchanged. */
export function formatFecha(iso: string | null | undefined): string {
  const d = parseFecha(iso);
  if (!d) return iso ?? '';
  return `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

/** Statuses of a document that is issued but not yet paid. */
export const OPEN_STATUSES = ['Enviada', 'Pendiente', 'Vencida'];

/**
 * An unpaid document whose due date has passed is shown as "Vencida" even if the stored status
 * was never updated. Display only: the database keeps the stored status.
 */
export function withOverdueStatus<T extends { status: string; dueDate: string }>(doc: T, today: Date = new Date()): T {
  const due = parseFecha(doc.dueDate);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if ((doc.status === 'Enviada' || doc.status === 'Pendiente') && due && due < startOfToday) {
    return { ...doc, status: 'Vencida' };
  }
  return doc;
}

/**
 * Fills each client's pendingBalance and totalBilled from its invoices and cuentas de cobro,
 * so the numbers can never drift from the documents. Drafts count for neither.
 */
export function withDocumentTotals<C extends { id: string; pendingBalance: number; totalBilled: number }>(
  clients: C[],
  docs: Array<{ clientId: string | null; amount: number; status: string }>
): C[] {
  const totals = new Map<string, { pending: number; billed: number }>();
  for (const d of docs) {
    if (!d.clientId || d.status === 'Borrador') continue;
    const t = totals.get(d.clientId) ?? { pending: 0, billed: 0 };
    t.billed += d.amount;
    if (OPEN_STATUSES.includes(d.status)) t.pending += d.amount;
    totals.set(d.clientId, t);
  }
  return clients.map((c) => ({
    ...c,
    pendingBalance: totals.get(c.id)?.pending ?? 0,
    totalBilled: totals.get(c.id)?.billed ?? 0,
  }));
}
