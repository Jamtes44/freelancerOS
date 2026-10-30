import React, { useState } from 'react';
import { ScreenId, FreelancerProfile } from '../types';
import { saveFreelancerProfile } from '../services/supabaseService';

interface ConfiguracionScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  profile: FreelancerProfile;
  onProfileSaved: (profile: FreelancerProfile) => void;
}

export const ConfiguracionScreen: React.FC<ConfiguracionScreenProps> = ({
  onNavigate,
  profile: savedProfile,
  onProfileSaved,
}) => {
  const [profile, setProfile] = useState(savedProfile);
  const [saveState, setSaveState] = useState<{ status: 'idle' | 'saving' | 'saved' | 'error'; message?: string }>({
    status: 'idle',
  });
  const isDirty = JSON.stringify(profile) !== JSON.stringify(savedProfile);

  const handleSave = async () => {
    setSaveState({ status: 'saving' });
    try {
      await saveFreelancerProfile(profile);
      onProfileSaved(profile);
      setSaveState({ status: 'saved' });
    } catch (e) {
      // Edits stay in the form so nothing typed is lost.
      setSaveState({ status: 'error', message: (e as any)?.message ?? String(e) });
    }
  };
  const [activeTab, setActiveTab] = useState<'emisor' | 'banco' | 'numeracion' | 'plantillas' | 'seguridad'>('emisor');
  const [transfiyaActive, setTransfiyaActive] = useState(true);

  return (
    <div className="flex flex-col w-full pb-32">
      <div className="max-w-[1200px] w-full mx-auto px-space-xl py-space-xl flex flex-col gap-space-xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm border-b border-border-subtle">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-[10000px] font-badge-label text-caption uppercase tracking-wider bg-surface-container-high text-text-secondary border border-border-subtle">
                Sistema &amp; Parámetros DIAN
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-text-primary font-semibold tracking-tight">
              Configuración General y Perfil Profesional
            </h1>
            <p className="font-body-md text-body-md text-text-secondary">
              Administra tus datos fiscales de emisor, cuentas bancarias, numeración DIAN y
              plantillas legales.
            </p>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10000px] bg-status-pagada/10 text-status-pagada font-badge-label text-caption border border-[#abf5d1]">
              <span className="w-2 h-2 rounded-full bg-status-pagada"></span>
              Certificado Digital Activo
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Pill style) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 select-none">
          <button
            className={`px-5 py-2 rounded-[10000px] font-button-label text-body-sm font-medium shrink-0 transition-colors shadow-sm cursor-pointer ${
              activeTab === 'emisor'
                ? 'bg-text-primary text-canvas-white'
                : 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low border border-border-subtle'
            }`}
            type="button"
            onClick={() => setActiveTab('emisor')}
          >
            Datos del Emisor
          </button>
          <button
            className={`px-5 py-2 rounded-[10000px] font-button-label text-body-sm font-medium shrink-0 transition-colors cursor-pointer ${
              activeTab === 'banco'
                ? 'bg-text-primary text-canvas-white'
                : 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low border border-border-subtle'
            }`}
            type="button"
            onClick={() => setActiveTab('banco')}
          >
            Cuentas Bancarias
          </button>
          <button
            className={`px-5 py-2 rounded-[10000px] font-button-label text-body-sm font-medium shrink-0 transition-colors cursor-pointer ${
              activeTab === 'numeracion'
                ? 'bg-text-primary text-canvas-white'
                : 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low border border-border-subtle'
            }`}
            type="button"
            onClick={() => setActiveTab('numeracion')}
          >
            Numeración y Consecutivos
          </button>
          <button
            className={`px-5 py-2 rounded-[10000px] font-button-label text-body-sm font-medium shrink-0 transition-colors cursor-pointer ${
              activeTab === 'plantillas'
                ? 'bg-text-primary text-canvas-white'
                : 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low border border-border-subtle'
            }`}
            type="button"
            onClick={() => onNavigate('contratos')}
          >
            Plantillas y Cláusulas
          </button>
          <button
            className={`px-5 py-2 rounded-[10000px] font-button-label text-body-sm font-medium shrink-0 transition-colors cursor-pointer ${
              activeTab === 'seguridad'
                ? 'bg-text-primary text-canvas-white'
                : 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low border border-border-subtle'
            }`}
            type="button"
            onClick={() => setActiveTab('seguridad')}
          >
            Seguridad
          </button>
        </div>

        {/* Card 1: Identificación del Freelancer / Emisor */}
        <section className="bg-canvas-white rounded-[20px] border border-border-subtle p-8 flex flex-col gap-space-lg shadow-none">
          <div className="flex items-start justify-between gap-space-md pb-space-sm border-b border-border-subtle">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-status-enviada-bg flex items-center justify-center text-status-enviada-text shrink-0">
                <span className="material-symbols-outlined text-[22px]">badge</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Identificación del Freelancer / Emisor
                </h2>
                <p className="font-body-sm text-body-sm text-text-secondary">
                  Información tributaria reflejada automáticamente en Facturas Electrónicas y
                  Cuentas de Cobro.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-[10000px] bg-surface-container-low text-text-secondary font-badge-label text-caption border border-border-subtle">
              RUT Verificado
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            <div className="flex flex-col gap-1.5">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Nombre Completo o Razón Social
              </label>
              <input
                className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Tipo y Número de Documento
              </label>
              <input
                className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                type="text"
                value={profile.docTypeAndNumber}
                onChange={(e) => setProfile({ ...profile, docTypeAndNumber: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Régimen Tributario
              </label>
              <div className="relative">
                <select
                  className="w-full h-10 px-3 pr-8 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary appearance-none focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container cursor-pointer transition-all"
                  value={profile.regime}
                  onChange={(e) => setProfile({ ...profile, regime: e.target.value })}
                >
                  <option value="Régimen Simple de Tributación (RST)">
                    Régimen Simple de Tributación (RST)
                  </option>
                  <option value="No Responsable de IVA">No Responsable de IVA</option>
                  <option value="Responsable de IVA (Régimen Común)">
                    Responsable de IVA (Régimen Común)
                  </option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-subtlest text-[20px]">
                  expand_more
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Actividad Económica Principal (CIIU)
              </label>
              <input
                className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                type="text"
                value={profile.ciiu}
                onChange={(e) => setProfile({ ...profile, ciiu: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Dirección Fiscal
              </label>
              <input
                className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Municipio / Departamento
              </label>
              <input
                className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Teléfono Móvil de Contacto
              </label>
              <input
                className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Correo Electrónico para Facturación &amp; Recepción DIAN
              </label>
              <div className="relative">
                <input
                  className="w-full h-10 pl-10 pr-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-subtlest text-[18px]">
                  mail
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Split Grid: Datos Bancarios & Certificado de Firma */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* Card 2: Datos Bancarios (7 Cols) */}
          <section className="lg:col-span-7 bg-canvas-white rounded-[20px] border border-border-subtle p-8 flex flex-col justify-between gap-space-lg shadow-none">
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-status-pagada/10 flex items-center justify-center text-status-pagada shrink-0">
                    <span className="material-symbols-outlined text-[22px]">account_balance</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                      Datos Bancarios para Recaudos
                    </h2>
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      Destino predeterminado de pagos vía transferencias y pagos instantáneos Bre-B.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cuenta Principal */}
              <div className="p-space-md rounded-[12px] bg-surface-container-low border border-border-subtle flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-canvas-white border border-border-subtle flex items-center justify-center font-semibold text-text-primary text-[11px] tracking-tight shadow-sm">
                      BAN
                    </div>
                    <div>
                      <div className="font-body-sm text-body-sm font-semibold text-text-primary flex items-center gap-2">
                        {profile.bankName || 'Sin banco registrado'}
                        <span className="px-2 py-0.5 rounded-[10000px] text-[10px] font-badge-label uppercase tracking-wide bg-status-enviada-bg text-status-enviada-text">
                          Principal
                        </span>
                      </div>
                      <span className="font-caption text-caption text-text-secondary">
                        {[profile.bankAccount, profile.legalName || profile.name].filter(Boolean).join(' • ')}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-status-pagada text-[22px]">
                    verified
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border-subtle">
                  <div>
                    <span className="font-caption text-caption text-text-subtlest uppercase">
                      Número de Cuenta
                    </span>
                    <p className="font-body-md text-body-md font-semibold text-text-primary tracking-wider">
                      {profile.maskedAccount}
                    </p>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-text-subtlest uppercase">
                      Certificado Bancario
                    </span>
                    <p className="font-body-sm text-body-sm text-status-enviada-text font-medium flex items-center gap-1 cursor-pointer hover:underline">
                      <span className="material-symbols-outlined text-[16px]">attach_file</span>
                      Vigente (Exp. Ene 2025)
                    </p>
                  </div>
                </div>
              </div>

              {/* Transfiya / Bre-B */}
              <div className="p-space-md rounded-[12px] bg-canvas-white border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                        Llave Transfiya / Bre-B
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-badge-label uppercase bg-[#fff0b3] text-[#c75300]">
                        Inmediato
                      </span>
                    </div>
                    <span className="font-caption text-caption text-text-secondary">
                      Celular registrado: {profile.transfiyaPhone}
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={transfiyaActive}
                    onChange={(e) => setTransfiyaActive(e.target.checked)}
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-9 h-5 bg-border-strong peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-canvas-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-canvas-white after:border-border-strong after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                className="h-11 px-5 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label text-body-sm font-medium hover:bg-surface-container-low transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                type="button"
                onClick={() => {
                  alert('Esta función todavía no está disponible.');
                }}
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Vincular otra cuenta bancaria
              </button>
            </div>
          </section>

          {/* Card 3: Certificado de Firma y Logotipo (5 Cols) */}
          <section className="lg:col-span-5 bg-canvas-white rounded-[20px] border border-border-subtle p-8 flex flex-col justify-between gap-space-lg shadow-none">
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm pb-space-sm border-b border-border-subtle">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-text-primary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">draw</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                    Firma y Logotipo
                  </h2>
                  <p className="font-body-sm text-body-sm text-text-secondary">
                    Elementos visuales impresos en PDFs.
                  </p>
                </div>
              </div>

              {/* Preview de Firma */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                    Firma Digitalizada
                  </span>
                  <span className="font-caption text-caption text-status-pagada font-medium">
                    Validada SHA-256
                  </span>
                </div>
                <div className="h-28 w-full rounded-[10px] bg-surface-container-low border border-dashed border-border-strong flex flex-col items-center justify-center p-3 relative group overflow-hidden">
                  <svg
                    className="w-48 h-16 text-text-primary/80"
                    fill="none"
                    viewBox="0 0 200 60"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 38C25 35 45 22 55 20C65 18 68 32 60 40C52 48 35 45 42 30C49 15 70 12 85 24C100 36 110 38 120 28C130 18 135 15 145 25C155 35 160 38 185 22"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.2"
                    ></path>
                    <path
                      d="M48 48C70 47 115 45 165 42"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.8"
                    ></path>
                  </svg>
                  <div className="absolute inset-0 bg-text-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="font-caption text-caption text-text-primary font-medium bg-canvas-white px-2 py-1 rounded shadow-sm">
                      Vista previa oficial
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview de Logotipo */}
              <div className="flex items-center gap-space-md p-3 rounded-[10px] bg-surface-container-low border border-border-subtle">
                <div className="w-14 h-14 rounded-lg bg-canvas-white border border-border-subtle flex items-center justify-center p-2 shrink-0">
                  <div className="w-10 h-10 rounded bg-primary-container text-white flex items-center justify-center font-bold text-lg">
                    F
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-sm text-body-sm font-semibold text-text-primary truncate">
                    mendoza-brand-dark.svg
                  </span>
                  <span className="font-caption text-caption text-text-subtlest">
                    Vectorial • Fondo transparente
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                className="w-full h-11 px-5 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label text-body-sm font-medium hover:bg-surface-container-low hover:border-text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                type="button"
                onClick={() => {
                  alert('Esta función todavía no está disponible.');
                }}
              >
                <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                Reemplazar firma o logotipo
              </button>
            </div>
          </section>
        </div>

        {/* Card 4: Consecutivos Vigentes DIAN y Operativos */}
        <section className="bg-canvas-white rounded-[20px] border border-border-subtle p-8 flex flex-col gap-space-lg shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-border-subtle">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-status-enviada-bg flex items-center justify-center text-status-enviada-text shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  format_list_numbered
                </span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Consecutivos y Resoluciones Vigentes
                </h2>
                <p className="font-body-sm text-body-sm text-text-secondary">
                  Control de prefijos, vigencias DIAN y numeración de documentos legales.
                </p>
              </div>
            </div>
            <button
              className="h-9 px-4 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label text-caption hover:bg-surface-container-low transition-colors self-start sm:self-auto flex items-center gap-1.5 cursor-pointer shadow-sm"
              type="button"
              onClick={() => {
                alert('Esta función todavía no está disponible.');
              }}
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              Sincronizar con DIAN
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* Factura Electrónica */}
            <div className="p-space-md rounded-[12px] border border-border-subtle bg-canvas-white hover:bg-[#f7f8f9] transition-colors flex flex-col justify-between gap-space-md">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                    Facturación DIAN
                  </span>
                  <span className="px-2 py-0.5 rounded-[10000px] font-badge-label text-[10px] uppercase bg-[#e3fcef] text-[#22a06b] border border-[#abf5d1]">
                    Activa
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-semibold text-text-primary">
                    Prefijo FAC-2025
                  </span>
                  <span className="font-caption text-caption text-text-subtlest">
                    Res. DIAN No. 18764000291
                  </span>
                </div>
                <div className="pt-1">
                  <div className="flex justify-between font-caption text-caption text-text-secondary mb-1">
                    <span>Rango: FAC-2025-001 al 100</span>
                    <span className="font-semibold text-text-primary">64% usado</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border-subtle font-caption text-caption text-text-subtlest">
                <span>Vence: 18 Dic 2025</span>
                <span
                  className="text-status-enviada-text font-medium cursor-pointer hover:underline"
                  onClick={() => onNavigate('facturas')}
                >
                  Detalles
                </span>
              </div>
            </div>

            {/* Cuentas de Cobro */}
            <div className="p-space-md rounded-[12px] border border-border-subtle bg-canvas-white hover:bg-[#f7f8f9] transition-colors flex flex-col justify-between gap-space-md">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                    Cuentas de Cobro
                  </span>
                  <span className="px-2 py-0.5 rounded-[10000px] font-badge-label text-[10px] uppercase bg-surface-container-low text-text-secondary border border-border-subtle">
                    Interno
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-semibold text-text-primary">
                    Prefijo CC
                  </span>
                  <span className="font-caption text-caption text-text-subtlest">
                    Control administrativo libre
                  </span>
                </div>
                <div className="pt-1">
                  <div className="flex justify-between font-caption text-caption text-text-secondary mb-1">
                    <span>Rango: CC-001 a CC-200</span>
                    <span className="font-semibold text-text-primary">31% usado</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-status-pagada h-full rounded-full" style={{ width: '31%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border-subtle font-caption text-caption text-text-subtlest">
                <span>Último: CC-062</span>
                <span
                  className="text-status-enviada-text font-medium cursor-pointer hover:underline"
                  onClick={() => onNavigate('cuentas-cobro')}
                >
                  Editar rango
                </span>
              </div>
            </div>

            {/* Contratos de Prestación de Servicios */}
            <div className="p-space-md rounded-[12px] border border-border-subtle bg-canvas-white hover:bg-[#f7f8f9] transition-colors flex flex-col justify-between gap-space-md">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                    Contratos de Servicios
                  </span>
                  <span className="px-2 py-0.5 rounded-[10000px] font-badge-label text-[10px] uppercase bg-surface-container-low text-text-secondary border border-border-subtle">
                    Legal
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-semibold text-text-primary">
                    Prefijo FOS
                  </span>
                  <span className="font-caption text-caption text-text-subtlest">
                    Minutas contractuales COP
                  </span>
                </div>
                <div className="pt-1">
                  <div className="flex justify-between font-caption text-caption text-text-secondary mb-1">
                    <span>Rango: FOS-001 a FOS-100</span>
                    <span className="font-semibold text-text-primary">18% usado</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border-subtle font-caption text-caption text-text-subtlest">
                <span>Último: FOS-018</span>
                <span
                  className="text-status-enviada-text font-medium cursor-pointer hover:underline"
                  onClick={() => onNavigate('contratos')}
                >
                  Configurar
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Barra inferior fija con Único Botón Primario Azul (Alto 58px) */}
      <aside className="fixed bottom-0 left-0 lg:left-[260px] right-0 bg-canvas-white border-t border-border-subtle px-space-md lg:px-space-xl py-3 z-40 flex items-center justify-between select-none shadow-xl">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-2 text-text-subtlest font-caption text-caption">
            <span className="w-2 h-2 rounded-full bg-status-pagada"></span>
            <span>Los datos del emisor se usan en tus facturas, cuentas de cobro y contratos.</span>
          </div>
        </div>
        <div className="flex items-center gap-space-md">
          <span
            role="status"
            className={`hidden sm:inline-block font-body-sm text-body-sm ${
              saveState.status === 'error' ? 'text-status-vencida' : 'text-text-subtlest'
            }`}
          >
            {saveState.status === 'saving'
              ? 'Guardando...'
              : saveState.status === 'error'
              ? `No se pudo guardar: ${saveState.message}`
              : isDirty
              ? 'Tienes cambios sin guardar'
              : saveState.status === 'saved'
              ? 'Cambios guardados'
              : ''}
          </span>

          {/* Target for: //button[contains(., 'Guardar cambios')] */}
          <button
            className="h-[58px] px-8 rounded-[10000px] bg-primary-container hover:bg-primary-hover active:bg-[#09326c] text-canvas-white font-button-label text-body-md font-medium transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-default"
            type="button"
            disabled={!isDirty || saveState.status === 'saving'}
            onClick={handleSave}
          >
            <span className="material-symbols-outlined text-[20px]">check</span>
            <span>Guardar cambios</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
