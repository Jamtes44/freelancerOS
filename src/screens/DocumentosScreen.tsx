import React, { useState } from 'react';
import { ScreenId, Invoice, CuentaCobro, Client } from '../types';
import { formatCOP, formatFecha, OPEN_STATUSES } from '../utils/calculations';
import { updateDocumentStatus } from '../services/supabaseService';

type Kind = 'invoice' | 'cuenta';

interface DocumentosScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenClient: (clientId: string) => void;
  invoices: Invoice[];
  cuentasCobro: CuentaCobro[];
  clients: Client[];
  clientFilter?: string;
  onClearClientFilter: () => void;
  onStatusChanged: (kind: Kind, id: string, status: string) => void;
}

const STATUSES: Record<Kind, string[]> = {
  invoice: ['Borrador', 'Enviada', 'Pendiente', 'Vencida', 'Pagada'],
  cuenta: ['Borrador', 'Pendiente', 'Vencida', 'Pagada'],
};

const STATUS_STYLE: Record<string, string> = {
  Pagada: 'bg-[#e3fcef] text-[#22a06b] border-[#abf5d1]',
  Enviada: 'bg-status-enviada-bg text-status-enviada-text border-[#b3d4ff]',
  Pendiente: 'bg-[#fff0b3] text-[#c75300] border-[#ffe380]',
  Vencida: 'bg-[#ffebe6] text-[#ae2e24] border-[#ffbdad]',
  Borrador: 'bg-[#f4f5f7] text-[#63666b] border-[#dddee1]',
};

type StatusFilter = 'all' | 'open' | 'Vencida' | 'Pagada' | 'Borrador';

const pill = (active: boolean) =>
  `px-3 py-1.5 rounded-[10000px] font-body-sm text-body-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
    active ? 'bg-text-primary text-canvas-white' : 'text-text-secondary hover:bg-surface-container-low'
  }`;

export const DocumentosScreen: React.FC<DocumentosScreenProps> = ({
  onNavigate,
  onOpenClient,
  invoices,
  cuentasCobro,
  clients,
  clientFilter,
  onClearClientFilter,
  onStatusChanged,
}) => {
  const [kindFilter, setKindFilter] = useState<'all' | Kind>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');

  // shortcut: no pagination, fine for a freelancer's yearly volume; paginate like Clientes if lists grow past a few hundred.
  const docs = [
    ...invoices.map((d) => ({ ...d, kind: 'invoice' as Kind, concept: 'Factura electrónica' })),
    ...cuentasCobro.map((d) => ({ ...d, kind: 'cuenta' as Kind })),
  ]
    .filter((d) => !clientFilter || d.clientId === clientFilter)
    .filter((d) => kindFilter === 'all' || d.kind === kindFilter)
    .filter((d) =>
      statusFilter === 'all' ? true : statusFilter === 'open' ? OPEN_STATUSES.includes(d.status) : d.status === statusFilter
    )
    .filter((d) => {
      const q = search.trim().toLowerCase();
      return !q || [d.number, d.clientName, d.nit, d.concept].some((v) => (v ?? '').toLowerCase().includes(q));
    })
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

  const total = docs.reduce((acc, d) => acc + d.amount, 0);
  const pending = docs.filter((d) => OPEN_STATUSES.includes(d.status)).reduce((acc, d) => acc + d.amount, 0);
  const filterClientName = clients.find((c) => c.id === clientFilter)?.name;

  const changeStatus = async (kind: Kind, id: string, status: string) => {
    setSavingId(id);
    setError('');
    try {
      await updateDocumentStatus(kind, id, status as Invoice['status']);
      onStatusChanged(kind, id, status);
    } catch (e) {
      setError(`No se pudo cambiar el estado: ${(e as any)?.message ?? e}`);
    } finally {
      setSavingId('');
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1200px] mx-auto px-space-md py-space-xl sm:px-space-xl flex flex-col gap-space-lg">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-1">
            <h1 className="font-headline-md text-headline-md text-text-primary font-semibold tracking-tight">Documentos</h1>
            <p className="font-body-sm text-body-sm text-text-secondary">
              Facturas y cuentas de cobro emitidas. Cambia el estado cuando te paguen.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              className="h-10 px-4 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label text-button-label hover:bg-surface-container-low transition-colors flex items-center gap-1.5 cursor-pointer"
              type="button"
              onClick={() => onNavigate('cuentas-cobro')}
            >
              <span className="material-symbols-outlined text-[18px] text-text-secondary">payments</span>
              Nueva cuenta de cobro
            </button>
            <button
              className="h-10 px-5 rounded-[10000px] bg-primary-container hover:bg-primary-hover text-on-primary font-button-label text-button-label transition-colors flex items-center gap-1.5 cursor-pointer"
              type="button"
              onClick={() => onNavigate('facturas')}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nueva factura
            </button>
          </div>
        </div>

        <div className="bg-canvas-white rounded-[20px] border border-border-subtle overflow-hidden">
          <div className="p-space-md flex flex-col gap-space-sm border-b border-border-subtle">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
              <div className="relative w-full md:max-w-sm">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-subtlest text-[18px]">
                  search
                </span>
                <input
                  className="w-full h-10 pl-9 pr-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-sm text-body-sm text-text-primary placeholder:text-text-subtlest focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                  placeholder="Buscar por número, cliente, NIT o concepto..."
                  aria-label="Buscar documentos"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-1 overflow-x-auto" role="group" aria-label="Tipo de documento">
                <button type="button" className={pill(kindFilter === 'all')} onClick={() => setKindFilter('all')}>Todos</button>
                <button type="button" className={pill(kindFilter === 'invoice')} onClick={() => setKindFilter('invoice')}>Facturas</button>
                <button type="button" className={pill(kindFilter === 'cuenta')} onClick={() => setKindFilter('cuenta')}>Cuentas de cobro</button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Estado">
              {([
                ['all', 'Todos los estados'],
                ['open', 'Por cobrar'],
                ['Vencida', 'Vencidas'],
                ['Pagada', 'Pagadas'],
                ['Borrador', 'Borradores'],
              ] as Array<[StatusFilter, string]>).map(([value, label]) => (
                <button key={value} type="button" className={pill(statusFilter === value)} onClick={() => setStatusFilter(value)}>
                  {label}
                </button>
              ))}
              {filterClientName && (
                <span className="ml-auto inline-flex items-center gap-1 px-3 py-1 rounded-[10000px] bg-status-enviada-bg text-status-enviada-text font-body-sm text-body-sm">
                  Cliente: {filterClientName}
                  <button
                    type="button"
                    aria-label="Quitar filtro de cliente"
                    className="material-symbols-outlined text-[16px] cursor-pointer"
                    onClick={onClearClientFilter}
                  >
                    close
                  </button>
                </span>
              )}
            </div>
            {error && (
              <p role="alert" className="font-body-sm text-body-sm text-status-vencida">
                {error}
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[860px]">
              <thead>
                <tr className="bg-surface-container-low text-text-secondary font-caption text-caption uppercase tracking-wider">
                  <th className="py-3 px-space-md font-semibold">Documento</th>
                  <th className="py-3 px-space-md font-semibold">Cliente</th>
                  <th className="py-3 px-space-md font-semibold">Emisión</th>
                  <th className="py-3 px-space-md font-semibold">Vence</th>
                  <th className="py-3 px-space-md font-semibold text-right">Valor COP</th>
                  <th className="py-3 px-space-md font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dddee1] font-body-sm text-body-sm text-text-primary">
                {docs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 px-space-md text-center text-text-subtlest">
                      No hay documentos con estos filtros.
                    </td>
                  </tr>
                )}
                {docs.map((d) => (
                  <tr key={`${d.kind}-${d.id}`} className="hover:bg-[#f7f8f9] transition-colors">
                    <td className="py-3 px-space-md">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-text-subtlest text-[18px]">
                          {d.kind === 'invoice' ? 'receipt_long' : 'payments'}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold whitespace-nowrap">{d.number}</span>
                          <span className="font-caption text-caption text-text-subtlest truncate max-w-[220px]">{d.concept}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-space-md">
                      {d.clientId ? (
                        <button
                          type="button"
                          className="font-semibold text-left hover:text-primary-container cursor-pointer"
                          onClick={() => onOpenClient(d.clientId)}
                        >
                          {d.clientName}
                        </button>
                      ) : (
                        <span className="font-semibold">{d.clientName}</span>
                      )}
                      <div className="font-caption text-caption text-text-subtlest">NIT: {d.nit}</div>
                    </td>
                    <td className="py-3 px-space-md text-text-secondary whitespace-nowrap">{formatFecha(d.date)}</td>
                    <td className="py-3 px-space-md text-text-secondary whitespace-nowrap">{formatFecha(d.dueDate)}</td>
                    <td className="py-3 px-space-md text-right font-semibold whitespace-nowrap tabular-nums">{formatCOP(d.amount)}</td>
                    <td className="py-3 px-space-md">
                      <select
                        className={`h-8 pl-2.5 pr-7 rounded-[10000px] border font-badge-label text-badge-label font-semibold cursor-pointer disabled:opacity-60 ${
                          STATUS_STYLE[d.status] ?? STATUS_STYLE.Borrador
                        }`}
                        aria-label={`Estado de ${d.number}`}
                        value={d.status}
                        disabled={savingId === d.id}
                        onChange={(e) => changeStatus(d.kind, d.id, e.target.value)}
                      >
                        {STATUSES[d.kind].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-space-md py-space-sm border-t border-border-subtle flex flex-col sm:flex-row justify-between gap-1 font-body-sm text-body-sm text-text-subtlest">
            <span>
              {docs.length} {docs.length === 1 ? 'documento' : 'documentos'} · {formatCOP(total, true)}
            </span>
            <span>
              Por cobrar: <span className="font-semibold text-text-primary">{formatCOP(pending, true)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
