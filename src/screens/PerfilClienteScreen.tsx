import React, { useState } from 'react';
import { ScreenId, Client, Invoice, CuentaCobro, Contract } from '../types';
import { formatCOP } from '../utils/calculations';

interface PerfilClienteScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  client?: Client;
  invoices: Invoice[];
  cuentasCobro: CuentaCobro[];
  contract: Contract;
}

const STATUS_COLORS: Record<string, string> = {
  Pagada: 'bg-[#e3fcef] text-status-pagada border-[#abf5d1]',
  Enviada: 'bg-[#e9f2fe] text-status-enviada-text border-[#b3d4ff]',
  'En ejecución': 'bg-[#e9f2fe] text-status-enviada-text border-[#b3d4ff]',
  Firmado: 'bg-[#e3fcef] text-status-pagada border-[#abf5d1]',
  Pendiente: 'bg-[#fff0b3] text-[#c75300] border-[#ffe380]',
  Vencida: 'bg-[#ffebe6] text-[#ae2e24] border-[#ffbdad]',
  Borrador: 'bg-[#f4f5f7] text-[#63666b] border-[#dddee1]',
};

const CLIENT_STATUS_COLORS: Record<Client['status'], { badge: string; dot: string }> = {
  Activo: { badge: 'bg-[#e3fcef] text-status-pagada border-[#abf5d1]', dot: 'bg-status-pagada' },
  Pendiente: { badge: 'bg-[#fff0b3] text-[#c75300] border-[#ffe380]', dot: 'bg-[#c75300]' },
  Inactivo: { badge: 'bg-[#f4f5f7] text-[#63666b] border-[#dddee1]', dot: 'bg-[#63666b]' },
};

const OPEN_STATUSES = ['Enviada', 'Pendiente', 'Vencida'];

const Field: React.FC<{ label: string; value?: string; hint?: string; wide?: boolean }> = ({ label, value, hint, wide }) => (
  <div className={`flex flex-col ${wide ? 'md:col-span-2' : ''}`}>
    <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider mb-1">{label}</span>
    <span className="font-body-md text-body-md font-semibold text-text-primary">{value || '—'}</span>
    {hint && <span className="font-body-sm text-body-sm text-text-secondary mt-0.5">{hint}</span>}
  </div>
);

export const PerfilClienteScreen: React.FC<PerfilClienteScreenProps> = ({
  onNavigate,
  client,
  invoices,
  cuentasCobro,
  contract,
}) => {
  const [docSearch, setDocSearch] = useState('');

  if (!client) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-space-md md:px-space-xl py-space-xl flex flex-col gap-space-md">
        <p className="font-body-md text-body-md text-text-secondary">No se encontró el cliente seleccionado.</p>
        <button
          className="self-start h-10 px-4 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label"
          type="button"
          onClick={() => onNavigate('clientes')}
        >
          Volver a Clientes
        </button>
      </div>
    );
  }

  const clientInvoices = invoices.filter((i) => i.clientId === client.id);
  const clientCuentas = cuentasCobro.filter((c) => c.clientId === client.id);
  const clientContracts = contract.clientId === client.id ? [contract] : [];

  const documents = [
    ...clientInvoices.map((i) => ({
      id: i.id,
      type: 'FE' as const,
      number: i.number,
      concept: 'Factura electrónica',
      emissionDate: i.date,
      dueDate: i.dueDate,
      amount: i.amount,
      status: i.status as string,
    })),
    ...clientCuentas.map((c) => ({
      id: c.id,
      type: 'CC' as const,
      number: c.number,
      concept: c.concept,
      emissionDate: c.date,
      dueDate: c.dueDate,
      amount: c.amount,
      status: c.status as string,
    })),
    ...clientContracts.map((c) => ({
      id: c.id,
      type: 'CTR' as const,
      number: c.number,
      concept: c.object,
      emissionDate: '—',
      dueDate: c.duration,
      amount: c.totalValue,
      status: c.status as string,
    })),
  ];

  const filteredDocs = documents.filter(
    (d) =>
      !docSearch ||
      d.number.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.concept.toLowerCase().includes(docSearch.toLowerCase())
  );

  const billing = [...clientInvoices, ...clientCuentas];
  const paid = billing.filter((d) => d.status === 'Pagada');
  const open = billing.filter((d) => OPEN_STATUSES.includes(d.status));
  const overdue = billing.filter((d) => d.status === 'Vencida');
  const paidTotal = paid.reduce((acc, d) => acc + d.amount, 0);
  const openTotal = open.reduce((acc, d) => acc + d.amount, 0);
  const statusColors = CLIENT_STATUS_COLORS[client.status] ?? CLIENT_STATUS_COLORS.Inactivo;

  const tabClass = 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low';

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1200px] mx-auto px-space-md md:px-space-xl py-space-xl space-y-space-xl">
        {/* Top Action Breadcrumb Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm text-text-subtlest font-caption text-caption">
            <a
              className="hover:text-text-primary transition-colors flex items-center gap-1 font-body-sm text-body-sm text-text-secondary cursor-pointer"
              href="#clientes"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('clientes');
              }}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Clientes</span>
            </a>
            <span>/</span>
            <span className="font-body-sm text-body-sm font-semibold text-text-primary">{client.name}</span>
            <span className="px-2 py-0.5 rounded-[10000px] bg-surface-container-high text-text-secondary font-caption text-[11px] font-semibold border border-border-subtle">
              ID: {client.id.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              className="h-10 px-4 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label text-button-label hover:bg-surface-container-low hover:border-text-primary transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              type="button"
              onClick={() => onNavigate('contratos')}
            >
              <span className="material-symbols-outlined text-[18px] text-text-secondary">description</span>
              <span>Nuevo contrato</span>
            </button>
            <button
              className="h-10 px-4 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label text-button-label hover:bg-surface-container-low hover:border-text-primary transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              type="button"
              onClick={() => onNavigate('facturas')}
            >
              <span className="material-symbols-outlined text-[18px] text-text-secondary">receipt_long</span>
              <span>Nueva factura</span>
            </button>
            <button
              className="h-10 px-4 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label text-button-label hover:bg-surface-container-low hover:border-text-primary transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              type="button"
              onClick={() => onNavigate('cuentas-cobro')}
            >
              <span className="material-symbols-outlined text-[18px] text-text-secondary">payments</span>
              <span>Nueva cuenta de cobro</span>
            </button>
          </div>
        </div>

        {/* Header / Client Identity Hero Card */}
        <div className="bg-canvas-white border border-border-subtle rounded-[20px] p-6 md:p-space-xl flex flex-col lg:flex-row lg:items-center justify-between gap-space-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-space-lg">
            <div
              className="w-20 h-20 rounded-[16px] flex items-center justify-center font-headline-md text-headline-md font-bold shadow-sm shrink-0"
              style={{ backgroundColor: client.avatarBg || '#e8e8ea', color: client.avatarColor || '#101214' }}
            >
              {client.avatarInitials}
            </div>
            <div className="flex flex-col space-y-1.5">
              <div className="flex flex-wrap items-center gap-space-sm">
                <h1 className="font-headline-md text-headline-md text-text-primary font-semibold tracking-tight">
                  {client.name}
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-[10000px] text-[12px] font-semibold border ${statusColors.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusColors.dot}`}></span>
                  {client.status}
                </span>
                {client.sector && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-[10000px] text-[12px] font-semibold bg-surface-container-low text-text-secondary border border-border-subtle">
                    {client.sector}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-text-secondary font-body-sm text-body-sm">
                <span className="flex items-center gap-1 font-semibold text-text-primary">
                  <span className="text-text-subtlest font-normal">NIT:</span> {client.nit}
                </span>
                {client.contactName && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-text-subtlest">person</span>
                    {client.contactName}
                    {client.contactRole && ` (${client.contactRole})`}
                  </span>
                )}
                {client.email && (
                  <a
                    className="flex items-center gap-1 hover:text-primary-container text-text-secondary transition-colors"
                    href={`mailto:${client.email}`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-text-subtlest">mail</span>
                    {client.email}
                  </a>
                )}
                {client.phone && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-text-subtlest">call</span>
                    {client.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-md border-t lg:border-t-0 lg:border-l border-border-subtle pt-4 lg:pt-0 lg:pl-space-xl shrink-0">
            <div className="flex flex-col">
              <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider">Moneda Principal</span>
              <span className="font-headline-sm text-body-lg font-semibold text-text-primary flex items-center gap-1">
                COP ($) <span className="text-text-subtlest font-normal text-body-sm">Pesos</span>
              </span>
            </div>
            <div className="h-8 w-[1px] bg-border-subtle"></div>
            <div className="flex flex-col">
              <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider">Ciclo Comercial</span>
              <span
                className={`font-headline-sm text-body-lg font-semibold flex items-center gap-1 ${
                  overdue.length > 0 ? 'text-[#ae2e24]' : open.length > 0 ? 'text-[#c75300]' : 'text-status-pagada'
                }`}
              >
                {overdue.length > 0 ? 'En mora' : open.length > 0 ? 'Con saldo' : 'Al día'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs: each one opens its module */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border-subtle select-none">
          <span className="h-9 px-4 rounded-[10000px] font-badge-label text-badge-label flex items-center whitespace-nowrap bg-text-primary text-canvas-white">
            Información
          </span>
          <button
            className={`h-9 px-4 rounded-[10000px] font-badge-label text-badge-label flex items-center whitespace-nowrap cursor-pointer transition-colors ${tabClass}`}
            type="button"
            onClick={() => onNavigate('servicios')}
          >
            Servicios
          </button>
          {[
            { label: 'Contratos', count: clientContracts.length, screen: 'contratos' as ScreenId },
            { label: 'Facturas', count: clientInvoices.length, screen: 'facturas' as ScreenId },
            { label: 'Cuentas de cobro', count: clientCuentas.length, screen: 'cuentas-cobro' as ScreenId },
          ].map((tab) => (
            <button
              key={tab.label}
              className={`h-9 px-4 rounded-[10000px] font-badge-label text-badge-label flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${tabClass}`}
              type="button"
              onClick={() => onNavigate(tab.screen)}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-text-secondary text-[11px]">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Financial Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          <div className="bg-canvas-white border border-border-subtle rounded-[20px] p-6 md:p-space-xl flex flex-col justify-between shadow-none">
            <div className="flex items-center justify-between">
              <span className="font-caption text-caption uppercase tracking-wider font-semibold text-text-subtlest">Cobrado</span>
              <span className="w-8 h-8 rounded-full bg-status-enviada-bg text-status-enviada-text flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </span>
            </div>
            <div className="my-4">
              <div className="font-currency-display text-currency-display font-semibold text-text-primary tracking-tight">
                {formatCOP(paidTotal)} <span className="font-body-sm text-body-sm text-text-subtlest font-normal">COP</span>
              </div>
              <p className="font-body-sm text-body-sm text-text-secondary mt-1">
                {paid.length} {paid.length === 1 ? 'documento pagado' : 'documentos pagados'}
              </p>
            </div>
          </div>

          <div className="bg-canvas-white border border-border-subtle rounded-[20px] p-6 md:p-space-xl flex flex-col justify-between shadow-none">
            <div className="flex items-center justify-between">
              <span className="font-caption text-caption uppercase tracking-wider font-semibold text-text-subtlest">
                Saldo Pendiente
              </span>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  open.length > 0 ? 'bg-[#fff0b3] text-[#c75300]' : 'bg-[#e3fcef] text-status-pagada'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{open.length > 0 ? 'schedule' : 'check_circle'}</span>
              </span>
            </div>
            <div className="my-4">
              <div className="font-currency-display text-currency-display font-semibold text-text-primary tracking-tight">
                {formatCOP(openTotal)} <span className="font-body-sm text-body-sm text-text-subtlest font-normal">COP</span>
              </div>
              <p className="font-body-sm text-body-sm text-text-secondary mt-1">
                {open.length === 0
                  ? 'No hay cobros exigibles ni en mora'
                  : `${open.length} por cobrar${overdue.length > 0 ? `, ${overdue.length} vencidos` : ''}`}
              </p>
            </div>
          </div>

          <div className="bg-[#1c2b42] border border-[#1c2b42] rounded-[20px] p-6 md:p-space-xl text-canvas-white flex flex-col justify-between shadow-none">
            <div className="flex items-center justify-between text-[#b7b9be]">
              <span className="font-caption text-caption uppercase tracking-wider font-semibold text-canvas-white">
                Documentos emitidos
              </span>
              <span className="w-8 h-8 rounded-full bg-white/10 text-canvas-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">folder_open</span>
              </span>
            </div>
            <div className="my-4">
              <div className="font-currency-display text-currency-display font-semibold text-canvas-white tracking-tight">
                {documents.length}
              </div>
              <p className="font-body-sm text-body-sm text-[#bec7d3] mt-1">
                {clientInvoices.length} facturas, {clientCuentas.length} cuentas de cobro, {clientContracts.length} contratos
              </p>
            </div>
          </div>
        </div>

        {/* Fiscal Data & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          <div className="lg:col-span-2 bg-canvas-white border border-border-subtle rounded-[20px] p-6 md:p-space-xl shadow-none">
            <div className="flex items-center gap-2 pb-4 border-b border-border-subtle">
              <span className="material-symbols-outlined text-text-secondary text-[22px]">domain</span>
              <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">Datos Fiscales y Comerciales</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-space-lg gap-x-space-xl mt-space-lg">
              <Field label="Razón Social Legal" value={client.legalName || client.name} />
              <Field label="Régimen Tributario" value={client.taxRegime} />
              <Field label="Tarifa ICA" value={client.icaRate} />
              <Field label="Retención en la Fuente Aplicable" value={client.reteFuenteRate} />
              <Field label="Dirección Fiscal Notificaciones" value={client.address} hint={client.city} wide />
            </div>
          </div>

          <div className="bg-canvas-white border border-border-subtle rounded-[20px] p-6 md:p-space-xl flex flex-col shadow-none">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <h3 className="font-headline-sm text-body-lg font-semibold text-text-primary">Contacto Principal</h3>
              <span className="material-symbols-outlined text-text-subtlest text-[20px]">contacts</span>
            </div>
            {client.contactName ? (
              <div className="mt-space-md flex items-start gap-space-sm p-3 rounded-[12px] bg-surface-container-low border border-border-subtle">
                <div className="w-9 h-9 rounded-full bg-secondary text-canvas-white font-semibold flex items-center justify-center text-[12px] shrink-0">
                  {client.contactName
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-sm text-body-sm font-semibold text-text-primary truncate">{client.contactName}</span>
                  {client.contactRole && (
                    <span className="font-caption text-caption text-text-secondary">{client.contactRole}</span>
                  )}
                  {client.email && (
                    <a
                      className="font-caption text-caption text-primary-container truncate hover:underline mt-1"
                      href={`mailto:${client.email}`}
                    >
                      {client.email}
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-space-md font-body-sm text-body-sm text-text-subtlest">Sin contacto registrado.</p>
            )}
          </div>
        </div>

        {/* Linked Documents Table */}
        <div className="bg-canvas-white border border-border-subtle rounded-[20px] p-6 md:p-space-xl shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg border-b border-border-subtle">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-text-secondary text-[22px]">history_edu</span>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Documentos e Historial Vinculado
                </h2>
                <p className="font-body-sm text-body-sm text-text-secondary">
                  Facturas electrónicas, contratos marco y cuentas de cobro emitidas
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                className="h-9 pl-8 pr-3 bg-canvas-white border border-border-strong rounded-[3px] text-body-sm font-body-sm text-text-primary placeholder:text-text-subtlest focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container w-64"
                placeholder="Filtrar por consecutivo o concepto..."
                type="text"
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-text-subtlest">
                search
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-border-subtle text-text-subtlest font-caption text-caption uppercase tracking-wider bg-surface-container-low">
                  <th className="py-3 px-4 font-semibold">Tipo &amp; Documento</th>
                  <th className="py-3 px-4 font-semibold">Concepto / Servicio</th>
                  <th className="py-3 px-4 font-semibold">Fecha Emisión</th>
                  <th className="py-3 px-4 font-semibold">Vencimiento</th>
                  <th className="py-3 px-4 font-semibold text-right">Valor Total (COP)</th>
                  <th className="py-3 px-4 font-semibold text-center">Estado</th>
                  <th className="py-3 px-4 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-body-sm font-body-sm">
                {filteredDocs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 px-4 text-center text-text-subtlest">
                      {documents.length === 0 ? 'Este cliente aún no tiene documentos.' : 'Ningún documento coincide con el filtro.'}
                    </td>
                  </tr>
                )}
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#f7f8f9] transition-colors">
                    <td className="py-4 px-4 font-medium text-text-primary">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-text-subtlest text-[18px]">
                          {doc.type === 'CC' ? 'payments' : doc.type === 'FE' ? 'receipt_long' : 'description'}
                        </span>
                        <span className="font-semibold">{doc.number}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-text-secondary max-w-xs truncate">{doc.concept}</td>
                    <td className="py-4 px-4 text-text-secondary whitespace-nowrap">{doc.emissionDate}</td>
                    <td className="py-4 px-4 text-text-secondary whitespace-nowrap">{doc.dueDate}</td>
                    <td className="py-4 px-4 text-right font-semibold text-text-primary whitespace-nowrap">
                      {formatCOP(doc.amount)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-[10000px] text-[12px] font-semibold border ${
                          STATUS_COLORS[doc.status] ?? STATUS_COLORS.Borrador
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-text-secondary hover:text-text-primary inline-flex cursor-pointer"
                        type="button"
                        title="Abrir módulo"
                        onClick={() => {
                          if (doc.type === 'CC') onNavigate('cuentas-cobro');
                          else if (doc.type === 'FE') onNavigate('facturas');
                          else onNavigate('contratos');
                        }}
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-space-md border-t border-border-subtle text-caption font-caption text-text-secondary">
            Mostrando {filteredDocs.length} de {documents.length} documentos de {client.name}
          </div>
        </div>
      </div>
    </div>
  );
};
