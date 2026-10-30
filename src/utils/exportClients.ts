import ExcelJS from 'exceljs';
import { Client } from '../types';

// Colors from the Atlassian DESIGN.md the app follows (ExcelJS wants ARGB).
const INK = 'FF101214';
const INK_SUBTLEST = 'FF63666B';
const NAVY = 'FF1C2B42';
const HAIRLINE = 'FFDDDEE1';
const WHITE = 'FFFFFFFF';
const GREEN = 'FF22A06B';
const ORANGE = 'FFC75300';
const RED = 'FFAE2E24';
const FONT = 'Segoe UI'; // Charlie is proprietary; Segoe UI is the design's fallback on Windows
const COP = '"$" #,##0'; // Excel shows the user's locale separators: $ 10.950.000 in es-CO

const STATUS_COLOR: Record<Client['status'], string> = { Activo: GREEN, Pendiente: ORANGE, Inactivo: INK_SUBTLEST };

const COLUMNS: Array<{ header: string; value: (c: Client) => string | number; money?: boolean }> = [
  { header: 'Nombre', value: (c) => c.name },
  { header: 'Razón social', value: (c) => c.legalName ?? '' },
  { header: 'NIT', value: (c) => c.nit },
  { header: 'Sector', value: (c) => c.sector },
  { header: 'Ciudad', value: (c) => c.city },
  { header: 'Dirección', value: (c) => c.address },
  { header: 'Contacto', value: (c) => c.contactName },
  { header: 'Correo', value: (c) => c.email },
  { header: 'Teléfono', value: (c) => c.phone },
  { header: 'Estado', value: (c) => c.status },
  { header: 'Saldo pendiente', value: (c) => c.pendingBalance, money: true },
  { header: 'Facturado', value: (c) => c.totalBilled, money: true },
];

/** Styled workbook: navy header, hairline rows, COP number format, frozen header and filters. */
export function buildClientsWorkbook(clients: Client[]): ExcelJS.Workbook {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'FreelanceOS';
  const ws = wb.addWorksheet('Clientes', { views: [{ state: 'frozen', ySplit: 1, showGridLines: false }] });

  ws.addRow(COLUMNS.map((c) => c.header));
  clients.forEach((client) => ws.addRow(COLUMNS.map((c) => c.value(client))));

  const border = { bottom: { style: 'thin' as const, color: { argb: HAIRLINE } } };
  ws.getRow(1).height = 28;
  ws.getRow(1).eachCell((cell) => {
    cell.font = { name: FONT, size: 11, bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  });

  for (let r = 2; r <= clients.length + 1; r++) {
    const row = ws.getRow(r);
    row.height = 22;
    COLUMNS.forEach((col, i) => {
      const cell = row.getCell(i + 1);
      cell.font = { name: FONT, size: 10, color: { argb: INK } };
      cell.border = border;
      cell.alignment = { vertical: 'middle', horizontal: col.money ? 'right' : 'left', indent: col.money ? 0 : 1 };
      if (col.money) cell.numFmt = COP;
    });
    const client = clients[r - 2];
    const status = row.getCell(COLUMNS.findIndex((c) => c.header === 'Estado') + 1);
    status.font = { name: FONT, size: 10, bold: true, color: { argb: STATUS_COLOR[client.status] ?? INK } };
    if (client.pendingBalance > 0) {
      const pending = row.getCell(COLUMNS.findIndex((c) => c.header === 'Saldo pendiente') + 1);
      pending.font = { name: FONT, size: 10, bold: true, color: { argb: RED } };
    }
  }

  // Width from the longest value, within sensible bounds.
  COLUMNS.forEach((col, i) => {
    const shown = (c: Client) => (col.money ? `$ ${Number(col.value(c)).toLocaleString('es-CO')}` : String(col.value(c)));
    const longest = Math.max(col.header.length, ...clients.map((c) => shown(c).length));
    ws.getColumn(i + 1).width = Math.min(Math.max(longest + 4, 10), 50);
  });

  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: COLUMNS.length } };
  return wb;
}

export async function downloadClientsXlsx(clients: Client[], fileName: string) {
  const buffer = await buildClientsWorkbook(clients).xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  // Revoking right away can cancel the download before the browser starts it.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
