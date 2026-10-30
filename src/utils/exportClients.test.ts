import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { buildClientsWorkbook } from './exportClients';
import { Client } from '../types';

const client = (over: Partial<Client>): Client => ({
  id: 'x', name: 'Cliente', nit: '900.000.000-1', sector: '', city: 'Bogotá', address: '', contactName: '',
  email: '', phone: '', pendingBalance: 0, totalBilled: 0, status: 'Activo', avatarInitials: 'C', ...over,
});

test('buildClientsWorkbook writes a styled sheet that survives a round trip through .xlsx', async () => {
  const wb = buildClientsWorkbook([
    client({ name: 'Rappi SAS', pendingBalance: 2800000, totalBilled: 10950000 }),
    client({ name: 'Habi', status: 'Inactivo' }),
  ]);
  // Re-read the bytes, as Excel would, so the check covers what actually gets saved.
  const reread = new ExcelJS.Workbook();
  await reread.xlsx.load(await wb.xlsx.writeBuffer());
  const ws = reread.getWorksheet('Clientes')!;

  assert.equal(ws.rowCount, 3);
  assert.equal(ws.getCell('A1').value, 'Nombre');
  assert.equal((ws.getCell('A1').fill as ExcelJS.FillPattern).fgColor?.argb, 'FF1C2B42'); // navy header
  assert.equal(ws.getCell('A1').font.bold, true);
  assert.equal(ws.getCell('K2').value, 2800000); // stays a number, so Excel can sum it
  assert.equal(ws.getCell('K2').numFmt, '"$" #,##0');
  assert.equal(ws.getCell('K2').font.color?.argb, 'FFAE2E24'); // pending balance in red
  assert.notEqual(ws.getCell('K3').font.color?.argb, 'FFAE2E24'); // zero balance not red
  assert.equal(ws.getCell('C2').value, '900.000.000-1'); // NIT kept as text
  assert.equal(ws.views[0].state, 'frozen');
  assert.ok(ws.autoFilter);
});
