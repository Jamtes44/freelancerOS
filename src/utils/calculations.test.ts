import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCOP,
  parseCOP,
  numeroALetrasCOP,
  calculateTaxSummary,
  nextDocumentNumber,
  withDocumentTotals,
  parseFecha,
  formatFecha,
} from './calculations';

test('formatFecha shows ISO dates in Spanish and leaves other text alone', () => {
  assert.equal(formatFecha('2024-10-22'), '22 oct 2024');
  assert.equal(formatFecha('2025-01-05'), '05 ene 2025');
  assert.equal(formatFecha('12 meses'), '12 meses'); // contract duration text
  assert.equal(formatFecha(null), '');
  assert.equal(parseFecha('22 Oct 2024'), null);
  assert.equal(parseFecha('2024-10-22')?.getDate(), 22); // local time, no UTC day shift
});

test('withDocumentTotals derives balances from documents and ignores drafts and unlinked docs', () => {
  const clients = [
    { id: 'a', pendingBalance: 999, totalBilled: 999 },
    { id: 'b', pendingBalance: 5, totalBilled: 5 },
  ];
  const [a, b] = withDocumentTotals(clients, [
    { clientId: 'a', amount: 100, status: 'Pagada' },
    { clientId: 'a', amount: 50, status: 'Vencida' },
    { clientId: 'a', amount: 30, status: 'Enviada' },
    { clientId: 'a', amount: 1000, status: 'Borrador' },
    { clientId: null, amount: 7, status: 'Pendiente' },
  ]);
  assert.deepEqual(a, { id: 'a', pendingBalance: 80, totalBilled: 180 });
  assert.deepEqual(b, { id: 'b', pendingBalance: 0, totalBilled: 0 });
});

test('formatCOP formats numbers with Colombian thousands dots', () => {
  assert.equal(formatCOP(14850000), '$14.850.000');
  assert.equal(formatCOP(2800000, true), '$2.800.000 COP');
  assert.equal(formatCOP(0), '$0');
});

test('parseCOP extracts integer numbers correctly', () => {
  assert.equal(parseCOP('$14.850.000 COP'), 14850000);
  assert.equal(parseCOP('2.800.000'), 2800000);
  assert.equal(parseCOP(''), 0);
});

test('numeroALetrasCOP generates legal Spanish text for Colombian documents', () => {
  const result1 = numeroALetrasCOP(2800000);
  assert.equal(result1, 'DOS MILLONES OCHOCIENTOS MIL PESOS M/CTE');

  const result2 = numeroALetrasCOP(1500000);
  assert.equal(result2, 'UN MILLON QUINIENTOS MIL PESOS M/CTE');

  const result3 = numeroALetrasCOP(18000000);
  assert.equal(result3, 'DIECIOCHO MILLONES DE PESOS M/CTE');
});

test('numeroALetrasCOP edge cases: exact million, thousands of millions, small and negative amounts', () => {
  assert.equal(numeroALetrasCOP(1000000), 'UN MILLON DE PESOS M/CTE');
  assert.equal(numeroALetrasCOP(1500000000), 'MIL QUINIENTOS MILLONES DE PESOS M/CTE');
  assert.equal(numeroALetrasCOP(2001500000), 'DOS MIL UN MILLONES QUINIENTOS MIL PESOS M/CTE');
  assert.equal(numeroALetrasCOP(21000), 'VEINTIUN MIL PESOS M/CTE');
  assert.equal(numeroALetrasCOP(100), 'CIEN PESOS M/CTE');
  assert.equal(numeroALetrasCOP(0), 'CERO PESOS M/CTE');
  assert.equal(numeroALetrasCOP(-2800000), 'MENOS DOS MILLONES OCHOCIENTOS MIL PESOS M/CTE');
});

test('calculateTaxSummary computes subtotal, 19% IVA, and 4% retefuente', () => {
  const items = [
    { subtotal: 6000000, ivaRate: 0.19 },
    { subtotal: 4500000, ivaRate: 0.19 },
  ];

  const summary = calculateTaxSummary(items, 0.04);
  assert.equal(summary.subtotal, 10500000);
  assert.equal(summary.ivaAmount, 1995000);
  assert.equal(summary.reteFuenteAmount, 420000); // 4% of 10.500.000
  assert.equal(summary.total, 12075000); // 10.500.000 + 1.995.000 - 420.000
});

test('calculateTaxSummary rounds IVA so the total has no cents', () => {
  const summary = calculateTaxSummary([{ subtotal: 99999, ivaRate: 0.19 }], 0.04);
  assert.equal(summary.ivaAmount, 19000); // 18.999,81 rounded
  assert.equal(summary.total, 99999 + 19000 - 4000);
  assert.ok(Number.isInteger(summary.total));
});

test('nextDocumentNumber continues the highest consecutive and ignores other prefixes', () => {
  assert.equal(nextDocumentNumber('FAC', ['FAC-2025-042', 'FAC-2025-009', 'CC-2025-100'], 2026), 'FAC-2026-043');
  assert.equal(nextDocumentNumber('CC', [], 2026), 'CC-2026-001');
});
