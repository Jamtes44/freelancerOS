import React, { useState } from 'react';
import { ScreenId, ServiceItem } from '../types';
import { formatCOP } from '../utils/calculations';

interface CatalogoServiciosScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  services: ServiceItem[];
}

export const CatalogoServiciosScreen: React.FC<CatalogoServiciosScreenProps> = ({
  onNavigate,
  services,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'uiux' | 'dev' | 'consulting'>('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<'uiux' | 'dev' | 'consulting'>('uiux');

  const filteredServices = services.filter((s) => {
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    const matchesSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1200px] mx-auto px-space-md md:px-space-xl py-space-xl flex flex-col gap-space-xl">
        {/* Header Section with Breadcrumbs & Single Primary CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <div className="flex items-center gap-2 font-caption text-caption text-text-subtlest uppercase tracking-wider">
              <span>Configuración Comercial</span>
              <span className="text-border-strong">/</span>
              <span className="text-text-primary font-semibold">Tarifario Maestro</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
              Catálogo de Servicios
            </h1>
            <p className="font-body-md text-body-md text-text-secondary">
              Tarifario base, alcance profesional e impuestos configurados para facturación y
              contratos.
            </p>
          </div>

          {/* Single Primary Action */}
          <div className="flex items-center shrink-0 w-full md:w-auto">
            <button
              className="inline-flex items-center justify-center gap-space-xs h-[44px] px-6 rounded-full bg-primary-container text-on-primary hover:bg-primary-hover active:bg-[#09326c] transition-colors font-button-label text-button-label cursor-pointer shadow-sm w-full md:w-auto"
              type="button"
              onClick={() => setShowAddModal(true)}
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Nuevo servicio</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-sm bg-surface-container-low rounded-xl border border-border-subtle">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-subtlest text-[20px]">
              search
            </span>
            <input
              className="w-full h-10 pl-10 pr-space-md bg-canvas-white rounded-[3px] border border-border-strong font-body-sm text-body-sm text-text-primary placeholder:text-text-subtlest focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
              placeholder="Buscar por título, código o alcance..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 select-none">
            <button
              className={`inline-flex items-center h-8 px-3.5 rounded-full font-badge-label text-badge-label transition-colors cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-status-enviada-bg text-status-enviada-text font-semibold border border-[#b3d4ff]'
                  : 'bg-surface-container-lowest text-text-secondary hover:text-text-primary border border-border-subtle'
              }`}
              type="button"
              onClick={() => setCategoryFilter('all')}
            >
              Todos (8)
            </button>
            <button
              className={`inline-flex items-center h-8 px-3.5 rounded-full font-badge-label text-badge-label transition-colors cursor-pointer ${
                categoryFilter === 'uiux'
                  ? 'bg-status-enviada-bg text-status-enviada-text font-semibold border border-[#b3d4ff]'
                  : 'bg-surface-container-lowest text-text-secondary hover:text-text-primary border border-border-subtle'
              }`}
              type="button"
              onClick={() => setCategoryFilter('uiux')}
            >
              Diseño UI/UX
            </button>
            <button
              className={`inline-flex items-center h-8 px-3.5 rounded-full font-badge-label text-badge-label transition-colors cursor-pointer ${
                categoryFilter === 'dev'
                  ? 'bg-status-enviada-bg text-status-enviada-text font-semibold border border-[#b3d4ff]'
                  : 'bg-surface-container-lowest text-text-secondary hover:text-text-primary border border-border-subtle'
              }`}
              type="button"
              onClick={() => setCategoryFilter('dev')}
            >
              Desarrollo Web
            </button>
            <button
              className={`inline-flex items-center h-8 px-3.5 rounded-full font-badge-label text-badge-label transition-colors cursor-pointer ${
                categoryFilter === 'consulting'
                  ? 'bg-status-enviada-bg text-status-enviada-text font-semibold border border-[#b3d4ff]'
                  : 'bg-surface-container-lowest text-text-secondary hover:text-text-primary border border-border-subtle'
              }`}
              type="button"
              onClick={() => setCategoryFilter('consulting')}
            >
              Consultoría
            </button>
          </div>
        </div>

        {/* Visual Status & Metric Overview Anchor */}
        <div className="rounded-[20px] bg-[#1c2b42] text-canvas-white p-3 sm:p-4 md:p-5 flex flex-col lg:flex-row items-stretch justify-between gap-3 sm:gap-4">
          <div className="flex flex-col justify-between max-w-md">
            <div>
              <span className="font-caption text-caption uppercase tracking-wider text-secondary-fixed-dim">
                Balance del Portafolio
              </span>
              <h2 className="font-headline-md text-headline-md mt-space-xs text-canvas-white">
                Honorarios estandarizados
              </h2>
              <p className="font-body-sm text-body-sm text-border-strong mt-space-xs text-balance">
                Asegura márgenes consistentes y simplifica la emisión de cuentas de cobro bajo
                normatividad DIAN 2024.
              </p>
            </div>
            <div className="mt-space-md flex flex-wrap items-center gap-space-sm">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-canvas-white/10 text-canvas-white font-badge-label text-badge-label">
                <span className="material-symbols-outlined text-[14px] text-status-pagada">
                  verified
                </span>
                Régimen Simple / Ordinario
              </span>
              <span className="font-caption text-caption text-border-strong">Resolución 000165</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 items-stretch w-full lg:w-auto min-w-0">
            {/* Metric 1 */}
            <div className="flex flex-col px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg bg-canvas-white/5 border border-white/10 min-h-[62px] sm:min-h-[68px] md:min-h-[72px] justify-between overflow-hidden min-w-0">
              <span className="font-caption text-[8px] sm:text-[9px] leading-tight text-secondary-fixed-dim truncate">
                Tarifa Hora Promedio
              </span>
              <span className="tabular-nums whitespace-nowrap leading-none font-semibold text-canvas-white text-[9px] xs:text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px]">
                $175.000
              </span>
              <span className="font-caption text-[7px] sm:text-[8px] leading-tight text-status-pagada flex items-center gap-0.5 truncate">
                <span className="material-symbols-outlined text-[9px] sm:text-[10px]">trending_up</span> +8.5% YoY
              </span>
            </div>
            {/* Metric 2 */}
            <div className="flex flex-col px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg bg-canvas-white/5 border border-white/10 min-h-[62px] sm:min-h-[68px] md:min-h-[72px] justify-between overflow-hidden min-w-0">
              <span className="font-caption text-[8px] sm:text-[9px] leading-tight text-secondary-fixed-dim truncate">
                Ticket Proyecto Base
              </span>
              <span className="tabular-nums whitespace-nowrap leading-none font-semibold text-canvas-white text-[9px] xs:text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px]">
                $4.430.000
              </span>
              <span className="font-caption text-[7px] sm:text-[8px] leading-tight text-secondary-fixed-dim truncate">
                4 servicios
              </span>
            </div>
            {/* Metric 3 */}
            <div className="flex flex-col px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg bg-canvas-white/5 border border-white/10 min-h-[62px] sm:min-h-[68px] md:min-h-[72px] justify-between overflow-hidden min-w-0">
              <span className="font-caption text-[8px] sm:text-[9px] leading-tight text-secondary-fixed-dim truncate">
                Tarifas Exentas IVA
              </span>
              <span className="tabular-nums whitespace-nowrap leading-none font-semibold text-status-pagada text-[9px] xs:text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px]">
                1 Servicio
              </span>
              <span className="font-caption text-[7px] sm:text-[8px] leading-tight text-secondary-fixed-dim truncate">
                Art. 476 E.T.
              </span>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {filteredServices.map((service) => {
            const isUx = service.category === 'uiux';
            const isDev = service.category === 'dev';
            const isExempt = service.ivaText.includes('Exento');

            return (
              <article
                key={service.id}
                className="service-card-item rounded-[20px] bg-canvas-white p-space-xl flex flex-col justify-between border border-border-subtle hover:border-primary-container transition-all group shadow-none"
              >
                <div>
                  {/* Top Badges & Meta */}
                  <div className="flex items-center justify-between gap-space-sm mb-space-md">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-badge-label text-badge-label ${
                        isUx
                          ? 'bg-status-enviada-bg text-status-enviada-text border border-[#b3d4ff]'
                          : isDev
                          ? 'bg-secondary-container text-on-secondary-fixed border border-secondary-fixed-dim'
                          : 'bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed-dim'
                      }`}
                    >
                      {isUx ? 'Diseño UI/UX' : isDev ? 'Desarrollo Web' : 'Consultoría'}
                    </span>
                    <span className="inline-flex items-center gap-1 font-caption text-caption text-text-subtlest">
                      <span className="material-symbols-outlined text-[14px]">
                        {service.unit === 'Hora'
                          ? 'schedule'
                          : service.unit === 'Mes'
                          ? 'calendar_month'
                          : 'inventory_2'}
                      </span>{' '}
                      {service.unit}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="service-title font-headline-sm text-headline-sm text-text-primary group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  {/* Rates Display */}
                  <div className="mt-space-md pb-space-md">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-currency-display text-currency-display text-text-primary font-semibold tracking-tight tabular-nums whitespace-nowrap">
                        {formatCOP(service.price)}
                      </span>
                      <span className="font-body-sm text-body-sm text-text-subtlest">
                        {service.unit === 'Hora'
                          ? 'COP / hr'
                          : service.unit === 'Mes'
                          ? 'COP / mes'
                          : 'COP'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-badge-label text-badge-label ${
                          isExempt
                            ? 'bg-status-pagada/15 text-status-pagada font-semibold border border-[#abf5d1]'
                            : 'bg-surface-container-high text-text-secondary border border-border-subtle'
                        }`}
                      >
                        {service.ivaText}
                      </span>
                      <span className="font-caption text-caption text-text-subtlest">
                        Cód: {service.code}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="service-desc font-body-sm text-body-sm text-text-secondary mt-space-sm leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-space-md flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-caption text-caption px-2 py-0.5 rounded bg-surface-container text-text-secondary border border-border-subtle"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Row */}
                <div className="mt-space-lg pt-space-md flex items-center justify-between gap-2 border-t border-border-subtle">
                  <button
                    className="inline-flex items-center justify-center h-[38px] px-5 rounded-full bg-surface-container-lowest text-text-primary hover:bg-surface-container-low transition-colors font-button-label text-body-sm border border-border-strong cursor-pointer w-full sm:w-auto"
                    type="button"
                    onClick={() => onNavigate('facturas')}
                  >
                    Usar en Factura
                  </button>
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center text-text-subtlest hover:text-text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                    title="Duplicar servicio"
                    type="button"
                    onClick={() => {
                      alert(`Servicio "${service.title}" duplicado en el tarifario.`);
                    }}
                  >
                    <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Informational Banner: Retention and Tax Calculation */}
        <section className="rounded-[20px] bg-status-enviada-bg p-space-lg md:p-space-xl flex flex-col md:flex-row items-start md:items-center gap-space-lg border border-[#b3d4ff]">
          <div className="w-12 h-12 rounded-full bg-canvas-white flex items-center justify-center shrink-0 text-primary-container shadow-sm border border-[#b3d4ff]">
            <span className="material-symbols-outlined text-[28px]">calculate</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-headline-sm text-body-md font-semibold text-text-primary">
                Cálculo Automático de Impuestos y Retenciones en Facturas
              </h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-caption text-caption font-semibold bg-canvas-white text-status-enviada-text border border-[#b3d4ff]">
                DIAN 2024
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed text-balance">
              Al añadir ítems de este catálogo a tus facturas o cuentas de cobro, el sistema
              discriminará automáticamente el{' '}
              <strong className="text-text-primary font-medium">IVA (19% o Exento)</strong>, la{' '}
              <strong className="text-text-primary font-medium">
                Retención en la Fuente por Servicios (4% o 11%)
              </strong>{' '}
              y el <strong className="text-text-primary font-medium">ReteICA</strong> correspondiente
              según la personería jurídica de tu cliente en Colombia.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-space-sm w-full md:w-auto justify-end">
            {/* Target for: //button[contains(., 'Ajustar Tasas Fiscales')] */}
            <button
              className="h-10 px-4 rounded-full bg-canvas-white text-text-primary hover:bg-surface-container-low transition-colors font-button-label text-body-sm border border-border-strong cursor-pointer shadow-sm w-full md:w-auto"
              type="button"
              onClick={() => onNavigate('configuracion')}
            >
              Ajustar Tasas Fiscales
            </button>
          </div>
        </section>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#091e42]/50 flex items-center justify-center p-4">
          <div className="bg-canvas-white rounded-[20px] border border-border-subtle p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                Nuevo Servicio en Catálogo
              </h3>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-subtlest hover:text-text-primary"
                onClick={() => setShowAddModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="font-caption text-caption text-text-subtlest uppercase">
                  Título del Servicio
                </label>
                <input
                  className="w-full mt-1 h-10 px-3 border border-border-strong rounded-[3px] text-body-sm"
                  placeholder="ej. Auditoría SEO & Core Web Vitals"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="font-caption text-caption text-text-subtlest uppercase">
                  Categoría
                </label>
                <select
                  className="w-full mt-1 h-10 px-3 border border-border-strong rounded-[3px] text-body-sm"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                >
                  <option value="uiux">Diseño UI/UX</option>
                  <option value="dev">Desarrollo Web</option>
                  <option value="consulting">Consultoría</option>
                </select>
              </div>
              <div>
                <label className="font-caption text-caption text-text-subtlest uppercase">
                  Precio Base (COP)
                </label>
                <input
                  className="w-full mt-1 h-10 px-3 border border-border-strong rounded-[3px] text-body-sm"
                  placeholder="ej. 3500000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
              <button
                className="h-10 px-4 rounded-[10000px] border border-border-strong text-text-primary font-button-label"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </button>
              <button
                className="h-10 px-6 rounded-[10000px] bg-primary-container text-white font-button-label"
                onClick={() => {
                  setShowAddModal(false);
                }}
              >
                Guardar en Tarifario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
