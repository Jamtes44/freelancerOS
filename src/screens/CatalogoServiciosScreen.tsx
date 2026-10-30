import React, { useState } from 'react';
import { ScreenId, ServiceItem } from '../types';
import { formatCOP } from '../utils/calculations';
import { saveService, deleteService } from '../services/supabaseService';

interface CatalogoServiciosScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  services: ServiceItem[];
  onServiceSaved: (service: ServiceItem) => void;
  onServiceDeleted: (id: string) => void;
  onUseInInvoice: (service: ServiceItem) => void;
}

type Category = ServiceItem['category'];

const CATEGORY_LABEL: Record<Category, string> = { uiux: 'Diseño UI/UX', dev: 'Desarrollo Web', consulting: 'Consultoría' };
const IVA_OPTIONS = ['IVA 19%', 'Exento (0% IVA)'];

const isExempt = (s: ServiceItem) => s.ivaText.includes('Exento');

const emptyService = (): ServiceItem => ({
  id: crypto.randomUUID(),
  title: '',
  code: '',
  category: 'uiux',
  unit: 'Proyecto',
  price: 0,
  ivaText: 'IVA 19%',
  description: '',
  tags: [],
});

const inputClass = 'w-full mt-1 h-10 px-3 border border-border-strong rounded-[3px] text-body-sm normal-case text-text-primary bg-canvas-white';
const labelClass = 'font-caption text-caption text-text-subtlest uppercase';

/** Create, edit or duplicate: the caller passes the starting values and whether it is a new record. */
const ServiceModal: React.FC<{
  initial: ServiceItem;
  isNew: boolean;
  onClose: () => void;
  onSaved: (s: ServiceItem) => void;
}> = ({ initial, isNew, onClose, onSaved }) => {
  const [form, setForm] = useState(initial);
  const [price, setPrice] = useState(initial.price ? initial.price.toLocaleString('es-CO') : '');
  const [tags, setTags] = useState(initial.tags.join(', '));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    const numericPrice = parseInt(price.replace(/\D/g, ''), 10) || 0;
    const service: ServiceItem = {
      ...form,
      title: form.title.trim(),
      code: form.code.trim(),
      description: form.description.trim(),
      price: numericPrice,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (!service.title) return setError('El título es obligatorio.');
    if (numericPrice <= 0) return setError('Escribe un precio mayor que cero.');
    setSaving(true);
    setError('');
    try {
      await saveService(service);
      onSaved(service);
    } catch (e) {
      // Modal stays open with the typed values so nothing is lost.
      setError(`No se pudo guardar: ${(e as any)?.message ?? e}`);
      setSaving(false);
    }
  };

  const set = <K extends keyof ServiceItem>(key: K, value: ServiceItem[K]) => setForm({ ...form, [key]: value });
  const ivaOptions = IVA_OPTIONS.includes(form.ivaText) ? IVA_OPTIONS : [form.ivaText, ...IVA_OPTIONS];

  return (
    <div className="fixed inset-0 z-50 bg-[#091e42]/50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
      <div className="bg-canvas-white rounded-[20px] border border-border-subtle p-6 max-w-xl w-full shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <h3 id="service-modal-title" className="font-headline-sm text-headline-sm text-text-primary font-semibold">
            {isNew ? 'Nuevo servicio' : 'Editar servicio'}
          </h3>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-subtlest hover:text-text-primary"
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className={`${labelClass} sm:col-span-2`}>
            Título del servicio *
            <input className={inputClass} placeholder="ej. Auditoría SEO & Core Web Vitals" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </label>
          <label className={labelClass}>
            Categoría
            <select className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value as Category)}>
              {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Unidad
            <select className={inputClass} value={form.unit} onChange={(e) => set('unit', e.target.value as ServiceItem['unit'])}>
              <option value="Hora">Hora</option>
              <option value="Proyecto">Proyecto</option>
              <option value="Mes">Mes</option>
            </select>
          </label>
          <label className={labelClass}>
            Precio base (COP) *
            <input className={inputClass} inputMode="numeric" placeholder="ej. 3.500.000" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <label className={labelClass}>
            IVA
            <select className={inputClass} value={form.ivaText} onChange={(e) => set('ivaText', e.target.value)}>
              {ivaOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Código
            <input className={inputClass} placeholder="ej. UX-01" value={form.code} onChange={(e) => set('code', e.target.value)} />
          </label>
          <label className={labelClass}>
            Etiquetas (separadas por coma)
            <input className={inputClass} placeholder="ej. Figma, Prototipado" value={tags} onChange={(e) => setTags(e.target.value)} />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Descripción y alcance
            <textarea
              className="w-full mt-1 px-3 py-2 border border-border-strong rounded-[3px] text-body-sm normal-case text-text-primary bg-canvas-white resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </label>
        </div>
        {error && (
          <p role="alert" className="text-body-sm text-status-vencida">
            {error}
          </p>
        )}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
          <button className="h-10 px-4 rounded-[10000px] border border-border-strong text-text-primary font-button-label" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="h-10 px-6 rounded-[10000px] bg-primary-container text-white font-button-label disabled:opacity-60"
            type="button"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? 'Guardando...' : 'Guardar en tarifario'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CatalogoServiciosScreen: React.FC<CatalogoServiciosScreenProps> = ({
  onNavigate,
  services,
  onServiceSaved,
  onServiceDeleted,
  onUseInInvoice,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ initial: ServiceItem; isNew: boolean } | null>(null);
  const [deletingId, setDeletingId] = useState('');

  const filteredServices = services.filter((s) => {
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search || s.title.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const average = (list: ServiceItem[]) => (list.length ? Math.round(list.reduce((acc, s) => acc + s.price, 0) / list.length) : 0);
  const hourly = services.filter((s) => s.unit === 'Hora');
  const projects = services.filter((s) => s.unit === 'Proyecto');
  const exemptCount = services.filter(isExempt).length;

  const handleDelete = async (s: ServiceItem) => {
    if (!window.confirm(`¿Eliminar "${s.title}" del catálogo? Las facturas ya emitidas no cambian.`)) return;
    setDeletingId(s.id);
    try {
      await deleteService(s.id);
      onServiceDeleted(s.id);
    } catch (e) {
      window.alert(`No se pudo eliminar: ${(e as any)?.message ?? e}`);
    } finally {
      setDeletingId('');
    }
  };

  const pillClass = (active: boolean) =>
    `inline-flex items-center h-8 px-3.5 rounded-full font-badge-label text-badge-label transition-colors cursor-pointer ${
      active
        ? 'bg-status-enviada-bg text-status-enviada-text font-semibold border border-[#b3d4ff]'
        : 'bg-surface-container-lowest text-text-secondary hover:text-text-primary border border-border-subtle'
    }`;

  const metrics = [
    { label: 'Tarifa hora promedio', value: hourly.length ? formatCOP(average(hourly)) : '—', hint: `${hourly.length} por hora` },
    { label: 'Ticket proyecto promedio', value: projects.length ? formatCOP(average(projects)) : '—', hint: `${projects.length} por proyecto` },
    { label: 'Exentos de IVA', value: `${exemptCount} ${exemptCount === 1 ? 'servicio' : 'servicios'}`, hint: `de ${services.length} en total` },
  ];

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
            <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">Catálogo de Servicios</h1>
            <p className="font-body-md text-body-md text-text-secondary">
              Tarifario base, alcance profesional e impuestos configurados para facturación y contratos.
            </p>
          </div>

          <div className="flex items-center shrink-0 w-full md:w-auto">
            <button
              className="inline-flex items-center justify-center gap-space-xs h-[44px] px-6 rounded-full bg-primary-container text-on-primary hover:bg-primary-hover active:bg-[#09326c] transition-colors font-button-label text-button-label cursor-pointer shadow-sm w-full md:w-auto"
              type="button"
              onClick={() => setModal({ initial: emptyService(), isNew: true })}
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Nuevo servicio</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-sm bg-surface-container-low rounded-xl border border-border-subtle">
          <div className="relative w-full lg:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-subtlest text-[20px]">search</span>
            <input
              className="w-full h-10 pl-10 pr-space-md bg-canvas-white rounded-[3px] border border-border-strong font-body-sm text-body-sm text-text-primary placeholder:text-text-subtlest focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
              placeholder="Buscar por título, código o alcance..."
              aria-label="Buscar servicios"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 select-none">
            <button className={pillClass(categoryFilter === 'all')} type="button" onClick={() => setCategoryFilter('all')}>
              Todos ({services.length})
            </button>
            {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
              <button key={c} className={pillClass(categoryFilter === c)} type="button" onClick={() => setCategoryFilter(c)}>
                {CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio summary, computed from the catalog */}
        <div className="rounded-[20px] bg-[#1c2b42] text-canvas-white p-3 sm:p-4 md:p-5 flex flex-col lg:flex-row items-stretch justify-between gap-3 sm:gap-4">
          <div className="flex flex-col justify-between max-w-md">
            <span className="font-caption text-caption uppercase tracking-wider text-secondary-fixed-dim">Balance del Portafolio</span>
            <h2 className="font-headline-md text-headline-md mt-space-xs text-canvas-white">Honorarios estandarizados</h2>
            <p className="font-body-sm text-body-sm text-border-strong mt-space-xs text-balance">
              Precios base de tu catálogo para usar en facturas y cuentas de cobro.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 items-stretch w-full lg:w-auto min-w-0">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col px-3 py-2 rounded-lg bg-canvas-white/5 border border-white/10 justify-between min-w-0">
                <span className="font-caption text-caption text-secondary-fixed-dim truncate">{m.label}</span>
                <span className="tabular-nums whitespace-nowrap font-semibold text-canvas-white text-body-md mt-0.5">{m.value}</span>
                <span className="font-caption text-caption text-secondary-fixed-dim truncate mt-0.5">{m.hint}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 && (
          <p className="font-body-md text-body-md text-text-subtlest">
            {services.length === 0 ? 'Aún no tienes servicios. Crea el primero con "Nuevo servicio".' : 'Ningún servicio coincide con la búsqueda.'}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {filteredServices.map((service) => {
            const isUx = service.category === 'uiux';
            const isDev = service.category === 'dev';
            const deleting = deletingId === service.id;

            return (
              <article
                key={service.id}
                aria-busy={deleting}
                className={`service-card-item rounded-[20px] bg-canvas-white p-space-xl flex flex-col justify-between border border-border-subtle hover:border-primary-container transition-all group shadow-none ${
                  deleting ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div>
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
                      {CATEGORY_LABEL[service.category]}
                    </span>
                    <span className="inline-flex items-center gap-1 font-caption text-caption text-text-subtlest">
                      <span className="material-symbols-outlined text-[14px]">
                        {service.unit === 'Hora' ? 'schedule' : service.unit === 'Mes' ? 'calendar_month' : 'inventory_2'}
                      </span>{' '}
                      {service.unit}
                    </span>
                  </div>

                  <h3 className="service-title font-headline-sm text-headline-sm text-text-primary group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  <div className="mt-space-md pb-space-md">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-currency-display text-currency-display text-text-primary font-semibold tracking-tight tabular-nums whitespace-nowrap">
                        {formatCOP(service.price)}
                      </span>
                      <span className="font-body-sm text-body-sm text-text-subtlest">
                        {service.unit === 'Hora' ? 'COP / hr' : service.unit === 'Mes' ? 'COP / mes' : 'COP'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-badge-label text-badge-label ${
                          isExempt(service)
                            ? 'bg-status-pagada/15 text-status-pagada font-semibold border border-[#abf5d1]'
                            : 'bg-surface-container-high text-text-secondary border border-border-subtle'
                        }`}
                      >
                        {service.ivaText}
                      </span>
                      {service.code && <span className="font-caption text-caption text-text-subtlest">Cód: {service.code}</span>}
                    </div>
                  </div>

                  <p className="service-desc font-body-sm text-body-sm text-text-secondary mt-space-sm leading-relaxed">{service.description}</p>

                  <div className="mt-space-md flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span key={tag} className="font-caption text-caption px-2 py-0.5 rounded bg-surface-container text-text-secondary border border-border-subtle">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-space-lg pt-space-md flex items-center justify-between gap-2 border-t border-border-subtle">
                  <button
                    className="inline-flex items-center justify-center h-[38px] px-5 rounded-full bg-surface-container-lowest text-text-primary hover:bg-surface-container-low transition-colors font-button-label text-body-sm border border-border-strong cursor-pointer"
                    type="button"
                    onClick={() => onUseInInvoice(service)}
                  >
                    {deleting ? 'Eliminando...' : 'Usar en Factura'}
                  </button>
                  <div className="flex items-center">
                    {[
                      { icon: 'edit', label: 'Editar', onClick: () => setModal({ initial: service, isNew: false }) },
                      {
                        icon: 'content_copy',
                        label: 'Duplicar',
                        onClick: () => setModal({ initial: { ...service, id: crypto.randomUUID(), title: `${service.title} (copia)` }, isNew: true }),
                      },
                      { icon: 'delete', label: 'Eliminar', onClick: () => handleDelete(service) },
                    ].map((a) => (
                      <button
                        key={a.icon}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-text-subtlest transition-colors cursor-pointer ${
                          a.icon === 'delete' ? 'hover:text-[#ae2e24] hover:bg-[#ffebe6]' : 'hover:text-text-primary hover:bg-surface-container-low'
                        }`}
                        title={a.label}
                        aria-label={`${a.label} ${service.title}`}
                        type="button"
                        onClick={a.onClick}
                      >
                        <span className="material-symbols-outlined text-[20px]">{a.icon}</span>
                      </button>
                    ))}
                  </div>
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
            <h4 className="font-headline-sm text-body-md font-semibold text-text-primary">Cálculo automático de impuestos en facturas</h4>
            <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed text-balance">
              Al usar un servicio en una factura se aplica su IVA (19% o exento) y la{' '}
              <strong className="text-text-primary font-medium">retención en la fuente del 4%</strong> sobre el subtotal.
            </p>
          </div>
        </section>
      </div>

      {modal && (
        <ServiceModal
          initial={modal.initial}
          isNew={modal.isNew}
          onClose={() => setModal(null)}
          onSaved={(s) => {
            setModal(null);
            onServiceSaved(s);
          }}
        />
      )}
    </div>
  );
};
