import React, { useState } from 'react';
import { ScreenId, InvoiceItem } from '../types';
import { formatCOP, calculateTaxSummary } from '../utils/calculations';

interface GeneradorFacturaScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
}

export const GeneradorFacturaScreen: React.FC<GeneradorFacturaScreenProps> = ({ onNavigate }) => {
  const [selectedClient, setSelectedClient] = useState('nu');
  const [emissionDate, setEmissionDate] = useState('2025-05-14');
  const [dueDate, setDueDate] = useState('2025-06-13');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancolombia Ahorros');

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'item-1',
      description: 'Diseño y Arquitectura de Producto UX/UI',
      quantity: '40 hrs',
      unitPrice: 150000,
      ivaRate: 0.19,
      subtotal: 6000000,
    },
    {
      id: 'item-2',
      description: 'Implementación Front-end Tailwind & React',
      quantity: '1 Proyecto',
      unitPrice: 4500000,
      ivaRate: 0.19,
      subtotal: 4500000,
    },
  ]);

  const [notes, setNotes] = useState(
    'Favor consignar a la cuenta de ahorros informada en el comprobante. Certificado tributario de retenciones a aplicar sobre el valor sin IVA antes de finalizar el periodo bimestral.'
  );

  const clientInfo = {
    nu: {
      name: 'Nu Colombia S.A.',
      nit: '901.345.892-1',
      address: 'Cra. 11 #79-52, Of. 801, Bogotá D.C., Colombia',
      type: 'Persona Jurídica',
    },
    rappi: {
      name: 'Rappi Colombia S.A.S.',
      nit: '900.843.501-4',
      address: 'Cl. 93 # 19-55, Bogotá D.C., Colombia',
      type: 'Persona Jurídica',
    },
    bancolombia: {
      name: 'Grupo Bancolombia',
      nit: '890.903.938-8',
      address: 'Cra. 48 # 26-85, Medellín, Colombia',
      type: 'Gran Contribuyente',
    },
    mercadolibre: {
      name: 'MercadoLibre Colombia LTDA',
      nit: '830.077.248-1',
      address: 'Cra 15 # 100-21, Bogotá D.C., Colombia',
      type: 'Persona Jurídica',
    },
  }[selectedClient as 'nu' | 'rappi' | 'bancolombia' | 'mercadolibre'];

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
          return updated;
        }
        return it;
      })
    );
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
              <span className="text-text-secondary font-medium">Nueva Factura</span>
            </nav>
            <div className="flex items-center gap-3">
              <h1 className="font-headline-md text-headline-md text-text-primary">
                Generar Factura de Venta
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-[10000px] font-badge-label text-badge-label bg-status-enviada-bg text-status-enviada-text">
                Borrador Activo
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-text-subtlest font-body-sm text-body-sm bg-surface-container-low px-3 py-1.5 rounded-[10000px] border border-border-subtle">
              <span className="w-2 h-2 rounded-full bg-status-pagada animate-pulse"></span>
              <span>Sincronizado en tiempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout Container */}
      <div className="px-space-xl py-6 bg-surface-container-low">
        <div className="max-w-[1360px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Form Generator */}
          <div className="lg:col-span-7 flex flex-col gap-6">
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
                    <option value="nu">Nu Colombia S.A. — NIT: 901.345.892-1</option>
                    <option value="rappi">Rappi Colombia S.A.S. — NIT: 900.843.501-4</option>
                    <option value="bancolombia">Grupo Bancolombia — NIT: 890.903.938-8</option>
                    <option value="mercadolibre">
                      MercadoLibre Colombia LTDA — NIT: 830.077.248-1
                    </option>
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
                      <option value="Transferencia Bancolombia Ahorros">
                        Transferencia Bancolombia Ahorros
                      </option>
                      <option value="Cuenta Corriente Davivienda">
                        Cuenta Corriente Davivienda
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
                            handleUpdateItem(item.id, {
                              unitPrice: val,
                              subtotal: val,
                            });
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
                          value="19%"
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

              {/* Add Item Action (Target for: //button[contains(., '  Agregar servicio del catálogo')]) */}
              <div>
                <button
                  className="h-11 px-5 rounded-[10000px] bg-canvas-white hover:bg-surface-container transition-colors flex items-center justify-center gap-2 font-button-label text-button-label text-text-primary border border-border-strong cursor-pointer shadow-sm"
                  type="button"
                  onClick={() => onNavigate('servicios')}
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>  Agregar servicio del catálogo</span>
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
          </div>

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
              <span className="font-caption text-caption text-text-subtlest">
                A4 • Formato DIAN Colombia
              </span>
            </div>

            {/* The White Sheet Container */}
            <div className="bg-canvas-white rounded-[10px] p-7 shadow-sm border border-border-subtle flex flex-col justify-between">
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
                      <strong className="text-text-primary">Carlos Mendoza</strong>
                      <br />
                      NIT: 1.032.456.789-0
                      <br />
                      Régimen Simple de Tributación
                      <br />
                      carlos@mendoza.co • (+57) 314 890 2311
                    </div>
                  </div>

                  {/* Invoice Title and Number Box */}
                  <div className="text-right">
                    <span className="font-caption text-caption font-semibold tracking-wider text-text-subtlest uppercase block">
                      Factura Electrónica
                    </span>
                    <span className="font-headline-sm text-body-lg font-bold text-primary-container">
                      FAC-2025-043
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
                        {clientInfo.name}
                      </h4>
                      <p className="font-caption text-caption text-text-secondary leading-snug">
                        NIT: {clientInfo.nit}
                        <br />
                        {clientInfo.address}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded font-caption text-[10px] font-semibold uppercase tracking-wide bg-canvas-white text-text-secondary border border-border-subtle">
                      {clientInfo.type}
                    </span>
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
                    <span>IVA Generado (19%)</span>
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
                          Bancolombia Ahorros: 245-098765-12
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
              <span className="font-caption text-caption text-text-subtlest">
                Liquidación Lista Para Firma
              </span>
              <span className="font-body-md text-body-md font-bold text-text-primary">
                1 Factura • {formatCOP(taxSummary.total, true)} a Cobrar
              </span>
            </div>
          </div>

          {/* Action Buttons Container */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              className="h-[44px] px-5 rounded-[10000px] bg-canvas-white hover:bg-surface-container font-button-label text-button-label text-text-primary border border-border-strong transition-all flex items-center justify-center gap-2 cursor-pointer"
              type="button"
              onClick={() => {
                alert('Borrador guardado localmente en tu cuenta FreelanceOS.');
              }}
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Guardar como borrador</span>
            </button>

            {/* Target for: //button[contains(., 'Generar y Descargar PDF')] */}
            <button
              className="h-[58px] px-8 rounded-[10000px] bg-primary-container hover:bg-primary-hover active:bg-primary font-button-label text-button-label text-canvas-white shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              type="button"
              onClick={() => {
                onNavigate('dashboard');
              }}
            >
              <span className="material-symbols-outlined text-[22px]">download_for_offline</span>
              <span className="text-[16px] font-semibold">Generar y Descargar PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
