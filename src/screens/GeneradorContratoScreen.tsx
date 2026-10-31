import React, { useState } from 'react';
import { ScreenId, Contract, Client, FreelancerProfile } from '../types';
import { formatCOP, nextDocumentNumber, addDaysISO } from '../utils/calculations';
import { printDocument } from '../utils/print';
import { createContract } from '../services/supabaseService';

interface GeneradorContratoScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  /** Starting text and clauses for a new contract. */
  template: Contract;
  contracts: Contract[];
  clients: Client[];
  profile: FreelancerProfile;
  initialClientId?: string;
  onSaved: (contract: Contract) => void;
  /** When set, shows this saved contract read-only (to review it or download its PDF again). */
  existing?: Contract;
}

export const GeneradorContratoScreen: React.FC<GeneradorContratoScreenProps> = ({
  onNavigate,
  template,
  contracts,
  clients,
  profile,
  initialClientId,
  onSaved,
  existing,
}) => {
  const contract = existing ?? template;
  const contractNumber = existing?.number ?? nextDocumentNumber('CTR', contracts.map((c) => c.number));
  const [selectedClient, setSelectedClient] = useState(
    existing?.clientId || initialClientId || clients[0]?.id || ''
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [contractObject, setContractObject] = useState(contract.object);
  const [scope, setScope] = useState(contract.scope);
  const [duration, setDuration] = useState(contract.duration);
  const [contractValue, setContractValue] = useState(formatCOP(contract.totalValue, true));
  const [paymentSchedule, setPaymentSchedule] = useState(contract.paymentSchedule);
  const [clauses, setClauses] = useState(contract.clauses);

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

  const client = clients.find((c) => c.id === selectedClient);
  const clientName = (client?.legalName || client?.name || 'CLIENTE SIN SELECCIONAR').toUpperCase();
  const clientNit = client?.nit ?? '—';
  const contractorName = profile.legalName || profile.name || 'COMPLETA TU PERFIL EN CONFIGURACIÓN';

  const handleSave = async () => {
    const totalValue = parseInt(contractValue.replace(/\D/g, ''), 10) || 0;
    if (!client) return setSaveError('Selecciona un cliente.');
    if (!contractObject.trim()) return setSaveError('Escribe el objeto del contrato.');
    if (totalValue <= 0) return setSaveError('Escribe el valor total del contrato.');
    setSaving(true);
    setSaveError('');
    try {
      const saved = await createContract({
        id: crypto.randomUUID(),
        number: contractNumber,
        clientId: client.id,
        clientName: client.legalName || client.name,
        nit: client.nit,
        object: contractObject.trim(),
        scope: scope.trim(),
        duration: duration.trim(),
        totalValue,
        paymentSchedule: paymentSchedule.trim(),
        status: 'Borrador',
        clauses,
        date: addDaysISO(0),
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
              <span className="text-text-secondary font-medium">{existing ? contractNumber : 'Nuevo contrato'}</span>
            </div>
            <h1 className="font-currency-display text-currency-display text-text-primary font-medium tracking-tight">
              {existing ? `Contrato ${contractNumber}` : 'Generador de Contrato de Prestación de Servicios'}
            </h1>
          </div>

          {/* Top Action Toolbar */}
          <div className="flex items-center gap-space-sm self-start md:self-auto">
            {existing && (
              <span className="inline-flex items-center px-3 py-1 bg-surface-container-low text-text-secondary rounded-[10000px] font-badge-label text-badge-label">
                {existing.status}
              </span>
            )}
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* LEFT COLUMN: Contract Parameters & Clauses (read-only when viewing a saved contract) */}
          <fieldset disabled={!!existing} className="lg:col-span-6 flex flex-col gap-space-md min-w-0 border-0 p-0 m-0 disabled:opacity-80">
            <div className="bg-canvas-white rounded-[20px] p-space-xl border border-border-subtle flex flex-col gap-space-lg">
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
                      className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer pr-10"
                      id="client-select"
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                    >
                      {clients.length === 0 && <option value="">Primero registra un cliente</option>}
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — NIT {c.nit}
                        </option>
                      ))}
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
                    className="w-full p-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
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
                    className="w-full p-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
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
                        className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container"
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
                        className="w-full h-10 px-3 font-semibold bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container"
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
                    className="w-full p-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
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
                      className="group bg-surface-container-low rounded-[20px] p-space-md transition-all border border-border-subtle"
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
                            className="w-full p-2.5 bg-canvas-white border border-border-strong rounded-[3px] font-body-sm text-body-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
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
          </fieldset>

          {/* RIGHT COLUMN: Realtime Editorial Contract Preview */}
          <div className="lg:col-span-6 flex flex-col gap-space-md sticky top-20">
            {/* Document Sheet Card */}
            <div className="print-area bg-canvas-white rounded-[20px] border border-border-subtle p-8 md:p-12 text-text-primary flex flex-col justify-between relative overflow-hidden">
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
                  <span className="font-semibold text-text-primary">{contractNumber}</span>
                </div>
              </div>

              {/* Legal Content & Parties Identification */}
              <div className="flex flex-col gap-6 font-body-sm text-body-sm text-text-secondary leading-relaxed pt-6">
                <p className="text-justify text-text-primary">
                  Entre los suscritos a saber: de una parte,{' '}
                  <strong className="text-text-primary font-semibold uppercase">{contractorName}</strong>, mayor
                  de edad, identificado con{' '}
                  <strong className="text-text-primary font-semibold">{profile.docTypeAndNumber || '—'}</strong>,
                  quien para efectos del presente contrato se denominará{' '}
                  <strong className="text-text-primary font-semibold">EL CONTRATISTA</strong>; y de la
                  otra parte,{' '}
                  <strong className="text-text-primary font-semibold">{clientName}</strong>,
                  sociedad legalmente constituida con NIT{' '}
                  <strong className="text-text-primary font-semibold">{clientNit}</strong>,
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
                  <div className="flex flex-col items-center text-center p-4 bg-surface-container-low rounded-[20px] border border-border-subtle">
                    <div className="w-full flex flex-col items-center justify-end h-20">
                      {profile.signature && <img src={profile.signature} alt="Firma del contratista" className="max-h-16 max-w-full object-contain" />}
                      <div className="w-full h-[1px] bg-border-strong"></div>
                    </div>
                    <span className="font-semibold text-text-primary text-body-sm mt-2">
                      EL CONTRATISTA
                    </span>
                    <span className="text-caption font-caption text-text-subtlest">{profile.name}</span>
                    <span className="text-caption font-caption text-text-subtlest">{profile.docTypeAndNumber}</span>
                  </div>

                  {/* Contracting Party Signature */}
                  <div className="flex flex-col items-center text-center p-4 bg-surface-container-low rounded-[20px] border border-border-subtle">
                    <div className="w-full flex flex-col items-center justify-center h-20">
                      <div className="h-10 flex items-center text-text-subtlest text-caption font-caption">
                        Pendiente de firma digital
                      </div>
                      <div className="w-full h-[1px] bg-border-strong mt-2"></div>
                    </div>
                    <span className="font-semibold text-text-primary text-body-sm mt-2">
                      EL CONTRATANTE
                    </span>
                    <span className="text-caption font-caption text-text-subtlest">{clientName}</span>
                    <span className="text-caption font-caption text-text-subtlest">NIT {clientNit}</span>
                  </div>
                </div>
              </div>

              {/* Paper Footer */}
              <div className="pt-6 mt-6 flex items-center justify-between text-caption font-caption text-text-subtlest border-t border-border-subtle">
                <span>Página 1 de 1 • FreelanceOS Legal Document Hub</span>
              </div>
            </div>

            {/* Action Control Panel */}
            <div className="bg-canvas-white rounded-[20px] p-6 border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-space-md">
              <button
                className="w-full sm:w-auto h-[44px] px-6 rounded-[10000px] bg-canvas-white text-text-primary font-button-label text-button-label flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors border border-border-strong cursor-pointer"
                type="button"
                onClick={() => printDocument(`Contrato ${contractNumber}`)}
              >
                <span className="material-symbols-outlined text-[20px] text-text-secondary">
                  picture_as_pdf
                </span>
                <span>{existing ? 'Descargar PDF' : 'Descargar borrador en PDF'}</span>
              </button>

              {existing ? (
                <button
                  className="w-full sm:w-auto h-[44px] px-6 rounded-[10000px] bg-canvas-white text-text-primary font-button-label text-button-label flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors border border-border-strong cursor-pointer"
                  type="button"
                  onClick={() => onNavigate('documentos')}
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Volver a Documentos
                </button>
              ) : (
                <button
                  className="w-full sm:w-auto h-[58px] px-8 rounded-[10000px] bg-primary-container text-on-primary font-button-label text-button-label flex items-center justify-center gap-3 hover:bg-primary-hover active:bg-primary transition-all cursor-pointer disabled:opacity-60"
                  id="btn-emitir-contrato"
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                >
                  <span className="material-symbols-outlined text-[22px]">save</span>
                  <span className="text-[16px] font-semibold tracking-wide">{saving ? 'Guardando...' : 'Guardar contrato'}</span>
                </button>
              )}
            </div>
            {saveError && (
              <p role="alert" className="font-body-sm text-body-sm text-status-vencida px-2">
                {saveError}
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
