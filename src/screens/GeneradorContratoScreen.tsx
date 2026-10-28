import React, { useState } from 'react';
import { ScreenId, Contract } from '../types';

interface GeneradorContratoScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  contract: Contract;
}

export const GeneradorContratoScreen: React.FC<GeneradorContratoScreenProps> = ({
  onNavigate,
  contract,
}) => {
  const [selectedClient, setSelectedClient] = useState('rappi');
  const [contractObject, setContractObject] = useState(contract.object);
  const [scope, setScope] = useState(contract.scope);
  const [duration, setDuration] = useState(contract.duration);
  const [contractValue, setContractValue] = useState('$18.000.000 COP');
  const [paymentSchedule, setPaymentSchedule] = useState(contract.paymentSchedule);
  const [clauses, setClauses] = useState(contract.clauses);
  const [showToast, setShowToast] = useState(false);

  const toggleClause = (id: string) => {
    setClauses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isOpen: !c.isOpen } : c))
    );
  };

  const updateClauseContent = (id: string, newContent: string) => {
    setClauses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content: newContent } : c))
    );
  };

  const clientData = {
    rappi: {
      name: 'RAPPI S.A.S.',
      nit: '900.874.123-4',
      radicado: 'FOS-2025-089-RAP',
    },
    bancolombia: {
      name: 'BANCOLOMBIA S.A.',
      nit: '890.903.938-8',
      radicado: 'FOS-2025-090-BAN',
    },
    mercado: {
      name: 'MERCADOLIBRE COLOMBIA LTDA.',
      nit: '830.067.542-1',
      radicado: 'FOS-2025-091-MELI',
    },
  }[selectedClient as 'rappi' | 'bancolombia' | 'mercado'];

  return (
    <div className="flex flex-col w-full">
      <div className="px-space-xl py-space-lg max-w-[1440px] w-full mx-auto">
        {/* Breadcrumb & Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
          <div className="flex flex-col">
            <div className="breadcrumb flex items-center gap-space-xs text-text-subtlest font-caption text-caption mb-1">
              <a
                className="hover:text-text-primary transition-colors cursor-pointer"
                href="#dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('dashboard');
                }}
              >
                Contratos
              </a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-text-secondary font-medium">Nuevo contrato</span>
            </div>
            <h1 className="font-currency-display text-currency-display text-text-primary font-medium tracking-tight">
              Generador de Contrato de Prestación de Servicios
            </h1>
          </div>

          {/* Top Action Toolbar */}
          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low text-text-secondary rounded-[10000px] font-badge-label text-badge-label">
              <span className="w-2 h-2 rounded-full bg-status-pendiente"></span>
              Borrador Dinámico v1.2
            </span>
            <button
              className="h-10 px-4 rounded-[10000px] bg-canvas-white text-text-primary font-button-label text-button-label flex items-center gap-2 hover:bg-surface-container-low transition-colors shadow-sm cursor-pointer border border-border-subtle"
              type="button"
              onClick={() => onNavigate('dashboard')}
            >
              <span className="material-symbols-outlined text-[18px] text-text-secondary">
                history
              </span>
              <span>Plantillas guardadas</span>
            </button>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* LEFT COLUMN: Contract Parameters & Clauses */}
          <div className="lg:col-span-6 flex flex-col gap-space-md">
            <div className="bg-canvas-white rounded-[20px] p-space-xl shadow-sm border border-border-subtle flex flex-col gap-space-lg">
              <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container text-[22px]">
                    tune
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                    Parámetros del contrato
                  </h2>
                </div>
                <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider">
                  Ley 80 / Código Civil COL
                </span>
              </div>

              {/* Parameter Fields */}
              <div className="flex flex-col gap-space-md">
                {/* Cliente Selector */}
                <div className="flex flex-col gap-1">
                  <label
                    className="font-body-sm text-body-sm text-text-secondary font-semibold"
                    htmlFor="client-select"
                  >
                    Cliente Contratante
                  </label>
                  <div className="relative">
                    <select
                      className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer shadow-sm pr-10"
                      id="client-select"
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                    >
                      <option value="rappi">Rappi SAS — NIT 900.874.123-4 (Bogotá D.C.)</option>
                      <option value="bancolombia">Bancolombia S.A. — NIT 890.903.938-8</option>
                      <option value="mercado">MercadoLibre Colombia LTDA — NIT 830.067.542-1</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-subtlest text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Objeto del Contrato */}
                <div className="flex flex-col gap-1">
                  <label
                    className="font-body-sm text-body-sm text-text-secondary font-semibold"
                    htmlFor="contract-object"
                  >
                    Objeto del Contrato
                  </label>
                  <textarea
                    className="w-full p-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm resize-none"
                    id="contract-object"
                    rows={2}
                    value={contractObject}
                    onChange={(e) => setContractObject(e.target.value)}
                  />
                </div>

                {/* Alcance y Entregables */}
                <div className="flex flex-col gap-1">
                  <label
                    className="font-body-sm text-body-sm text-text-secondary font-semibold"
                    htmlFor="contract-scope"
                  >
                    Alcance y Entregables Clave
                  </label>
                  <textarea
                    className="w-full p-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm resize-none"
                    id="contract-scope"
                    rows={2}
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                  />
                </div>

                {/* Vigencia y Valor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1">
                    <label
                      className="font-body-sm text-body-sm text-text-secondary font-semibold"
                      htmlFor="contract-duration"
                    >
                      Duración y Vigencia
                    </label>
                    <div className="relative">
                      <input
                        className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm"
                        id="contract-duration"
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-subtlest text-[18px]">
                        calendar_month
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="font-body-sm text-body-sm text-text-secondary font-semibold"
                      htmlFor="contract-value"
                    >
                      Valor Total Acordado (COP)
                    </label>
                    <div className="relative">
                      <input
                        className="w-full h-10 px-3 font-semibold bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm"
                        id="contract-value"
                        type="text"
                        value={contractValue}
                        onChange={(e) => setContractValue(e.target.value)}
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-status-pagada text-[18px]">
                        paid
                      </span>
                    </div>
                  </div>
                </div>

                {/* Forma de Pago */}
                <div className="flex flex-col gap-1">
                  <label
                    className="font-body-sm text-body-sm text-text-secondary font-semibold"
                    htmlFor="payment-schedule"
                  >
                    Forma de Pago y Desembolsos
                  </label>
                  <textarea
                    className="w-full p-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm resize-none"
                    id="payment-schedule"
                    rows={2}
                    value={paymentSchedule}
                    onChange={(e) => setPaymentSchedule(e.target.value)}
                  />
                </div>
              </div>

              {/* Cláusulas Editables */}
              <div className="pt-space-sm flex flex-col gap-space-sm border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-sm text-body-md font-semibold text-text-primary">
                    Cláusulas Contractuales Personalizables
                  </h3>
                  <span className="text-caption font-caption text-text-subtlest">
                    {clauses.length} activas
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {clauses.map((clause) => (
                    <div
                      key={clause.id}
                      className="group bg-surface-container-low rounded-xl p-space-md transition-all shadow-sm border border-border-subtle"
                    >
                      <button
                        className="w-full flex items-center justify-between cursor-pointer list-none font-body-sm font-semibold text-text-primary select-none text-left"
                        onClick={() => toggleClause(clause.id)}
                        type="button"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            {clause.icon}
                          </span>
                          <span>{clause.title}</span>
                        </span>
                        <span
                          className={`material-symbols-outlined text-text-subtlest text-[20px] transition-transform ${
                            clause.isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                      {clause.isOpen && (
                        <div className="pt-3">
                          <textarea
                            className="w-full p-2.5 bg-canvas-white border border-border-strong rounded-[3px] font-body-sm text-body-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm resize-none"
                            rows={3}
                            value={clause.content}
                            onChange={(e) => updateClauseContent(clause.id, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Realtime Editorial Contract Preview */}
          <div className="lg:col-span-6 flex flex-col gap-space-md sticky top-20">
            {/* Document Sheet Card */}
            <div className="bg-canvas-white rounded-[20px] shadow-sm border border-border-subtle p-8 md:p-12 text-text-primary flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-status-enviada-bg opacity-30 pointer-events-none"></div>

              {/* Document Header */}
              <div className="flex flex-col items-center text-center pb-8 border-b border-border-subtle">
                <span className="font-caption text-caption text-text-subtlest uppercase tracking-widest font-semibold mb-1">
                  República de Colombia • Derecho Comercial
                </span>
                <h3 className="font-body-lg text-body-lg font-semibold tracking-wide text-text-primary uppercase leading-tight max-w-md">
                  Contrato de Prestación de Servicios Profesionales Independientes
                </h3>
                <div className="mt-2 text-caption font-caption text-text-secondary bg-surface-container-low px-3 py-1 rounded-[10000px] border border-border-subtle">
                  Radicado digital:{' '}
                  <span className="font-semibold text-text-primary">{clientData.radicado}</span>
                </div>
              </div>

              {/* Legal Content & Parties Identification */}
              <div className="flex flex-col gap-6 font-body-sm text-body-sm text-text-secondary leading-relaxed pt-6">
                <p className="text-justify text-text-primary">
                  Entre los suscritos a saber: de una parte,{' '}
                  <strong className="text-text-primary font-semibold">CARLOS MENDOZA</strong>, mayor
                  de edad, identificado con Cédula de Ciudadanía No.{' '}
                  <strong className="text-text-primary font-semibold">1.032.456.789</strong> de Bogotá
                  D.C., quien para efectos del presente contrato se denominará{' '}
                  <strong className="text-text-primary font-semibold">EL CONTRATISTA</strong>; y de la
                  otra parte,{' '}
                  <strong className="text-text-primary font-semibold">{clientData.name}</strong>,
                  sociedad legalmente constituida con NIT{' '}
                  <strong className="text-text-primary font-semibold">{clientData.nit}</strong>,
                  representada legalmente por quien suscribe este instrumento, en adelante denominado{' '}
                  <strong className="text-text-primary font-semibold">EL CONTRATANTE</strong>, se ha
                  convenido celebrar el presente contrato de prestación de servicios, el cual se
                  regirá por las siguientes cláusulas:
                </p>

                {/* Clauses Narrative */}
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="font-semibold text-text-primary uppercase tracking-wide">
                      Cláusula Primera — Objeto:
                    </span>
                    <span className="ml-1">{contractObject}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary uppercase tracking-wide">
                      Cláusula Segunda — Alcance y Entregables:
                    </span>
                    <span className="ml-1">{scope}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary uppercase tracking-wide">
                      Cláusula Tercera — Vigencia:
                    </span>
                    <span className="ml-1">
                      El término de duración del presente contrato será de {duration}.
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary uppercase tracking-wide">
                      Cláusula Cuarta — Honorarios y Forma de Pago:
                    </span>
                    <span className="ml-1">
                      EL CONTRATANTE pagará a EL CONTRATISTA la suma total acordada de{' '}
                      <strong className="text-text-primary font-semibold">
                        {contractValue}
                      </strong>
                      , pagaderos según: {paymentSchedule}.
                    </span>
                  </div>
                </div>

                {/* Digital Signature Boxes */}
                <div className="pt-8 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-border-subtle">
                  {/* Contractor Signature */}
                  <div className="flex flex-col items-center text-center p-4 bg-surface-container-low rounded-xl border border-border-subtle">
                    <div className="w-full flex flex-col items-center justify-center h-20">
                      <span className="font-headline-sm italic text-primary font-serif select-none">
                        Carlos Mendoza C.
                      </span>
                      <div className="w-full h-[1px] bg-border-strong mt-2"></div>
                    </div>
                    <span className="font-semibold text-text-primary text-body-sm mt-2">
                      EL CONTRATISTA
                    </span>
                    <span className="text-caption font-caption text-text-subtlest">
                      Carlos Mendoza
                    </span>
                    <span className="text-caption font-caption text-text-subtlest">
                      C.C. 1.032.456.789 de Bogotá
                    </span>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-status-pagada font-medium">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>Certificado digital activo</span>
                    </div>
                  </div>

                  {/* Contracting Party Signature */}
                  <div className="flex flex-col items-center text-center p-4 bg-surface-container-low rounded-xl border border-border-subtle">
                    <div className="w-full flex flex-col items-center justify-center h-20">
                      <div className="h-10 flex items-center text-text-subtlest text-caption font-caption">
                        Pendiente de firma digital
                      </div>
                      <div className="w-full h-[1px] bg-border-strong mt-2"></div>
                    </div>
                    <span className="font-semibold text-text-primary text-body-sm mt-2">
                      EL CONTRATANTE
                    </span>
                    <span className="text-caption font-caption text-text-subtlest">
                      {clientData.name}
                    </span>
                    <span className="text-caption font-caption text-text-subtlest">
                      NIT {clientData.nit}
                    </span>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-text-subtlest font-medium">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>Invitación por emitir</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paper Footer */}
              <div className="pt-6 mt-6 flex items-center justify-between text-caption font-caption text-text-subtlest border-t border-border-subtle">
                <span>Página 1 de 1 • FreelanceOS Legal Document Hub</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">
                    security
                  </span>
                  Cifrado SHA-256
                </span>
              </div>
            </div>

            {/* Action Control Panel */}
            <div className="bg-canvas-white rounded-[20px] p-6 shadow-sm border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-space-md">
              <button
                className="w-full sm:w-auto h-[44px] px-6 rounded-[10000px] bg-canvas-white text-text-primary font-button-label text-button-label flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors shadow-sm border border-border-strong cursor-pointer"
                type="button"
                onClick={() => {
                  alert('Borrador de contrato descargado en formato PDF legal.');
                }}
              >
                <span className="material-symbols-outlined text-[20px] text-text-secondary">
                  picture_as_pdf
                </span>
                <span>Descargar borrador en PDF</span>
              </button>

              {/* Unique Primary Blue Pill Action (Height 58px) */}
              <button
                className="w-full sm:w-auto h-[58px] px-8 rounded-[10000px] bg-primary-container text-on-primary font-button-label text-button-label flex items-center justify-center gap-3 hover:bg-primary-hover active:bg-primary transition-all shadow-md cursor-pointer"
                id="btn-emitir-contrato"
                type="button"
                onClick={() => {
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 4000);
                }}
              >
                <span className="material-symbols-outlined text-[22px]">draw</span>
                <span className="text-[16px] font-semibold tracking-wide">
                  Emitir Contrato para Firma Digital
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
          <div className="bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-status-pagada text-[22px]">
              check_circle
            </span>
            <div className="flex flex-col">
              <span className="text-body-sm font-semibold">Contrato emitido con éxito</span>
              <span className="text-caption text-surface-container-highest">
                Notificación enviada a {clientData.name} para firma biométrica.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
