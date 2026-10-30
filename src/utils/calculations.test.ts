import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCOP,
  parseCOP,
  numeroALetrasCOP,
  calculateTaxSummary,
  nextDocumentNumber,
} from './calculations';

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
  assert.equal(result3, 'DIECIOCHO MILLONES PESOS M/CTE');
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

test('nextDocumentNumber continues the highest consecutive and ignores other prefixes', () => {
  assert.equal(nextDocumentNumber('FAC', ['FAC-2025-042', 'FAC-2025-009', 'CC-2025-100'], 2026), 'FAC-2026-043');
  assert.equal(nextDocumentNumber('CC', [], 2026), 'CC-2026-001');
});
