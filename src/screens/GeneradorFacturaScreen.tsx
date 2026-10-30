import React, { useState } from 'react';
import { ScreenId, InvoiceItem, Client, Invoice, FreelancerProfile } from '../types';
import {
  formatCOP,
  calculateTaxSummary,
  nextDocumentNumber,
  addDaysISO,
  itemSubtotal,
} from '../utils/calculations';
import { createInvoice } from '../services/supabaseService';
import { printDocument } from '../utils/print';

interface GeneradorFacturaScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  clients: Client[];
  invoices: Invoice[];
  profile: FreelancerProfile;
  initialClientId?: string;
  onSaved: (invoice: Invoice) => void;
  /** When set, shows this saved invoice read-only (to review it or download its PDF again). */
  existing?: { invoice: Invoice; items: InvoiceItem[] };
  /** First line of a new invoice, e.g. a service chosen with "Usar en Factura". */
  initialItem?: InvoiceItem;
}

const emptyItem = (): InvoiceItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: '1',
  unitPrice: 0,
  ivaRate: 0.19,
  subtotal: 0,
});

export const GeneradorFacturaScreen: React.FC<GeneradorFacturaScreenProps> = ({
  onNavigate,
  clients,
  invoices,
  profile,
  initialClientId,
  onSaved,
  existing,
  initialItem,
}) => {
  const [selectedClient, setSelectedClient] = useState(
    existing?.invoice.clientId || initialClientId || clients[0]?.id || ''
  );
  const [emissionDate, setEmissionDate] = useState(() => existing?.invoice.date ?? addDaysISO(0));
  const [dueDate, setDueDate] = useState(() => existing?.invoice.dueDate ?? addDaysISO(30));
  const [paymentMethod, setPaymentMethod] = useState('Transferencia bancaria');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [items, setItems] = useState<InvoiceItem[]>(() =>
    existing && existing.items.length > 0 ? existing.items : [initialItem ?? emptyItem()]
  );

  const [notes, setNotes] = useState(
    'Favor consignar a la cuenta de ahorros informada en el comprobante. Certificado tributario de retenciones a aplicar sobre el valor sin IVA antes de finalizar el periodo bimestral.'
  );

  const clientInfo = clients.find((c) => c.id === selectedClient);
  const invoiceNumber = existing?.invoice.number ?? nextDocumentNumber('FAC', invoices.map((i) => i.number));
  const bankLine = [profile.bankName, profile.bankAccount].filter(Boolean).join(' — ');

  const taxSummary = calculateTaxSummary(items, 0.04);

  const handleDeleteItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((it) => it.id !== id));
    }
  };

  const handleUpdateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const updated = { ...it, ...updates };
          return { ...updated, subtotal: itemSubtotal(updated.quantity, updated.unitPrice) };
        }
        return it;
      })
    );
  };

  const handleSave = async (status: 'Borrador' | 'Enviada') => {
    const filled = items.filter((it) => it.description.trim() && it.subtotal > 0);
    if (!clientInfo) return setSaveError('Selecciona un cliente.');
    if (filled.length === 0) return setSaveError('Agrega al menos un concepto con descripción, cantidad y precio.');
    if (!emissionDate || !dueDate) return setSaveError('Completa las fechas de emisión y vencimiento.');
    if (dueDate < emissionDate) return setSaveError('La fecha de vencimiento no puede ser anterior a la de emisión.');
    setSaving(true);
    setSaveError('');
    try {
      const saved = await createInvoice({
        id: crypto.randomUUID(),
        number: invoiceNumber,
        clientId: clientInfo.id,
        clientName: clientInfo.legalName || clientInfo.name,
        nit: clientInfo.nit,
        date: emissionDate,
        dueDate,
        amount: calculateTaxSummary(filled, 0.04).total,
        status,
        items: filled,
      });
      onSaved(saved);
    } catch (e) {
      // Form stays as typed so nothing is lost.
      setSaveError(`No se pudo guardar: ${(e as any)?.message ?? e}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Top Navigation & Header Context */}
      <div className="px-space-xl pt-6 pb-4 bg-canvas-white border-b border-border-subtle">
        <div className="max-w-[1360px] mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 font-caption text-caption text-text-subtlest mb-1.5 uppercase tracking-wider">
              <a
                className="hover:text-text-primary transition-colors cursor-pointer"
                href="#dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('dashboard');
                }}
              >
                Facturas
              </a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-text-secondary font-medium">{existing ? invoiceNumber : 'Nueva Factura'}</span>
            </nav>
            <div className="flex items-center gap-3">
              <h1 className="font-headline-md text-headline-md text-text-primary">
                {existing ? `Factura ${invoiceNumber}` : 'Generar Factura de Venta'}
              </h1>
              {existing && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[10000px] font-badge-label text-badge-label bg-status-enviada-bg text-status-enviada-text">
                  {existing.invoice.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout Container */}
      <div className="px-space-xl py-6 bg-surface-container-low">
        <div className="max-w-[1360px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Form Generator (read-only when viewing a saved invoice) */}
          <fieldset disabled={!!existing} className="lg:col-span-7 flex flex-col gap-6 min-w-0 border-0 p-0 m-0 disabled:opacity-80">
            {/* Section 1: Client Selection & Metadata */}
            <div className="bg-canvas-white rounded-[20px] p-space-xl border border-border-subtle flex flex-col gap-5">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-text-secondary text-[20px]">
                    corporate_fare
                  </span>
                  <h2 className="font-headline-sm text-body-lg font-semibold text-text-primary">
                    Destinatario del Cobro
                  </h2>
                </div>
                <span className="font-caption text-caption text-text-subtlest">Paso 1 de 3</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body-sm text-body-sm font-medium text-text-primary">
                  Cliente Registrado
                </label>
                <div className="relative">
                  <select
                    className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary appearance-none focus:outline-none focus:border-primary-container pr-10 cursor-pointer"
                    id="client-selector"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                  >
                    {clients.length === 0 && <option value="">Primero registra un cliente</option>}
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — NIT: {c.nit}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-subtlest pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-medium text-text-primary">
                    Fecha de Emisión
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none"
                      id="input-emission"
                      type="date"
                      value={emissionDate}
                      onChange={(e) => setEmissionDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-medium text-text-primary">
                    Fecha de Vencimiento (30 días)
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none"
                      id="input-due"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Currency and Payment Method Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-medium text-text-primary">
                    Moneda Operativa
                  </label>
                  <div className="h-10 px-3 bg-surface-container-low border border-border-strong rounded-[3px] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-badge-label text-badge-label font-bold text-text-primary">
                        COP
                      </span>
                      <span className="font-body-sm text-body-sm text-text-subtlest">
                        Peso Colombiano
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-text-subtlest text-[18px]">
                      lock
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-medium text-text-primary">
                    Método de Transferencia
                  </label>
                  <div className="relative">
                    <select
                      className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary appearance-none focus:outline-none pr-10 cursor-pointer"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Transferencia bancaria">
                        Transferencia {profile.bankName || 'bancaria'}
                      </option>
                      <option value="Transfiya / PSE">Transfiya / PSE</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-subtlest pointer-events-none text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Line Items */}
            <div className="bg-canvas-white rounded-[20px] p-space-xl border border-border-subtle flex flex-col gap-5">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <div>
                  <h2 className="font-headline-sm text-body-lg font-semibold text-text-primary">
                    Conceptos y Honorarios
                  </h2>
                  <p className="font-caption text-caption text-text-subtlest mt-0.5">
                    Especificación del alcance profesional desarrollado
                  </p>
                </div>
                <span className="font-badge-label text-badge-label px-2.5 py-1 rounded-[10000px] bg-surface-container-high text-text-secondary border border-border-subtle">
                  {items.length} Ítems Registrados
                </span>
              </div>

              {/* Items List */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-low rounded-[12px] p-4 border border-border-subtle flex flex-col gap-3 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <label className="font-caption text-caption text-text-subtlest uppercase">
                        Descripción del Servicio
                      </label>
                      <input
                        className="w-full mt-1 h-9 px-2.5 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md font-medium text-text-primary focus:outline-none"
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleUpdateItem(item.id, { description: e.target.value })
                        }
                      />
                    </div>
                    <button
                      className="mt-5 w-8 h-8 rounded-full flex items-center justify-center text-text-subtlest hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                      type="button"
                      title="Eliminar concepto"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="font-caption text-caption text-text-subtlest">
                        Cantidad
                      </label>
                      <div className="relative mt-1">
                        <input
                          className="w-full h-8 px-2.5 bg-canvas-white border border-border-strong rounded-[3px] font-body-sm text-body-sm text-text-primary focus:outline-none"
                          type="text"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(item.id, { quantity: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-caption text-caption text-text-subtlest">
                        Precio Unitario
                      </label>
                      <div className="relative mt-1">
                        <input
                          className="w-full h-8 px-2.5 bg-canvas-white border border-border-strong rounded-[3px] font-body-sm text-body-sm text-text-primary focus:outline-none"
                          type="text"
                          value={formatCOP(item.unitPrice)}
                          onChange={(e) => {
                            const val = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
                            handleUpdateItem(item.id, { unitPrice: val });
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-caption text-caption text-text-subtlest">IVA</label>
                      <div className="relative mt-1">
                        <input
                          className="w-full h-8 px-2.5 bg-surface-container border border-border-strong rounded-[3px] font-body-sm text-body-sm text-text-secondary focus:outline-none"
                          readOnly
                          type="text"
                          value={`${Math.round(item.ivaRate * 100)}%`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-caption text-caption text-text-subtlest text-right block">
                        Subtotal
                      </label>
                      <div className="mt-1 h-8 px-2 flex items-center justify-end font-body-md text-body-md font-semibold text-text-primary">
                        {formatCOP(item.subtotal, true)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <button
                  className="h-11 px-5 rounded-[10000px] bg-canvas-white hover:bg-surface-container transition-colors flex items-center justify-center gap-2 font-button-label text-button-label text-text-primary border border-border-strong cursor-pointer shadow-sm"
                  type="button"
                  onClick={() => setItems((prev) => [...prev, emptyItem()])}
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Agregar concepto</span>
                </button>
              </div>
            </div>

            {/* Section 3: Notes & Additional Conditions */}
            <div className="bg-canvas-white rounded-[20px] p-space-xl border border-border-subtle flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-text-secondary text-[20px]">
                  sticky_note_2
                </span>
                <label className="font-headline-sm text-body-lg font-semibold text-text-primary">
                  Notas y Observaciones de Pago
                </label>
              </div>
              <textarea
                className="w-full p-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary placeholder:text-text-subtlest focus:outline-none resize-none leading-relaxed"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="flex items-center justify-between text-text-subtlest font-caption text-caption">
                <span>Se reflejará en el pie de página de la factura emitida.</span>
                <span>{notes.length} caracteres</span>
              </div>
            </div>
          </fieldset>

          {/* RIGHT COLUMN: Real-Time Live Preview */}
          <div className="lg:col-span-5 flex flex-col gap-3 sticky top-20">
            {/* Live Preview Header Label */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-status-enviada-text text-[18px]">
                  visibility
                </span>
                <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                  Vista Previa de Impresión Oficial
                </span>
              </div>
              <button
                className="font-caption text-caption font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors cursor-pointer"
                type="button"
                onClick={() => printDocument(invoiceNumber)}
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span> Descargar PDF
              </button>
            </div>

            {/* The White Sheet Container */}
            <div className="print-area bg-canvas-white rounded-[10px] p-7 shadow-sm border border-border-subtle flex flex-col justify-between">
              {/* Sheet Header */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-[4px] bg-primary-container flex items-center justify-center text-canvas-white font-bold text-[14px]">
                        F
                      </div>
                      <span className="font-headline-sm text-body-md font-bold text-text-primary tracking-tight">
                        FreelanceOS
                      </span>
                    </div>
                    <div className="font-caption text-caption text-text-secondary leading-relaxed">
                      <strong className="text-text-primary">{profile.name || 'Completa tu perfil en Configuración'}</strong>
                      <br />
                      NIT: {profile.nit || '—'}
                      <br />
                      {profile.regime}
                      <br />
                      {[profile.email, profile.phone].filter(Boolean).join(' • ')}
                    </div>
                  </div>

                  {/* Invoice Title and Number Box */}
                  <div className="text-right">
                    <span className="font-caption text-caption font-semibold tracking-wider text-text-subtlest uppercase block">
                      Factura Electrónica
                    </span>
                    <span className="font-headline-sm text-body-lg font-bold text-primary-container">
                      {invoiceNumber}
                    </span>
                    <div className="mt-2 text-right font-caption text-caption text-text-secondary">
                      <div>
                        Emisión: <span className="font-medium text-text-primary">{emissionDate}</span>
                      </div>
                      <div>
                        Vence: <span className="font-medium text-text-primary">{dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-surface-container-high w-full"></div>

                {/* Customer & Bill To */}
                <div className="bg-surface-container-low p-3.5 rounded-[8px] border border-border-subtle flex flex-col gap-1">
                  <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider font-semibold">
                    Facturado A:
                  </span>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-body-sm text-body-sm font-bold text-text-primary">
                        {clientInfo?.legalName || clientInfo?.name || 'Sin cliente seleccionado'}
                      </h4>
                      <p className="font-caption text-caption text-text-secondary leading-snug">
                        NIT: {clientInfo?.nit ?? '—'}
                        <br />
                        {[clientInfo?.address, clientInfo?.city].filter(Boolean).join(', ')}
                      </p>
                    </div>
                    {clientInfo?.taxRegime && (
                      <span className="px-2 py-0.5 rounded font-caption text-[10px] font-semibold uppercase tracking-wide bg-canvas-white text-text-secondary border border-border-subtle">
                        {clientInfo.taxRegime}
                      </span>
                    )}
                  </div>
                </div>

                {/* Services Summary Table in Preview */}
                <div className="flex flex-col">
                  <div className="grid grid-cols-12 py-1.5 px-2 font-caption text-caption font-semibold text-text-subtlest uppercase tracking-wider">
                    <div className="col-span-6">Servicio / Detalle</div>
                    <div className="col-span-2 text-center">Cant.</div>
                    <div className="col-span-4 text-right">Total</div>
                  </div>
                  <div className="h-px bg-surface-container-high w-full mb-1"></div>

                  {/* Preview Rows */}
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 py-2 px-2 items-center hover:bg-surface-container-low rounded transition-colors"
                    >
                      <div className="col-span-6">
                        <p className="font-body-sm text-body-sm font-semibold text-text-primary truncate">
                          {item.description}
                        </p>
                        <p className="font-caption text-[11px] text-text-subtlest">
                          Tarifa: {formatCOP(item.unitPrice)}
                        </p>
                      </div>
                      <div className="col-span-2 text-center font-body-sm text-body-sm text-text-secondary">
                        {item.quantity}
                      </div>
                      <div className="col-span-4 text-right font-body-sm text-body-sm font-semibold text-text-primary">
                        {formatCOP(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Settlement & Tax Box */}
                <div className="bg-surface-container-low p-4 rounded-[8px] border border-border-subtle flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-center font-body-sm text-body-sm text-text-secondary">
                    <span>Subtotal Bruto</span>
                    <span className="font-medium text-text-primary">
                      {formatCOP(taxSummary.subtotal, true)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-body-sm text-body-sm text-text-secondary">
                    <span>IVA generado</span>
                    <span className="font-medium text-text-primary">
                      +{formatCOP(taxSummary.ivaAmount, true)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-body-sm text-body-sm text-status-vencida">
                    <span>Retención en la Fuente (-4%)</span>
                    <span className="font-medium">
                      -{formatCOP(taxSummary.reteFuenteAmount, true)}
                    </span>
                  </div>
                  <div className="h-px bg-surface-container-high w-full my-1"></div>
                  <div className="flex justify-between items-baseline pt-1">
                    <div className="flex flex-col">
                      <span className="font-caption text-caption uppercase font-bold text-text-subtlest tracking-wider">
                        Total a Pagar
                      </span>
                      <span className="font-caption text-[10px] text-text-subtlest">
                        Pesos Colombianos
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-headline-sm text-currency-display font-bold text-text-primary tracking-tight">
                        {formatCOP(taxSummary.total)}
                      </span>
                      <span className="font-caption text-[11px] font-semibold text-text-secondary ml-1">
                        COP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Banking Coordinates Footer */}
                <div className="pt-2">
                  <div className="p-3 bg-surface-container-lowest border border-border-subtle rounded-[6px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-status-enviada-bg flex items-center justify-center text-status-enviada-text">
                        <span className="material-symbols-outlined text-[18px]">
                          account_balance
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-caption text-caption uppercase font-bold text-text-subtlest">
                          Consignación Bancaria
                        </span>
                        <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                          {bankLine || 'Agrega tu cuenta en Configuración'}
                        </span>
                      </div>
                    </div>
                    <span className="font-caption text-caption text-status-pagada font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">verified</span> Activa
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Watermark & Disclaimer */}
              <div className="mt-6 pt-4 text-center font-caption text-[10px] text-text-subtlest leading-tight border-t border-border-subtle">
                Documento de cobro equivalente para contratistas de prestación de servicios.
                Generado automáticamente por FreelanceOS Colombia.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Action Bar with STRICT SINGLE PRIMARY BLUE BUTTON */}
      <div className="fixed bottom-0 left-0 lg:left-[260px] right-0 z-30 bg-canvas-white border-t border-border-subtle shadow-xl py-4 px-space-md lg:px-space-xl">
        <div className="max-w-[1360px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-caption text-caption text-text-subtlest">{invoiceNumber}</span>
              <span className="font-body-md text-body-md font-bold text-text-primary">
                {formatCOP(taxSummary.total, true)} a cobrar
              </span>
              {saveError && (
                <span role="alert" className="font-body-sm text-body-sm text-status-vencida">
                  {saveError}
                </span>
              )}
            </div>
          </div>

          {existing ? (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                className="h-[44px] px-5 rounded-[10000px] bg-canvas-white hover:bg-surface-container font-button-label text-button-label text-text-primary border border-border-strong transition-all flex items-center justify-center gap-2 cursor-pointer"
                type="button"
                onClick={() => onNavigate('documentos')}
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Volver a Documentos</span>
              </button>
              <button
                className="h-[58px] px-8 rounded-[10000px] bg-primary-container hover:bg-primary-hover active:bg-primary font-button-label text-button-label text-canvas-white shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                type="button"
                onClick={() => printDocument(invoiceNumber)}
              >
                <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
                <span className="text-[16px] font-semibold">Descargar PDF</span>
              </button>
            </div>
          ) : (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              className="h-[44px] px-5 rounded-[10000px] bg-canvas-white hover:bg-surface-container font-button-label text-button-label text-text-primary border border-border-strong transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              type="button"
              disabled={saving}
              onClick={() => handleSave('Borrador')}
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Guardar como borrador</span>
            </button>

            <button
              className="h-[58px] px-8 rounded-[10000px] bg-primary-container hover:bg-primary-hover active:bg-primary font-button-label text-button-label text-canvas-white shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
              type="button"
              disabled={saving}
              onClick={() => handleSave('Enviada')}
            >
              <span className="material-symbols-outlined text-[22px]">send</span>
              <span className="text-[16px] font-semibold">{saving ? 'Guardando...' : 'Emitir factura'}</span>
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
