import React, { useState } from 'react';
import { ScreenId, Client, CuentaCobro, FreelancerProfile } from '../types';
import { formatCOP, numeroALetrasCOP, nextDocumentNumber } from '../utils/calculations';

interface GeneradorCuentaCobroScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  clients: Client[];
  cuentasCobro: CuentaCobro[];
  profile: FreelancerProfile;
  initialClientId?: string;
}

export const GeneradorCuentaCobroScreen: React.FC<GeneradorCuentaCobroScreenProps> = ({
  onNavigate,
  clients,
  cuentasCobro,
  profile,
  initialClientId,
}) => {
  const [selectedClient, setSelectedClient] = useState(initialClientId ?? clients[0]?.id ?? '');
  const [consecutivo, setConsecutivo] = useState(() =>
    nextDocumentNumber('CC', cuentasCobro.map((c) => c.number))
  );
  const [contratoRef, setContratoRef] = useState('FOS-2025-089');
  const [emissionDate, setEmissionDate] = useState('2025-05-28');
  const [dueDate, setDueDate] = useState('2025-06-05');
  const [monto, setMonto] = useState('2.800.000');
  const [concepto, setConcepto] = useState(
    'Por concepto de honorarios profesionales correspondientes al Hito 2: Consultoría en Arquitectura UX y Sistema de Diseño para Banca Móvil durante el mes de Mayo 2025 según Contrato FOS-2025-089.'
  );
  const [isNoIva, setIsNoIva] = useState(true);
  const [isPilaChecked, setIsPilaChecked] = useState(true);
  const [bancoInfo, setBancoInfo] = useState(() =>
    [profile.bankName, profile.bankAccount, profile.legalName || profile.name ? `a nombre de ${profile.legalName || profile.name}` : '']
      .filter(Boolean)
      .join(' — ')
  );

  const numericMonto = parseInt(monto.replace(/\D/g, ''), 10) || 0;
  const montoLetras = numeroALetrasCOP(numericMonto);

  const client = clients.find((c) => c.id === selectedClient);

  const formatFechaLegible = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const mesIdx = parseInt(parts[1], 10) - 1;
    return `${parts[2]} de ${meses[mesIdx] || ''} de ${parts[0]}`;
  };

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Encabezado de Navegación y Contexto */}
      <div className="w-full max-w-[1360px] mx-auto px-space-xl pt-space-lg pb-space-md">
        <div className="flex items-center gap-2 font-caption text-caption text-text-subtlest uppercase tracking-widest mb-1.5">
          <span
            className="hover:text-primary cursor-pointer transition-colors"
            onClick={() => onNavigate('dashboard')}
          >
            Cuentas de Cobro
          </span>
          <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
          <span className="text-text-primary font-semibold">Nueva Cuenta de Cobro</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
          <div>
            <h1 className="font-headline-md text-headline-md font-semibold text-text-primary tracking-tight">
              Generar Cuenta de Cobro
            </h1>
            <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
              Emisión oficial para contratistas independientes con validación tributaria colombiana
              vigente (Art. 437 E.T.).
            </p>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10000px] bg-status-enviada-bg text-status-enviada-text font-badge-label text-badge-label border border-border-subtle">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              Modo Edición en Vivo
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor Principal Split-View */}
      <div className="w-full max-w-[1360px] mx-auto px-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* COLUMNA IZQUIERDA: FORMULARIO TÉCNICO (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            {/* Tarjeta 1: Parámetros del Documento y Cliente */}
            <div className="bg-canvas-white rounded-[20px] border border-border-subtle p-space-xl shadow-none">
              <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-border-subtle">
                <div className="flex items-center gap-space-sm">
                  <span className="w-7 h-7 rounded-full bg-surface-container-low text-primary flex items-center justify-center font-badge-label text-badge-label font-bold">
                    1
                  </span>
                  <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
                    Destinatario y Emisión
                  </h2>
                </div>
                <span className="font-caption text-caption text-text-subtlest uppercase tracking-wide">
                  Paso obligatorio
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-semibold text-text-primary flex items-center justify-between">
                    <span>Cliente / Pagador</span>
                    {/* Target for: //span[contains(text(), '  Nuevo pagador')] */}
                    <span
                      className="font-caption text-caption text-primary font-normal cursor-pointer hover:underline inline-flex items-center gap-1"
                      onClick={() => onNavigate('clientes')}
                    >
                      <span>+</span>
                      <span>  Nuevo pagador</span>
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container appearance-none pr-10 cursor-pointer"
                      id="input-cliente"
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

                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-semibold text-text-primary">
                    Consecutivo oficial
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-10 px-3 bg-surface-container-low border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary font-medium focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container uppercase"
                      id="input-consecutivo"
                      type="text"
                      value={consecutivo}
                      onChange={(e) => setConsecutivo(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-subtlest text-[18px]">
                      lock
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-semibold text-text-primary">
                    Referencia Contrato / OC
                  </label>
                  <input
                    className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                    id="input-contrato"
                    type="text"
                    value={contratoRef}
                    onChange={(e) => setContratoRef(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-semibold text-text-primary">
                    Fecha de emisión
                  </label>
                  <input
                    className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                    id="input-fecha-emision"
                    type="date"
                    value={emissionDate}
                    onChange={(e) => setEmissionDate(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-semibold text-text-primary">
                    Fecha acordada de pago
                  </label>
                  <input
                    className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                    id="input-fecha-pago"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Tarjeta 2: Concepto, Honorarios y Valor en Letras */}
            <div className="bg-canvas-white rounded-[20px] border border-border-subtle p-space-xl shadow-none">
              <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-border-subtle">
                <div className="flex items-center gap-space-sm">
                  <span className="w-7 h-7 rounded-full bg-surface-container-low text-primary flex items-center justify-center font-badge-label text-badge-label font-bold">
                    2
                  </span>
                  <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
                    Concepto y Liquidación
                  </h2>
                </div>
                <span className="font-caption text-caption text-text-subtlest">
                  COP Moneda Legal
                </span>
              </div>

              <div className="flex flex-col gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body-sm text-body-sm font-semibold text-text-primary">
                    Detalle descriptivo del servicio prestado
                  </label>
                  <textarea
                    className="w-full p-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container resize-none leading-relaxed"
                    id="input-concepto"
                    rows={4}
                    value={concepto}
                    onChange={(e) => setConcepto(e.target.value)}
                  />
                  <p className="font-caption text-caption text-text-subtlest">
                    Sea explícito indicando período, entregables alcanzados y número de contrato de
                    prestación de servicios.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body-sm text-body-sm font-semibold text-text-primary">
                      Valor bruto honorarios (COP)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-text-subtlest font-medium">
                        $
                      </span>
                      <input
                        className="w-full h-10 pl-8 pr-12 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary font-semibold text-right focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                        id="input-monto"
                        type="text"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 font-caption text-caption text-text-subtlest font-bold">
                        COP
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-body-sm text-body-sm font-semibold text-text-primary">
                      Monto en letras (Automático)
                    </label>
                    <input
                      className="w-full h-10 px-3 bg-surface-container-low border border-border-strong rounded-[3px] font-body-sm text-body-sm text-text-secondary select-none font-medium truncate"
                      id="input-monto-letras"
                      readOnly
                      type="text"
                      value={montoLetras}
                    />
                  </div>
                </div>

                {/* Panel Informativo Retenciones */}
                <div className="bg-surface-container-low p-space-md rounded-[4px] border border-border-subtle flex items-start gap-space-sm mt-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                    info
                  </span>
                  <div className="flex flex-col text-body-sm font-body-sm text-text-secondary">
                    <span className="font-semibold text-text-primary">
                      Retención en la fuente a título de renta
                    </span>
                    <span>
                      Al no estar obligado a facturar electrónicamente, la empresa pagadora aplicará la
                      tabla de retención para independientes según declaración juramentada de costos
                      (Decreto 1625 de 2016).
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta 3: Marco Tributario y Canales de Pago */}
            <div className="bg-canvas-white rounded-[20px] border border-border-subtle p-space-xl shadow-none">
              <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-border-subtle">
                <div className="flex items-center gap-space-sm">
                  <span className="w-7 h-7 rounded-full bg-surface-container-low text-primary flex items-center justify-center font-badge-label text-badge-label font-bold">
                    3
                  </span>
                  <h2 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
                    Marco Tributario y Canales de Pago
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 font-badge-label text-[11px] text-status-pagada font-semibold uppercase">
                  <span className="material-symbols-outlined text-[15px]">verified</span> Validado
                </span>
              </div>

              <div className="flex flex-col gap-space-md">
                {/* Selector de Declaración IVA */}
                <div className="border border-border-subtle rounded-[4px] p-space-md bg-canvas-white">
                  <div className="flex items-start gap-space-sm">
                    <input
                      checked={isNoIva}
                      onChange={(e) => setIsNoIva(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary rounded-[2px] border-border-strong focus:ring-0 cursor-pointer"
                      id="check-iva"
                      type="checkbox"
                    />
                    <label
                      className="font-body-sm text-body-sm text-text-primary cursor-pointer leading-normal"
                      htmlFor="check-iva"
                    >
                      <span className="font-semibold text-text-primary block">
                        No responsable del Impuesto sobre las Ventas (IVA)
                      </span>
                      Manifestación expresa bajo la gravedad de juramento de pertenecer al régimen de
                      no responsables de IVA de conformidad con el{' '}
                      <strong className="text-text-primary">
                        Artículo 437 del Estatuto Tributario
                      </strong>
                      .
                    </label>
                  </div>
                </div>

                {/* Selector de Aportes Seguridad Social */}
                <div className="border border-border-subtle rounded-[4px] p-space-md bg-canvas-white">
                  <div className="flex items-start gap-space-sm">
                    <input
                      checked={isPilaChecked}
                      onChange={(e) => setIsPilaChecked(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary rounded-[2px] border-border-strong focus:ring-0 cursor-pointer"
                      id="check-pila"
                      type="checkbox"
                    />
                    <label
                      className="font-body-sm text-body-sm text-text-primary cursor-pointer leading-normal"
                      htmlFor="check-pila"
                    >
                      <span className="font-semibold text-text-primary block">
                        Certificación de Seguridad Social e Independiente (Ley 2277)
                      </span>
                      Declaro que he realizado los aportes al Sistema de Seguridad Social Integral
                      (Salud, Pensión y ARL) correspondientes a los ingresos percibidos, anexando
                      soporte de planilla PILA.
                    </label>
                  </div>
                </div>

                {/* Datos Bancarios */}
                <div className="flex flex-col gap-1.5 pt-space-xs">
                  <label className="font-body-sm text-body-sm font-semibold text-text-primary">
                    Instrucciones de Pago / Consignación
                  </label>
                  <textarea
                    className="w-full p-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-sm text-body-sm text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container resize-none leading-relaxed"
                    id="input-banco"
                    rows={2}
                    value={bancoInfo}
                    onChange={(e) => setBancoInfo(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: VISTA PREVIA HOJA OFICIAL (5 Cols Sticky) */}
          <div className="lg:col-span-5 sticky top-20">
            <div className="flex items-center justify-between pb-space-sm mb-space-xs px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-text-secondary">
                  preview
                </span>
                <span className="font-badge-label text-badge-label font-bold uppercase tracking-wider text-text-secondary">
                  Vista Previa Documento Oficial
                </span>
              </div>
              <button
                className="font-caption text-caption font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors cursor-pointer"
                type="button"
                onClick={() => {
                  alert('Esta función todavía no está disponible.');
                }}
              >
                <span className="material-symbols-outlined text-[16px]">zoom_in</span> Aumentar
              </button>
            </div>

            {/* Hoja Física */}
            <div
              className="bg-canvas-white border border-border-subtle rounded-[20px] p-8 transition-all flex flex-col justify-between text-text-primary relative shadow-sm"
              style={{ minHeight: '720px' }}
            >
              <div className="absolute right-8 top-8 opacity-5 pointer-events-none select-none">
                <span className="material-symbols-outlined text-[140px] text-text-primary">
                  receipt_long
                </span>
              </div>

              <div>
                {/* Cabecera */}
                <div className="flex flex-col items-center text-center pb-6 border-b border-border-subtle">
                  <span className="font-caption text-[11px] uppercase tracking-widest text-text-subtlest font-semibold">
                    Documento Equivalente Electrónico / Físico
                  </span>
                  <h2
                    className="font-headline-sm text-headline-sm font-bold tracking-tight text-text-primary mt-1"
                    id="prev-titulo"
                  >
                    CUENTA DE COBRO N° {consecutivo.toUpperCase()}
                  </h2>
                  <div className="mt-2 inline-flex items-center gap-2 text-caption font-caption text-text-secondary">
                    <span>
                      Fecha:{' '}
                      <strong className="text-text-primary font-semibold">
                        {formatFechaLegible(emissionDate)}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Vence:{' '}
                      <strong className="text-text-primary font-semibold">
                        {formatFechaLegible(dueDate)}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Cuerpo Legal: DEUDOR Y ACREEDOR */}
                <div className="py-6 flex flex-col gap-4 text-body-sm font-body-sm leading-relaxed border-b border-border-subtle">
                  <div>
                    <span className="font-caption text-caption text-text-subtlest uppercase tracking-wide block font-semibold mb-0.5">
                      Pagador / Deudor:
                    </span>
                    <p className="text-body-md font-body-md font-semibold text-text-primary">
                      {client ? `${client.legalName || client.name} — NIT: ${client.nit}` : 'Sin cliente seleccionado'}
                    </p>
                  </div>
                  <div className="bg-surface-container-low p-3.5 rounded-[3px] border border-border-subtle">
                    <span className="font-caption text-caption text-primary uppercase tracking-wide block font-bold mb-1">
                      Debe A:
                    </span>
                    <p className="font-body-md text-body-md font-bold text-text-primary uppercase">
                      {profile.legalName || profile.name || 'Completa tu perfil en Configuración'}
                    </p>
                    <p className="font-body-sm text-body-sm text-text-secondary">{profile.docTypeAndNumber}</p>
                    <p className="font-caption text-caption text-text-subtlest">
                      {[profile.phone && `Tel: ${profile.phone}`, profile.email].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-text-subtlest uppercase tracking-wide block font-semibold mb-0.5">
                      La suma de:
                    </span>
                    <p className="font-body-sm text-body-sm font-bold text-text-primary leading-tight uppercase">
                      {montoLetras}
                    </p>
                    <p className="text-headline-sm font-headline-sm font-extrabold text-primary mt-1">
                      {formatCOP(numericMonto, true)}
                    </p>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-text-subtlest uppercase tracking-wide block font-semibold mb-1">
                      Por concepto de:
                    </span>
                    <p className="text-body-sm font-body-sm text-text-secondary italic pl-3 border-l-2 border-primary-container leading-relaxed">
                      "{concepto}"
                    </p>
                  </div>
                </div>

                {/* Certificaciones y Cláusulas Legales */}
                <div className="py-5 flex flex-col gap-3 text-[11px] font-caption leading-normal text-text-subtlest border-b border-border-subtle">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[15px] text-status-pagada shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <p>
                      <strong className="text-text-primary">Régimen Tributario:</strong>{' '}
                      {isNoIva
                        ? 'Manifiesto bajo la gravedad de juramento que no soy responsable del Impuesto sobre las Ventas (IVA) conforme al Art. 437 del Estatuto Tributario Nacional.'
                        : 'Responsable de Impuesto sobre las Ventas (IVA). Documento facturado conforme al régimen ordinario.'}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[15px] text-status-pagada shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <p>
                      <strong className="text-text-primary">Seguridad Social:</strong> Para efectos
                      del Artículo 108 del E.T. y Ley 2277 de 2022, declaro haber efectuado mis aportes
                      independientes al Sistema General de Seguridad Social en Salud, Pensión y ARL.
                    </p>
                  </div>
                </div>

                {/* Canales Bancarios */}
                <div className="pt-4 pb-2">
                  <span className="font-caption text-caption text-text-subtlest uppercase tracking-wide block font-semibold mb-1">
                    Forma de Pago / Abono:
                  </span>
                  <p className="font-body-sm text-body-sm font-medium text-text-primary">
                    {bancoInfo}
                  </p>
                </div>
              </div>

              {/* Espacio Firma Digital */}
              <div className="mt-8 pt-6 border-t border-dashed border-border-strong flex items-end justify-between">
                <div className="flex flex-col">
                  <div className="h-10 mb-1 flex items-center">
                    <svg
                      className="w-36 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      viewBox="0 0 160 40"
                    >
                      <path d="M10 28 C 30 10, 45 35, 60 15 C 75 -2, 70 38, 90 22 C 105 10, 115 30, 130 18 C 140 10, 150 25, 155 20"></path>
                      <path d="M45 28 L 140 28" opacity="0.6" strokeDasharray="2 3"></path>
                    </svg>
                  </div>
                  <span className="font-body-sm text-body-sm font-bold text-text-primary">{profile.name}</span>
                  <span className="font-caption text-caption text-text-subtlest">{profile.docTypeAndNumber}</span>
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-16 h-16 border border-border-subtle p-1 bg-surface-container-low rounded-[3px] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[42px] text-text-primary">
                      qr_code_2
                    </span>
                  </div>
                  <span className="font-caption text-[9px] text-text-subtlest mt-1">
                    Verificación DIAN / FOS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA INFERIOR STICKY: ACCIONES Y RESUMEN TOTAL */}
      <div className="fixed bottom-0 left-0 lg:left-[260px] right-0 h-20 bg-canvas-white border-t border-border-subtle z-40 px-space-md lg:px-space-xl flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-space-lg">
          <div className="flex flex-col">
            <span className="font-caption text-caption text-text-subtlest uppercase tracking-wide font-semibold">
              Resumen de Cuenta
            </span>
            <span className="font-body-md text-body-md font-semibold text-text-primary flex items-center gap-2">
              1 Documento
              <span className="text-border-strong">•</span>
              <span className="text-status-pagada font-bold">{formatCOP(numericMonto, true)}</span>
              <span className="text-text-subtlest font-normal">a Cobrar</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 pl-space-md border-l border-border-subtle">
            <span className="w-2.5 h-2.5 rounded-full bg-status-pagada"></span>
            <span className="font-caption text-caption text-text-secondary">
              Sin IVA declarado (Art. 437)
            </span>
          </div>
        </div>

        {/* Acciones Atlassian Style: 1 Botón Primario Único + Secundario */}
        <div className="flex items-center gap-space-md">
          <button
            className="h-11 px-5 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label text-button-label hover:bg-surface-container-low transition-colors focus:outline-none cursor-pointer"
            type="button"
            onClick={() => {
              alert('Esta función todavía no está disponible.');
            }}
          >
            Guardar borrador
          </button>

          {/* BOTÓN PRIMARIO ÚNICO EN PANTALLA: PÍLDORA 10000px, AZUL #1868db, 58px ALTO */}
          <button
            className="h-[58px] px-8 rounded-[10000px] bg-primary-container hover:bg-primary-hover active:bg-[#09326c] text-on-primary font-button-label text-button-label font-semibold transition-all flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 cursor-pointer shadow-md"
            id="btn-generar"
            type="button"
            onClick={() => {
              alert('Esta función todavía no está disponible.');
            }}
          >
            <span className="material-symbols-outlined text-[22px]">
              download
            </span>
            <span>
              Generar y Descargar PDF
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
