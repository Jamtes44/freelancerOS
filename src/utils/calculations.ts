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

/**
 * Converts a numeric amount to legal Spanish text for Colombian receipts and invoices.
 * Example: 2800000 -> "DOS MILLONES OCHOCIENTOS MIL PESOS M/CTE"
 */
export function numeroALetrasCOP(amount: number): string {
  if (amount === 0) return 'CERO PESOS M/CTE';
  const num = Math.abs(Math.round(amount));

  const millones = Math.floor(num / 1_000_000);
  const miles = Math.floor((num % 1_000_000) / 1_000);
  const unidades = num % 1_000;

  const partes: string[] = [];

  if (millones > 0) {
    if (millones === 1) {
      partes.push('UN MILLON');
    } else {
      partes.push(convertirCentenas(millones) + ' MILLONES');
    }
  }

  if (miles > 0) {
    if (miles === 1) {
      partes.push('MIL');
    } else {
      partes.push(convertirCentenas(miles) + ' MIL');
    }
  }

  if (unidades > 0) {
    partes.push(convertirCentenas(unidades));
  }

  return `${partes.join(' ').trim()} PESOS M/CTE`;
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
  const ivaAmount = items.reduce((acc, item) => acc + item.subtotal * item.ivaRate, 0);
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
