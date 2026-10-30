import React from 'react';
import { ScreenId, Invoice, CuentaCobro, Client } from '../types';
import { formatCOP } from '../utils/calculations';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  onOpenClient: (clientId: string) => void;
  invoices: Invoice[];
  cuentasCobro: CuentaCobro[];
  clients: Client[];
}

const STATUS_STYLES: Record<string, { className: string; outline: string }> = {
  Pagada: { className: 'bg-[#e3fcef] text-[#22a06b]', outline: '#abf5d1' },
  Enviada: { className: 'bg-status-enviada-bg text-status-enviada-text', outline: '#b3d4ff' },
  Pendiente: { className: 'bg-[#fff0b3] text-[#c75300]', outline: '#ffe380' },
  Vencida: { className: 'bg-[#ffebe6] text-[#ae2e24]', outline: '#ffbdad' },
  Borrador: { className: 'bg-[#f4f5f7] text-[#63666b]', outline: '#dddee1' },
};

// Dates are stored as text, either ISO ("2025-06-05") or "21 Nov 2024".
// shortcut: relies on the browser parsing "21 Nov 2024"; switch the columns to `date` to drop this.
const parseDate = (s: string): Date | null => {
  if (!s) return null;
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T00:00:00`) : new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

const daysUntil = (s: string): number | null => {
  const d = parseDate(s);
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
};

const dueLabel = (dueDate: string) => {
  const days = daysUntil(dueDate);
  if (days === null) return { text: `Vence ${dueDate}`, className: 'bg-surface-container-high text-text-secondary', outline: undefined };
  if (days < 0) return { text: `Vencida hace ${-days} días`, className: 'bg-[#ffebe6] text-[#ae2e24]', outline: '#ffbdad' };
  if (days === 0) return { text: 'Vence hoy', className: 'bg-[#ffebe6] text-[#ae2e24]', outline: '#ffbdad' };
  if (days <= 7) return { text: `Vence en ${days} días`, className: 'bg-[#fff0b3] text-[#c75300]', outline: '#ffe380' };
  return { text: `Vence en ${days} días`, className: 'bg-surface-container-high text-text-secondary', outline: undefined };
};

const MetricCard: React.FC<{ title: string; icon: string; value: React.ReactNode; badge: string; badgeStyle: string; badgeOutline: string; caption?: string }> = ({
  title,
  icon,
  value,
  badge,
  badgeStyle,
  badgeOutline,
  caption,
}) => (
  <div
    className="bg-surface-container-lowest rounded-[20px] p-space-lg md:p-space-xl flex flex-col justify-between gap-space-lg"
    style={{ outline: '1px solid #dddee1' }}
  >
    <div className="flex items-center justify-between">
      <span className="font-body-sm text-body-sm text-text-secondary font-medium">{title}</span>
      <span className="material-symbols-outlined text-text-subtlest text-[20px]">{icon}</span>
    </div>
    <div className="flex flex-col gap-2">
      <div className="font-currency-display text-currency-display text-text-primary tracking-tight break-words tabular-nums whitespace-nowrap">
        {value}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-[10000px] font-badge-label text-badge-label ${badgeStyle}`}
          style={{ outline: `1px solid ${badgeOutline}` }}
        >
          {badge}
        </span>
        {caption && <span className="font-caption text-caption text-text-subtlest">{caption}</span>}
      </div>
    </div>
  </div>
);

const Cop: React.FC<{ amount: number }> = ({ amount }) => (
  <>
    {formatCOP(amount)} <span className="font-caption text-caption text-text-subtlest uppercase">COP</span>
  </>
);

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onOpenClient,
  invoices,
  cuentasCobro,
  clients,
}) => {
  const sum = (list: { amount: number }[]) => list.reduce((acc, d) => acc + d.amount, 0);

  const paidInvoices = invoices.filter((i) => i.status === 'Pagada');
  const paidCuentas = cuentasCobro.filter((c) => c.status === 'Pagada');
  const openInvoices = invoices.filter((i) => ['Enviada', 'Pendiente', 'Vencida'].includes(i.status));
  const overdueInvoices = invoices.filter((i) => i.status === 'Vencida');
  const openCuentas = cuentasCobro
    .filter((c) => c.status === 'Pendiente' || c.status === 'Vencida')
    .sort((a, b) => (parseDate(a.dueDate)?.getTime() ?? Infinity) - (parseDate(b.dueDate)?.getTime() ?? Infinity));
  const activeClients = clients.filter((c) => c.status === 'Activo').length;
  const recentInvoices = invoices.slice(0, 5);
  const today = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[1200px] w-full mx-auto px-space-md md:px-margin py-space-xl flex flex-col gap-space-xl">
        {/* Header de Página */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-[10000px] font-caption text-caption uppercase tracking-wider bg-surface-container text-text-secondary font-semibold">
                FreelanceOS v2.4
              </span>
              <span className="hidden sm:inline text-text-subtlest font-caption text-caption">•</span>
              <span className="font-caption text-caption text-text-subtlest font-medium">
                Zona Horaria: America/Bogota (COT)
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-text-primary font-medium tracking-tight">
              Panel de Control
            </h1>
            <p className="font-body-md text-body-md text-text-secondary text-balance">
              Resumen operativo, balance impositivo y flujo de cobros actualizado al {today}.
            </p>
          </div>

          {/* ÚNICO Botón Primario de Píldora Azul en la Pantalla */}
          <div className="shrink-0 w-full md:w-auto">
            <button
              className="w-full md:w-auto inline-flex items-center justify-center gap-space-sm h-11 px-6 rounded-[10000px] bg-primary-container text-on-primary font-button-label text-button-label hover:bg-primary-hover active:bg-[#09326c] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container/20 cursor-pointer shadow-sm"
              type="button"
              onClick={() => onNavigate('facturas')}
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Crear nuevo documento</span>
            </button>
          </div>
        </header>

        {/* Banner de cuentas pendientes */}
        {openCuentas.length > 0 && (
          <section className="bg-[#1c2b42] text-surface-container-lowest rounded-[20px] p-space-lg md:p-space-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg relative overflow-hidden">
            <div className="flex items-start gap-space-md max-w-3xl">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[#d8e2ff] text-[22px]">account_balance</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-space-sm">
                  <span className="font-badge-label text-badge-label uppercase tracking-widest text-[#bec7d3] font-semibold">
                    Cuentas de cobro
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffbdad]"></span>
                </div>
                <p className="font-body-md text-body-md text-white font-normal leading-relaxed text-balance">
                  Tienes <strong className="font-semibold text-white">{openCuentas.length}</strong>{' '}
                  {openCuentas.length === 1 ? 'cuenta de cobro pendiente' : 'cuentas de cobro pendientes'} por{' '}
                  {formatCOP(sum(openCuentas), true)}.
                </p>
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <button
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[10000px] bg-white text-text-primary font-button-label text-button-label hover:bg-[#f4f5f7] transition-colors focus:outline-none cursor-pointer"
                type="button"
                onClick={() => onNavigate('cuentas-cobro')}
              >
                <span>Ver pendientes</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </section>
        )}

        {/* Fila de 4 Tarjetas de Métricas Clave */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          <MetricCard
            title="Ingresos cobrados"
            icon="trending_up"
            value={<Cop amount={sum(paidInvoices) + sum(paidCuentas)} />}
            badge={`${paidInvoices.length + paidCuentas.length} pagados`}
            badgeStyle="bg-[#e3fcef] text-[#22a06b]"
            badgeOutline="#abf5d1"
            caption="Facturas y cuentas"
          />
          <MetricCard
            title="Facturas pendientes"
            icon="pending_actions"
            value={<Cop amount={sum(openInvoices)} />}
            badge={`${openInvoices.length} por cobrar`}
            badgeStyle="bg-[#fff0b3] text-[#c75300]"
            badgeOutline="#ffe380"
            caption={overdueInvoices.length > 0 ? `${overdueInvoices.length} vencidas` : undefined}
          />
          <MetricCard
            title="Cuentas de cobro pendientes"
            icon="request_quote"
            value={<Cop amount={sum(openCuentas)} />}
            badge={`${openCuentas.length} por cobrar`}
            badgeStyle="bg-[#fff0b3] text-[#c75300]"
            badgeOutline="#ffe380"
          />
          <MetricCard
            title="Clientes activos"
            icon="corporate_fare"
            value={`${activeClients} ${activeClients === 1 ? 'empresa' : 'empresas'}`}
            badge={`de ${clients.length} clientes`}
            badgeStyle="bg-status-enviada-bg text-status-enviada-text"
            badgeOutline="#b3d4ff"
          />
        </section>

        {/* Sección Inferior Asimétrica: 7 Columnas + 5 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Columna Izquierda (7/12): Facturas Recientes */}
          <section
            className="lg:col-span-7 bg-surface-container-lowest rounded-[20px] overflow-hidden flex flex-col"
            style={{ outline: '1px solid #dddee1' }}
          >
            <div className="p-space-lg md:p-space-xl flex items-center justify-between bg-surface-container-lowest">
              <div className="flex flex-col gap-0.5">
                <h2 className="font-headline-sm text-headline-sm text-text-primary font-medium">Facturas Recientes</h2>
                <p className="font-body-sm text-body-sm text-text-subtlest">
                  Seguimiento contable en Pesos Colombianos con retenciones aplicadas
                </p>
              </div>
              <a
                className="font-button-label text-button-label text-primary-container hover:text-primary-hover flex items-center gap-1 cursor-pointer"
                href="#facturas"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('facturas');
                }}
              >
                <span>Ver todas</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-text-secondary font-caption text-caption uppercase tracking-wider">
                    <th className="py-3 px-space-md font-semibold">N° Factura</th>
                    <th className="py-3 px-space-md font-semibold">Cliente</th>
                    <th className="py-3 px-space-md font-semibold">Emisión</th>
                    <th className="py-3 px-space-md font-semibold text-right">Valor COP</th>
                    <th className="py-3 px-space-md font-semibold text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm font-body-sm text-text-primary divide-y divide-[#dddee1]">
                  {recentInvoices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 px-space-md text-center text-text-subtlest">
                        Aún no hay facturas registradas.
                      </td>
                    </tr>
                  )}
                  {recentInvoices.map((inv) => {
                    const style = STATUS_STYLES[inv.status] ?? STATUS_STYLES.Borrador;
                    const clickable = Boolean(inv.clientId);
                    return (
                      <tr
                        key={inv.id}
                        className={`hover:bg-[#f7f8f9] transition-colors ${clickable ? 'cursor-pointer group' : ''}`}
                        onClick={clickable ? () => onOpenClient(inv.clientId) : undefined}
                      >
                        <td className="py-3.5 px-space-md font-medium text-text-primary whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-text-subtlest text-[18px]">receipt</span>
                            <span className="group-hover:text-primary-container">{inv.number}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-space-md">
                          <div className="flex flex-col">
                            <span className="font-semibold text-text-primary group-hover:text-primary-container">
                              {inv.clientName}
                            </span>
                            <span className="font-caption text-caption text-text-subtlest">NIT: {inv.nit}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-space-md text-text-secondary whitespace-nowrap">{inv.date}</td>
                        <td className="py-3.5 px-space-md text-right font-semibold text-text-primary whitespace-nowrap">
                          {formatCOP(inv.amount)}
                        </td>
                        <td className="py-3.5 px-space-md text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-center h-6 px-2.5 rounded-[10000px] font-badge-label text-badge-label ${style.className}`}
                            style={{ outline: `1px solid ${style.outline}` }}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-space-md bg-surface-container-low/60 flex flex-col md:flex-row md:items-center justify-between gap-1 text-caption font-caption text-text-subtlest text-center md:text-left">
              <span>
                Mostrando {recentInvoices.length} de {invoices.length} facturas
              </span>
              <span className="font-medium text-text-secondary">Totales con retención en la fuente (ICA / ReteFuente)</span>
            </div>
          </section>

          {/* Columna Derecha (5/12): Próximos Vencimientos y Cuentas de Cobro */}
          <section
            className="lg:col-span-5 bg-surface-container-lowest rounded-[20px] p-space-xl flex flex-col gap-space-lg"
            style={{ outline: '1px solid #dddee1' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <h2 className="font-headline-sm text-headline-sm text-text-primary font-medium">Vencimientos &amp; Cuentas</h2>
                <p className="font-body-sm text-body-sm text-text-subtlest">Cuentas de cobro pendientes por fecha de vencimiento</p>
              </div>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-high font-badge-label text-badge-label text-text-secondary font-semibold">
                {openCuentas.length}
              </span>
            </div>

            <div className="flex flex-col gap-space-md">
              {openCuentas.length === 0 && (
                <p className="font-body-sm text-body-sm text-text-subtlest">No tienes cuentas de cobro pendientes.</p>
              )}
              {openCuentas.map((cc) => {
                const due = dueLabel(cc.dueDate);
                return (
                  <div
                    key={cc.id}
                    className="p-space-md rounded-[12px] bg-surface-container-lowest flex flex-col gap-space-sm"
                    style={{ outline: '1px solid #dddee1' }}
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex flex-col min-w-0">
                        <span className="font-body-sm text-body-sm font-semibold text-text-primary">{cc.clientName}</span>
                        <span className="font-caption text-caption text-text-secondary line-clamp-2">{cc.concept}</span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-[10000px] font-badge-label text-[11px] font-medium ${due.className}`}
                        style={due.outline ? { outline: `1px solid ${due.outline}` } : undefined}
                      >
                        {due.text}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 gap-2 flex-wrap">
                      <div className="flex flex-col">
                        <span className="font-caption text-caption text-text-subtlest">Monto neto</span>
                        <span className="font-body-sm text-body-sm font-semibold text-text-primary tabular-nums whitespace-nowrap">
                          {formatCOP(cc.amount, true)}
                        </span>
                      </div>
                      <button
                        className="h-9 px-4 rounded-[10000px] bg-white text-text-primary font-button-label text-body-sm hover:bg-[#f4f5f7] transition-colors cursor-pointer w-full sm:w-auto"
                        style={{ outline: '1px solid #b7b9be' }}
                        type="button"
                        onClick={() => onNavigate('cuentas-cobro')}
                      >
                        Cobrar cuenta
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-space-xs p-space-md rounded-[12px] bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-text-secondary text-[20px]">verified_user</span>
                <span className="font-body-sm text-body-sm text-text-secondary">Cumplimiento según Ley 2277 / DIAN</span>
              </div>
              <a
                className="font-caption text-caption font-semibold text-primary hover:underline cursor-pointer"
                href="#contratos"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('contratos');
                }}
              >
                Ver plantillas
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
